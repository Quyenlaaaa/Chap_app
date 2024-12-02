import React, { useState, useEffect } from 'react';
import GroupItem from './GroupItem';
import CreateGroupModal from './CreateGroupModal';

const SidebarMsg = ({ onGroupSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:8090/api/rooms/user-rooms', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (!response.ok) {
          throw new Error('Lỗi khi lấy danh sách nhóm');
        }

        const data = await response.json();
        setGroups(data.result);
      } catch (err) {
        setError('Không thể tải danh sách nhóm');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="w-80 text-center p-4">Đang tải danh sách nhóm...</div>;
  }

  if (error) {
    return <div className="w-80 text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="w-80 bg-white text-gray-800 p-4 flex flex-col border-r border-gray-300">
      <div className="text-2xl font-semibold mb-4">Danh sách nhóm</div>
      <input
        type="text"
        placeholder="Tìm kiếm nhóm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="flex flex-col space-y-2 mb-4">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <GroupItem
              key={group.id}
              id={group.id}
              name={group.name}
              onClick={() => onGroupSelect(group.id)} // Hàm callback để chọn nhóm
            />
          ))
        ) : (
          <div className="text-gray-500 text-center">Không tìm thấy nhóm nào</div>
        )}
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        + Tạo nhóm mới
      </button>
      {showModal && <CreateGroupModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default SidebarMsg;
