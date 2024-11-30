import React, { useState, useEffect } from "react";

const UserProfileModal = ({ isOpen, onClose, user }) => {
  const [name, setName] = useState(user?.name || "Nguyễn Văn A");
  const [email, setEmail] = useState(user?.email || "email@example.com");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(user?.imagePath ? `http://localhost:8090/profile/${user.imagePath}` : "");

  // Điều chỉnh khi modal đóng
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPreviewImage(user.imagePath ? `http://localhost:8090/profile/${user.imagePath}` : "");
    }
  }, [user]);

  if (!isOpen) return null;

  const handleUpdateProfile = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name || "");
    formData.append("oldPassword", currentPassword || "");
    formData.append("newPassword", newPassword || "");
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://localhost:8090/api/users/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Đã xảy ra lỗi khi cập nhật!");
      }

      const result = await response.json();
      alert(result.message || "Cập nhật thành công!");
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-black">
          Cập nhật thông tin cá nhân
        </h2>

        {/* Phần Thay đổi ảnh đại diện */}
        <div className="flex items-center justify-center mb-6 relative">
          <img
            src={previewImage || "https://i.pravatar.cc/150?img=10"}
            alt="Avatar"
            className="w-24 h-24 rounded-full border border-gray-300"
          />
          <div className="absolute bottom-0 right-0 bg-gray-300 p-1 rounded-full cursor-pointer hover:bg-gray-400">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="avatar-upload"
              onChange={handleImageChange}
            />
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
        <div className="mb-2">
          <label className="block text-sm font-medium text-black mb-1">
            Họ và tên
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Email */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-black mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-gray-100 text-black"
          />
        </div>

        {/* Mật khẩu */}
        <div className="mb-2 flex items-center">
          <label className="block text-sm font-medium text-black mb-1 flex-grow">
            
          </label>
          <button
            className="ml-4 bg-gray-200 text-blue-500 px-3 py-1 rounded hover:bg-gray-300"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            Đổi mật khẩu
          </button>
        </div>

        {showChangePassword && (
          <>
            <div className="mb-2">
              <label className="block text-sm font-medium text-black mb-1">Mật khẩu cũ</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full text-black"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? '👁️' : '👁️‍🗨️'} {/* Biểu tượng mắt */}
                </button>
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-black mb-1">Mật khẩu mới</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full text-black"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? '👁️' : '👁️‍🗨️'} {/* Biểu tượng mắt */}
                </button>
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-black mb-1">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full text-black"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'} {/* Biểu tượng mắt */}
                </button>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between mt-6">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Đóng
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleUpdateProfile}
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
