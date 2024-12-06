import "./topbar.css";
import { Settings, Logout } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import UserProfileModal from "../../modules/Messenger/UserProfile/UserProfileModal";

export default function Topbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null); 
  const [userAvatar, setUserAvatar] = useState(''); 

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

    const handleAvatarChange = (newAvatarUrl) => {
      setUserAvatar(newAvatarUrl); 
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">WebChatZ</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
          <img 
          onClick={handleAvatarClick}
          src={user && user.imagePath?userAvatar:"http://localhost:8090/profile/default-avatar-url.png"} alt="" className="topAvatar" />
          </div>
          <div className="topbarIconContainer">
            <Settings />
          </div>  
          <div className="topbarIconContainer">
            <Logout />
          </div>
        </div>
      </div>
      {/* Modal Hồ sơ người dùng */}
      <UserProfileModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        user={user} 
        onAvatarChange={handleAvatarChange}
      />
    </div>
  );
}
