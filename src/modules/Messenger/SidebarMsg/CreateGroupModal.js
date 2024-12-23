import React, { useState, useEffect } from 'react';

const CreateGroupModal = ({ onClose, onGroupChange}) => {
  const [users, setUsers] = useState([]); 
  const [selectedUsers, setSelectedUsers] = useState([]); 
  const [groupName, setGroupName] = useState(''); 
  const defaultImage = 'default-avatar.png'; 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8090/api/users', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (!response.ok) {
          throw new Error('Lỗi khi lấy danh sách người dùng');
        }

        const data = await response.json();
        setUsers(data.result || []); 
      } catch (err) {
        console.error('Lỗi:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleConfirm = async () => {
    const memberEmails = users
      .filter((user) => selectedUsers.includes(user.id))
      .map((user) => user.email);

    if (!groupName.trim()) {
      alert('Vui lòng nhập tên nhóm.');
      return;
    }

    if (memberEmails.length === 0) {
      alert('Vui lòng chọn ít nhất một thành viên để tạo nhóm.');
      return;
    }

    const groupData = {
      name: groupName.trim(),
      memberEmails,
    };

    try {
      const response = await fetch('http://localhost:8090/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(groupData),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi tạo nhóm mới.');
      }

      const data = await response.json();
      console.log('Tạo nhóm thành công:', data);

      onGroupChange(data.result)
      alert('Nhóm đã được tạo thành công!');
      onClose(); 
    } catch (err) {
      console.error('Lỗi:', err);
      alert('Đã xảy ra lỗi khi tạo nhóm.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Tạo nhóm mới</h2>

        {/* Input tên nhóm */}
        <input
          type="text"
          placeholder="Nhập tên nhóm"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-4"
        />

        {/* Danh sách người dùng */}
        <div className="flex flex-col space-y-2 max-h-64 overflow-y-auto">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="flex items-center space-x-2">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  value={user.id}
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                  className="mr-2"
                />
                {/* Hình ảnh người dùng */}
                <img
                  src={user.imagePath ? `http://localhost:8090/profile/${user.imagePath}` : defaultImage}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {/* Thông tin người dùng */}
                <label className="flex-1 flex items-center">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-gray-500 text-sm">{user.email}</div>
                  </div>
                </label>
              </div>
            ))
          ) : (
            <div className="text-gray-500">Không có người dùng nào</div>
          )}
        </div>

        {/* Nút hành động */}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
