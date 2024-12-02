import React, { useState } from "react";

const ChatInput = ({ onSendMessage }) => {
  const [messageText, setMessageText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSend = () => {
    if (messageText.trim() === "" && !selectedImage) return;

    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result;
        if (base64Data && base64Data.startsWith("data:image")) {
          onSendMessage(messageText, base64Data); // Gửi cả tin nhắn và ảnh
        } else {
          alert("Chỉ hỗ trợ gửi file ảnh.");
        }
      };
      reader.readAsDataURL(selectedImage);
    } else {
      onSendMessage(messageText, null); // Chỉ gửi tin nhắn text
    }

    setMessageText("");
    setSelectedImage(null);
  };

  return (
    <div className="flex items-center p-2 border-t">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="fileInput"
        onChange={(e) => setSelectedImage(e.target.files[0])}
      />
      <button
        className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
        onClick={() => document.getElementById("fileInput").click()}
      >
        📷
      </button>
      <input
        type="text"
        className="flex-1 p-2 border rounded-md mx-2"
        placeholder="Nhập tin nhắn..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button
        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={handleSend}
      >
        Gửi
      </button>
    </div>
  );
};

export default ChatInput;
