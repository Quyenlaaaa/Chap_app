import React, { useState, useEffect } from 'react';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import UserProfileModal from '../UserProfile/UserProfileModal';

const SidebarMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userAvatar, setUserAvatar] = useState('');
  const [showGroups, setShowGroups] = useState(false); // Hiển thị danh sách nhóm
  const [groups, setGroups] = useState([]); // Danh sách nhóm

  // Lấy thông tin người dùng
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8090/api/users/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (!response.ok) {
          throw new Error('Lỗi khi lấy thông tin người dùng');
        }

        const data = await response.json();
        const userData = data.result;
        setUser(userData);
        setUserAvatar(`http://localhost:8090/profile/${userData.imagePath}`);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

    fetchUser();
  }, []);

  // Lấy danh sách nhóm
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
        setGroups(data.result || []); // Cập nhật danh sách nhóm
      } catch (error) {
        console.error('Lỗi khi lấy danh sách nhóm:', error);
      }
    };

    if (showGroups) {
      fetchGroups();
    }
  }, [showGroups]);

  const handleAvatarClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-16 bg-black text-white flex flex-col items-center py-4 space-y-6">
        <img
          src={userAvatar || 'https://i.pravatar.cc/150?img=10'}
          alt="User Avatar"
          className="w-12 h-12 rounded-full mb-4 cursor-pointer"
          onClick={handleAvatarClick}
        />

        <div className="flex flex-col items-center space-y-6">
          {/* Icon Cài đặt */}
          <button
            className="hover:bg-blue-600 p-2 rounded-lg transition duration-200 ease-in-out"
            onClick={() => setShowGroups(!showGroups)}
          >
            <FaCog size={24} />
          </button>

          {/* Icon Đăng xuất */}
          <button
            className="hover:bg-blue-600 p-2 rounded-lg transition duration-200 ease-in-out"
            onClick={() => console.log('Đăng xuất')}
          >
            <FaSignOutAlt size={24} />
          </button>
        </div>

        <UserProfileModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          user={user}
        />
      </div>

      {/* Danh sách nhóm */}
      {showGroups && (
        <div className="w-64 bg-gray-800 text-white h-full p-4 overflow-y-auto transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4">Danh sách nhóm</h2>
          <ul className="space-y-3">
            {groups.length ? (
              groups.map((group) => (
                <li
                  key={group.id}
                  className="p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer"
                  onClick={() => console.log(`Đi đến nhóm ${group.name}`)}
                >
                  {group.name}
                </li>
              ))
            ) : (
              <li>Không có nhóm nào</li>
            )}
          </ul>
          {/* Nút đóng */}
          <button
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => setShowGroups(false)}
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
};

export default SidebarMenu;
