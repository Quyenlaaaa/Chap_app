import React, { useState, useEffect } from 'react';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import UserProfileModal from '../UserProfile/UserProfileModal';

const SidebarMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null); // Lưu thông tin người dùng
  const [userAvatar, setUserAvatar] = useState(''); // Lưu ảnh đại diện người dùng

  // Lấy thông tin người dùng
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8090/api/users/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!response.ok) {
          throw new Error('Lỗi khi lấy thông tin người dùng');
        }

        const data = await response.json();
        const userData = data.result; // Dữ liệu người dùng từ API
        setUser(userData); // Lưu thông tin người dùng
        // Lấy ảnh người dùng
        setUserAvatar(`http://localhost:8090/profile/${userData.imagePath}`);
        
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

    fetchUser();
  }, []);

  const handleAvatarClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!user) return <div>Loading...</div>; // Chờ lấy thông tin người dùng

  return (
    <div className="w-16 bg-black text-white flex flex-col items-center py-4 space-y-6">
      {/* Avatar của người dùng */}
      <img
        src={userAvatar || 'https://i.pravatar.cc/150?img=10'} // Nếu chưa có avatar, dùng avatar mặc định
        alt="User Avatar"
        className="w-12 h-12 rounded-full mb-4 cursor-pointer"
        onClick={handleAvatarClick}
      />

      {/* Icon Cài đặt */}
      <div className="flex flex-col items-center space-y-6">
        <button
          className="hover:bg-blue-600 p-2 rounded-lg transition duration-200 ease-in-out"
          onClick={() => console.log('Đi đến trang cài đặt')}
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

      {/* Modal Hồ sơ người dùng */}
      <UserProfileModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        user={user} // Truyền thông tin người dùng vào modal
      />
    </div>
  );
};

export default SidebarMenu;
