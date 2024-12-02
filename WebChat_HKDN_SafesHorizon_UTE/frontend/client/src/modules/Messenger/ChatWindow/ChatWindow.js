import React, { useState, useEffect } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import {
  FaVideo,
  FaInfoCircle,
  FaSignOutAlt,
  FaTimes,
} from 'react-icons/fa';

const ChatWindow = ({ groupId }) => {
  const [messages, setMessages] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  useEffect(() => {
    if (!groupId) return;

    const fetchGroupDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8090/api/rooms/${groupId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (!response.ok) throw new Error('Lỗi khi tải dữ liệu nhóm');

        const data = await response.json();
        setGroupName(data.result.name);
        setMessages(data.result.messages || []);
      } catch (error) {
        console.error('Lỗi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const handleLeaveGroup = () => {
    alert('Bạn đã rời nhóm!');
  };

  if (!groupId) {
    return <div className="flex-1 flex items-center justify-center">Chọn nhóm để bắt đầu chat</div>;
  }

  if (loading) {
    return <div className="flex-1 flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <div className="flex-1 flex bg-gray-100">
      {/* Khung chat */}
      <div className={`flex-1 flex flex-col ${showGroupInfo ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <h3 className="text-lg font-semibold">{groupName}</h3>
          <div className="flex space-x-2">
            <button className="p-2 text-blue-500 hover:bg-blue-100 rounded-full">
              <FaVideo size={20} />
            </button>
            <button
              className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"
              onClick={() => setShowGroupInfo(!showGroupInfo)}
            >
              <FaInfoCircle size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <Message key={index} sender={msg.sender} text={msg.text} />
          ))}
        </div>

        {/* Input */}
        <ChatInput onSendMessage={(msg) => console.log('Send message:', msg)} />
      </div>

      {/* Group Info Panel */}
      {showGroupInfo && (
        <div className="w-1/3 h-full p-4 bg-white border-l border-gray-300 shadow-lg overflow-y-auto transition-all duration-300">
          {/* Close Button */}
          <div className="flex justify-end">
            <button
              className="p-2 text-gray-500 hover:bg-gray-200 rounded-full"
              onClick={() => setShowGroupInfo(false)}
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Group Details */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
              <img
                src="https://i.pravatar.cc/150?img=2"
                alt="Group Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-md font-semibold mb-4">{groupName}</h4>
          </div>

          {/* Actions */}
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
