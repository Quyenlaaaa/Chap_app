import React, { useState } from "react";

const ChatInput = ({ onSendMessage }) => {
  const [messageText, setMessageText] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleInputChange = (e) => {
    setMessageText(e.target.value);
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFileName(uploadedFile.name); 
    }
  };

  const handleSend = () => {
    if (messageText.trim() || file) {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64File = reader.result;
          onSendMessage(messageText, file);
        };
        reader.readAsDataURL(file); 
      } else {
        onSendMessage(messageText, ""); 
      }

      setMessageText("");
      setFile(null);
      setFileName(""); 
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileName(""); 
  };

  return (
    <div className="flex items-center p-4 border-t bg-white">
      {/* Hiển thị tên file */}
      {file && (
        <div className="relative mr-4">
          <div className="p-2 bg-gray-100 rounded-lg text-sm text-gray-700">
            <span>{fileName}</span>
          </div>
          <button
            onClick={handleRemoveFile}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
          >
            ✖
          </button>
        </div>
      )}

      {/* Nút upload file */}
      <input
        type="file"
        className="hidden"
        id="file-upload"
        onChange={handleFileUpload}
      />
      <label
        htmlFor="file-upload"
        className="p-2 text-blue-500 hover:bg-blue-100 rounded-full cursor-pointer"
      >
        📎
      </label>

      {/* Trường nhập tin nhắn */}
      <input
        type="text"
        className="flex-1 p-2 border rounded-md focus:outline-none ml-2"
        placeholder="Nhập tin nhắn..."
        value={messageText}
        onChange={handleInputChange}
      />

      {/* Nút gửi tin nhắn */}
      <button
        onClick={handleSend}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Gửi
      </button>
    </div>
  );
};

export default ChatInput;
