import React, { useState } from 'react';

const UserProfileModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('Nguyễn Văn A');
  const [email, setEmail] = useState('email@example.com');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-black">Cập nhật thông tin cá nhân</h2>

        {/* Phần Thay đổi ảnh đại diện */}
        <div className="flex items-center justify-center mb-6 relative">
          <img
            src="https://i.pravatar.cc/150?img=10"
            alt="Avatar"
            className="w-24 h-24 rounded-full border border-gray-300"
          />
          <div className="absolute bottom-0 right-0 bg-gray-300 p-1 rounded-full cursor-pointer hover:bg-gray-400">
            <input type="file" accept="image/*" className="hidden" id="avatar-upload" />
            <label htmlFor="avatar-upload">
              <img
                src="https://img.icons8.com/ios-glyphs/30/000000/camera--v1.png"
                alt="Change Avatar"
                className="w-6 h-6"
              />
            </label>
          </div>
        </div>

        {/* Họ và tên */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-1">Họ và tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Mật khẩu */}
        <div className="mb-4 flex items-center">
          <label className="block text-sm font-medium text-black mb-1 flex-grow">Mật khẩu</label>
          <button
            className="ml-4 bg-gray-200 text-blue-500 px-3 py-1 rounded hover:bg-gray-300"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            Đổi mật khẩu
          </button>
        </div>

        {/* Form đổi mật khẩu (ẩn/hiện dựa trên trạng thái showChangePassword) */}
        {showChangePassword && (
          <div className="space-y-4">
            {/* Mật khẩu hiện tại */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">Mật khẩu hiện tại</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Mật khẩu mới */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">Mật khẩu mới</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showNewPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Nhập lại mật khẩu mới */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">Nhập lại mật khẩu mới</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Button cập nhật thông tin */}
        <button
          className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold"
        >
          Cập nhật thông tin
        </button>

        {/* Button đóng */}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-semibold"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default UserProfileModal;
