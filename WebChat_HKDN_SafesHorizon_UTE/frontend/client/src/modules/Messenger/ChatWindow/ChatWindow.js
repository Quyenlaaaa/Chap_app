import React, { useState } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import { FaVideo, FaInfoCircle, FaThumbtack, FaPaperclip, FaSmile, FaEllipsisH, FaSignOutAlt } from 'react-icons/fa';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { sender: 'friend', text: 'Chào bạn!', avatar: 'https://i.pravatar.cc/150?img=3', name: 'Nguyễn Văn A' },
    // { sender: 'user', text: 'Chào, bạn khỏe không?', avatar: 'https://i.pravatar.cc/150?img=5', name: 'Tôi' },
    // { sender: 'friend', text: 'Mình ổn, còn bạn?', avatar: 'https://i.pravatar.cc/150?img=3', name: 'Nguyễn Văn A' },
  ]);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [attachedFile, setAttachedFile] = useState(null);
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  const handleSendMessage = (message) => {
    // setMessages([...messages, { sender: 'user', text: message, avatar: 'https://i.pravatar.cc/150?img=5', name: 'Tôi', file: attachedFile }]);
    // setAttachedFile(null);
  };

  const handlePinMessage = (message) => {
    setPinnedMessages((prevPinnedMessages) => {
      const isPinned = prevPinnedMessages.some(msg => msg.text === message.text);
      if (isPinned) {
        return prevPinnedMessages.filter(msg => msg.text !== message.text);
      } else {
        return [...prevPinnedMessages, message];
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleLeaveGroup = () => {
    alert('Bạn đã rời nhóm!');
  };

  return (
    <div className="flex-1 p-4 flex bg-gray-100 border-l border-gray-300">
      {/* Khung chat */}
      <div className={`flex-1 flex flex-col ${showGroupInfo ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <div className="flex items-center space-x-3">
            <img src="https://i.pravatar.cc/150?img=2" alt="Group Avatar" className="w-10 h-10 rounded-full" />
            <div>
              <h3 className="text-lg font-semibold text-black">Học Kỳ Doanh Nghiệp</h3>
              <p className="text-sm text-gray-500">3 thành viên</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              className="text-blue-500 hover:bg-blue-100 p-2 rounded-full transition duration-200"
              onClick={() => alert('Bắt đầu cuộc gọi video')}
            >
              <FaVideo size={20} />
            </button>
            <button
              className="text-blue-500 hover:bg-blue-100 p-2 rounded-full transition duration-200"
              onClick={() => setShowGroupInfo(!showGroupInfo)}
            >
              <FaInfoCircle size={20} />
            </button>
          </div>
        </div>

        {pinnedMessages.length > 0 && (
          <div className="p-2 bg-yellow-100 border-l-4 border-yellow-500 mb-4 flex flex-col space-y-2">
            <p className="text-sm text-gray-700 font-semibold">Tin nhắn đã ghim:</p>
            {pinnedMessages.map((msg, index) => (
              <div key={index} className="flex justify-between items-center">
                <p>{msg.text}</p>
                <button
                  className="text-gray-500 hover:text-red-500 transition duration-200"
                  onClick={() => handlePinMessage(msg)}
                >
                  Bỏ ghim
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 mt-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-center group ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <Message sender={msg.sender} text={msg.text} avatar={msg.avatar} name={msg.name} />
              {msg.file && (
                <div className="text-sm text-blue-500">
                  <a href={URL.createObjectURL(msg.file)} target="_blank" rel="noopener noreferrer">
                    Tệp đính kèm: {msg.file.name}
                  </a>
                </div>
              )}
              <button
                className="ml-2 text-gray-500 opacity-0 group-hover:opacity-100 hover:text-yellow-500 transition duration-200"
                onClick={() => handlePinMessage(msg)}
              >
                <FaThumbtack size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Khung nhập tin nhắn luôn ở dưới cùng */}
        <div className="flex flex-col space-y-1 p-2 bg-white border border-gray-300 rounded-lg mt-auto">
          <div className="flex space-x-2 mt-1">
            <button className="text-blue-500 hover:bg-blue-100 p-1 rounded-full transition duration-200 cursor-pointer">
              <label htmlFor="fileInput" className="cursor-pointer">
                <FaPaperclip size={18} />
              </label>
              <input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </button>
            <button className="text-blue-500 hover:bg-blue-100 p-1 rounded-full transition duration-200">
              <FaSmile size={18} />
            </button>
            <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full transition duration-200">
              <FaEllipsisH size={18} />
            </button>
          </div>
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>

      {/* Khung thông tin nhóm */}
      {showGroupInfo && (
        <div className="w-1/3 h-full p-4 bg-white border-l border-gray-300 shadow-lg overflow-y-auto transition-all duration-300 flex flex-col">
          {/* Tiêu đề thông tin nhóm và Avatar nhóm */}
          <div className="flex flex-col items-center mb-6">
            <h3 className="text-lg font-semibold text-center mb-4">Thông tin nhóm</h3>
            <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
              <img src="https://i.pravatar.cc/150?img=2" alt="Group Avatar" className="w-full h-full object-cover" />
            </div>
            <h4 className="text-center text-md font-semibold mb-4">Thảo luận công việc</h4>
          </div>

          {/* Thông tin nhóm */}
          <div className="space-y-4 w-full">
            <div>
              <h4 className="font-semibold">Thành viên nhóm</h4>
              <p className="text-sm">3 thành viên</p>
            </div>

            {/* Phần Ảnh/Video */}
            <div>
              <h4 className="font-semibold">Ảnh/Video</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-16 w-16 bg-gray-200 rounded-lg shadow-sm"></div>
                <div className="h-16 w-16 bg-gray-200 rounded-lg shadow-sm"></div>
                <div className="h-16 w-16 bg-gray-200 rounded-lg shadow-sm"></div>
              </div>
            </div>

            {/* Phần File đã gửi */}
            <div>
              <h4 className="font-semibold">File đã gửi</h4>
              <div className="space-y-2">
                {/* Lặp qua các file đã gửi và hiển thị chúng */}
                <div className="text-sm text-blue-500">
                  <a href="/path/to/file1.pdf" target="_blank" rel="noopener noreferrer">
                    file1.pdf
                  </a>
                </div>
                <div className="text-sm text-blue-500">
                  <a href="/path/to/file2.jpg" target="_blank" rel="noopener noreferrer">
                    file2.jpg
                  </a>
                </div>
                {/* Bạn có thể lặp qua mảng các file thực tế ở đây */}
              </div>
            </div>
          </div>

          {/* Nút "Rời khỏi nhóm" */}
          <div className="mt-4">
            <button
              onClick={handleLeaveGroup}
              className="text-red-600 hover:text-white hover:bg-red-600 py-2 rounded-lg flex items-center justify-center space-x-2 w-full border border-red-600"
            >
              <FaSignOutAlt size={18} />
              <span>Rời khỏi nhóm</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
