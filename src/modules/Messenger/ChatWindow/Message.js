import React, { useState } from "react";

const Message = ({
  image,
  text,
  userName, // Nhận tên người gửi
  onPin,
  onDelete,
  fileUrl,
  isSentByCurrentUser, // Kiểm tra người gửi hiện tại hay không
}) => {
  const [showOptions, setShowOptions] = useState(false);

  // Hàm để tải về file nếu có
  const handleDownload = () => {
    if (fileUrl) {
      window.location.href = `http://localhost:8090/download/uploads/${fileUrl}`;
    }
  };

  // Hàm để kiểm tra kiểu file và render phù hợp
 // Hàm để kiểm tra kiểu file và render phù hợp
const renderFileContent = (fileUrl) => {
  // Kiểm tra xem fileUrl có phần mở rộng không
  const fileExtension = fileUrl.split('.').pop().toLowerCase();

  // Nếu không có phần mở rộng, có thể xác định kiểu theo các phương thức khác (ví dụ: check mime type)
  if (fileExtension === fileUrl) {
    return (
      <div className="text-red-500 mt-2">
        Không có phần mở rộng file, không thể xác định loại
      </div>
    );
  }

  if (['png', 'jpg', 'jpeg'].includes(fileExtension)) {
    // Nếu là hình ảnh, hiển thị dưới dạng hình ảnh
    return (
      <img
        src={`http://localhost:8090/uploads/${fileUrl}`}
        alt="Attached file"
        className="max-w-xs rounded-lg mt-2"
      />
    );
  } else if (['pdf', 'docx', 'zip', 'txt'].includes(fileExtension)) {
    // Nếu là file PDF, DOCX, ZIP hoặc TXT, hiển thị liên kết tải xuống
    return (
      <a
        href={`http://localhost:8090/download/uploads/${fileUrl}`}
        download
        className="text-white-500 hover:underline mt-2 block"
      >
        Tải về {fileUrl}
      </a>
    );
  } else {
    // Nếu là file khác không xác định, hiển thị thông báo
    return (
      <div className="text-red-500 mt-2">
        Không hỗ trợ xem file này
      </div>
    );
  }
};


  return (
    <div
      className={`flex items-start mb-4 ${isSentByCurrentUser ? "justify-end" : "justify-start"}`}
    >
      {/* Avatar người gửi nếu không phải người gửi hiện tại */}
      {!isSentByCurrentUser && (
        <img
          src={`http://localhost:8090/profile/${image}`}
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-2"
        />
      )}

      {/* Nội dung tin nhắn */}
      <div
        className={`relative ${
          isSentByCurrentUser ? "bg-blue-500 text-white" : "bg-gray-300"
        } p-3 rounded-lg max-w-[70%] flex flex-col`}
        style={{
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          paddingRight: "35px", // Thêm padding phải để tạo khoảng trống cho dấu ba chấm
        }}
      >
        {/* Tên người gửi nếu không phải người gửi hiện tại */}
        {!isSentByCurrentUser && (
          <span className="font-semibold text-sm">{userName}</span>
        )}

        {/* Nội dung tin nhắn */}
        <div>{text}</div>

        {/* Hiển thị file nếu có */}
        {fileUrl && renderFileContent(fileUrl)}

        {/* Tùy chọn 3 dấu chấm */}
        <div
          className={`cursor-pointer ${
            isSentByCurrentUser ? "absolute right-2" : "absolute right-2"
          } top-2`}
          onClick={() => setShowOptions(!showOptions)}
          style={{ marginTop: '5px' }} // Thêm khoảng cách phía trên dấu ba chấm
        >
          <span className="text-gray-600">•••</span>
        </div>

        {/* Menu tùy chọn */}
        {showOptions && (
          <div className="absolute right-0 top-full mt-2 w-40 bg-white shadow-lg rounded-md border z-10">
            <ul>
              <li
                onClick={onPin}
                className="px-4 py-2 text-sm text-blue-500 cursor-pointer hover:bg-blue-100"
              >
                Pin Tin Nhắn
              </li>
              {fileUrl && (
                <li
                  onClick={handleDownload}
                  className="px-4 py-2 text-sm text-green-500 cursor-pointer hover:bg-green-100"
                >
                  Tải về
                </li>
              )}
              <li
                onClick={onDelete}
                className="px-4 py-2 text-sm text-red-500 cursor-pointer hover:bg-red-100"
              >
                Xóa Tin Nhắn
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Avatar người gửi nếu là người gửi hiện tại */}
      {isSentByCurrentUser && (
        <img
          src={`http://localhost:8090/profile/${image}`}
          alt="User Avatar"
          className="w-10 h-10 rounded-full ml-2"
        />
      )}
    </div>
  );
};

export default Message;
