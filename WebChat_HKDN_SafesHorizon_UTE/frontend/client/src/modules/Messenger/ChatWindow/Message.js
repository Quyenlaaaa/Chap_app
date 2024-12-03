import React, { useState } from "react";

const Message = ({ image, text, onPin, onDelete, fileUrl }) => {
  const [showOptions, setShowOptions] = useState(false);

  // Hàm để chuyển đổi hình ảnh URL thành đường dẫn có thể tải về
  const handleDownload = () => {
    if (fileUrl) {
      window.location.href = `http://localhost:8090/download/uploads/${fileUrl}`; // Trình duyệt sẽ tải về file
    }
  };

  return (
    <div className="p-2 mb-2 border-b relative">
      <div className="flex items-center">
        <img
          src={`http://localhost:8090/profile/${image}`}
          alt="User Avatar"
          className="w-8 h-8 rounded-full mr-3"
        />
        <span className="font-semibold">{fileUrl}</span>
      </div>
      <p>{text}</p>

      {/* Biểu tượng 3 dấu chấm */}
      <div
        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
        onClick={() => setShowOptions(!showOptions)}
      >
        <span className="text-gray-600">•••</span>
      </div>

      {/* Menu chọn khi nhấn vào biểu tượng 3 dấu chấm */}
      {showOptions && (
        <div className="absolute right-2 top-full mt-2 w-40 bg-white shadow-lg rounded-md border">
          <ul>
            <li
              onClick={onPin}
              className="px-4 py-2 text-sm text-blue-500 cursor-pointer hover:bg-blue-100"
            >
              Pin Tin Nhắn
            </li>
            <li
              onClick={onDelete}
              className="px-4 py-2 text-sm text-red-500 cursor-pointer hover:bg-red-100"
            >
              Xóa Tin Nhắn
            </li>
            {fileUrl && (
              <li
                onClick={handleDownload}
                className="px-4 py-2 text-sm text-green-500 cursor-pointer hover:bg-green-100"
              >
                Tải về
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Message;
