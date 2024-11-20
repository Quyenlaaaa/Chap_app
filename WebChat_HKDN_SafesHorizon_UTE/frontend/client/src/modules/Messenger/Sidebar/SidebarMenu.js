import React, { useState } from 'react';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import UserProfileModal from '../UserProfile/UserProfileModal';

const SidebarMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userAvatar = 'https://i.pravatar.cc/150?img=10';

  const handleAvatarClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-16 bg-black text-white flex flex-col items-center py-4 space-y-6">
      {/* Avatar của người dùng */}
      <img
        src={userAvatar}
        alt="User Avatar"
        className="w-12 h-12 rounded-full mb-4 cursor-pointer"
        onClick={handleAvatarClick}
      />

      {/* Icon Cài đặt (Chuyển thành button) */}
      <div className="flex flex-col items-center space-y-6">
        <button
          className="hover:bg-blue-600 p-2 rounded-lg transition duration-200 ease-in-out"
          onClick={() => console.log('Đi đến trang cài đặt')}
        >
          <FaCog size={24} />
        </button>

        {/* Icon Đăng xuất (Chuyển thành button) */}
        <button
          className="hover:bg-blue-600 p-2 rounded-lg transition duration-200 ease-in-out"
          onClick={() => console.log('Đăng xuất')}
        >
          <FaSignOutAlt size={24} />
        </button>
      </div>

      {/* Modal Hồ sơ người dùng */}
      <UserProfileModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default SidebarMenu;
