import React, { useState } from 'react';

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  // Hàm gửi tin nhắn
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);  // Gửi tin nhắn qua props
      setMessage('');  // Xóa nội dung sau khi gửi
    }
  };

  // Xử lý khi nhấn phím Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();  // Ngăn việc thêm dòng mới
      handleSendMessage();  // Gửi tin nhắn
    }
  };

  return (
    <div className="flex items-center p-2 border-t border-gray-300">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}  // Thêm sự kiện để xử lý Enter
        placeholder="Nhập tin nhắn..."
        className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows="1"
      />

      <button
        onClick={handleSendMessage}
        className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
      >
        Gửi
      </button>
    </div>
  );
};

export default ChatInput;
