import React, { useState } from "react";

const Message = ({
  image,
  text,
  userName, 
  onPin,
  onDelete,
  fileUrl,
  isSentByCurrentUser, 
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleDownload = () => {
    if (fileUrl) {
      window.location.href = `http://localhost:8090/download/uploads/${fileUrl}`;
    }
  };

const renderFileContent = (fileUrl) => {
  const fileExtension = fileUrl.split('.').pop().toLowerCase();

  if (fileExtension === fileUrl) {
    return (
      <div className="text-red-500 mt-2">
        Không có phần mở rộng file, không thể xác định loại
      </div>
    );
  }

  if (['png', 'jpg', 'jpeg'].includes(fileExtension)) {
    return (
      <img
        src={`http://localhost:8090/uploads/${fileUrl}`}
        alt="Attached file"
        className="max-w-xs rounded-lg mt-2"
      />
    );
  } else if (['pdf', 'docx', 'zip', 'txt'].includes(fileExtension)) {
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
      {!isSentByCurrentUser && (
        <img
          src={`http://localhost:8090/profile/${image}`}
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-2"
        />
      )}

      <div
        className={`relative ${
          isSentByCurrentUser ? "bg-blue-500 text-white" : "bg-gray-300"
        } p-3 rounded-lg max-w-[70%] flex flex-col`}
        style={{
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          paddingRight: "35px", 
        }}
      >
        {!isSentByCurrentUser && (
          <span className="font-semibold text-sm">{userName}</span>
        )}

        <div>{text}</div>

        {fileUrl && renderFileContent(fileUrl)}

        <div
          className={`cursor-pointer ${
            isSentByCurrentUser ? "absolute right-2" : "absolute right-2"
          } top-2`}
          onClick={() => setShowOptions(!showOptions)}
          style={{ marginTop: '5px' }} 
        >
          <span className="text-gray-600">•••</span>
        </div>

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
