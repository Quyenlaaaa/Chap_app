import React, { useState } from "react";

const ChatInput = ({ onSendMessage }) => {
  const [messageText, setMessageText] = useState("");
  const [imageBase64, setImageBase64] = useState(null);

  const handleInputChange = (e) => {
    setMessageText(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageBase64(reader.result); // Lưu Base64 của ảnh
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if (messageText.trim() || imageBase64) {
      onSendMessage(messageText, imageBase64);
      setMessageText("");
      setImageBase64(null); // Xóa ảnh sau khi gửi
    }
  };

  return (
    <div className="flex items-center p-4 border-t bg-white">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="file-upload"
        onChange={handleImageUpload}
      />
      <label
        htmlFor="file-upload"
        className="p-2 text-blue-500 hover:bg-blue-100 rounded-full cursor-pointer"
      >
        📷
      </label>
      <input
        type="text"
        className="flex-1 p-2 border rounded-md focus:outline-none"
        placeholder="Nhập tin nhắn..."
        value={messageText}
        onChange={handleInputChange}
      />
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
