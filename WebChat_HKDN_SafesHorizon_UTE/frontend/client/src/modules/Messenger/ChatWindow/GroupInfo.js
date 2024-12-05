import React, { useState, useEffect } from "react";
import { FaVideo, FaInfoCircle, FaUserPlus, FaSignOutAlt,FaTimes  } from "react-icons/fa";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GroupInfo({ groupId, memberCount, users, onClose }) {
  const [localUsers, setLocalUsers] = useState(users);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  // Hàm fetch thông tin thành viên (fetchGroupInfo) trong GroupInfo
  const fetchGroupInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8090/api/rooms/${groupId}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.code === 1000) {
        const members = data.result;
        setLocalUsers(members);
      } else {
        console.error("Lỗi khi lấy danh sách thành viên:", data.message);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  // Gọi fetchGroupInfo khi component mount hoặc groupId thay đổi
  useEffect(() => {
    fetchGroupInfo();
  }, [groupId]);

  // Hàm để toggle menu của từng thành viên
  const toggleMemberMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleRemoveMember = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8090/api/rooms/remove-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId: groupId,
          userId,
        }),
      });
  
      const data = await response.json();
      if (response.ok && data.code === 1000) {
        // Hiển thị thông báo thành công
        toast.success("Thành viên đã được xóa khỏi nhóm!");
        fetchGroupInfo(); // Cập nhật danh sách thành viên sau khi xóa
      } else {
        // Hiển thị thông báo lỗi
        toast.error(`Lỗi khi xóa thành viên: ${data.message}`);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API xóa thành viên:", error);
      // Hiển thị thông báo lỗi khi có sự cố kết nối
      toast.error("Đã xảy ra lỗi khi xóa thành viên. Vui lòng thử lại.");
    }
  };
  const openAddMemberDialog = () => {
    setIsAddMemberDialogOpen(true);
  };

  const closeAddMemberDialog = () => {
    setIsAddMemberDialogOpen(false);
    setNewMemberEmail("");
  };

  const handleAddMember = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8090/api/rooms/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId: groupId,
          email: newMemberEmail,
        }),
      });
  
      const data = await response.json();
      if (response.ok && data.code === 1000) {
        fetchGroupInfo(); // Gọi lại fetchGroupInfo để làm mới danh sách thành viên
        closeAddMemberDialog();
        toast.success("Thêm thành viên thành công!"); // Hiển thị thông báo thành công
      } else {
        console.error("Lỗi khi thêm thành viên:", data.message);
        toast.error("Thêm thành viên thất bại: " + data.message); // Hiển thị thông báo lỗi
      }
    } catch (error) {
      console.error("Lỗi khi gọi API thêm thành viên:", error);
      toast.error("Đã xảy ra lỗi khi thêm thành viên!"); // Hiển thị thông báo lỗi chung
    }
  };

  const handleUpdateGroup = () => {
    console.log("Cập nhật nhóm");
  };

  return (
    <div className="w-1/3 bg-white p-4 border-l">
         {/* Nút đóng thông tin nhóm */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={onClose} // Gọi onClose khi nhấn nút đóng
      >
        <FaTimes />
      </button>

      <h4 className="text-lg font-semibold mb-4">Thông tin nhóm</h4>
      <p className="text-sm text-gray-500">{localUsers.length} thành viên</p>
      <ul className="mt-4 space-y-2">
        {localUsers.map((user, index) => (
          <li key={index} className="flex items-center justify-between space-x-3">
            <div className="flex items-center space-x-3">
              <img
                src={`https://i.pravatar.cc/150?img=${index}`}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <p className="text-sm text-gray-700">{user.name}</p>
            </div>
            <div className="relative">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => toggleMemberMenu(index)}
              >
                ...
              </button>
              {openMenuIndex === index && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg">
                  <button
                    onClick={() => handleRemoveMember(user.id)}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Xóa thành viên
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex space-x-2">
        {/* Button Thêm thành viên */}
        <button
          onClick={openAddMemberDialog}
          className="flex-1 bg-blue-500 text-white py-2 rounded-md flex items-center justify-center"
        >
          <FaUserPlus className="inline-block mr-2" />
          Thêm thành viên
        </button>
        {/* Button Cập nhật nhóm */}
        <button
          className="flex-1 bg-green-500 text-white py-2 rounded-md"
          onClick={handleUpdateGroup}
        >
          Cập nhật nhóm
        </button>
      </div>

      {/* Dialog Thêm thành viên */}
      {isAddMemberDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Thêm thành viên</h3>
            <input
              type="email"
              placeholder="Nhập email"
              className="border p-2 w-full mb-4"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-black py-2 px-4 rounded"
                onClick={closeAddMemberDialog}
              >
                Hủy
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={handleAddMember}
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupInfo;