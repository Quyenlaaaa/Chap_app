import React from 'react';

const Message = ({ sender, text, avatar, name }) => {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} items-start space-x-3 p-2`}>

      {/* Avatar Friend */}
      {sender === 'friend' && (
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
          <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Phần bao quanh tin nhắn, bao gồm tên và nội dung tin nhắn */}
      <div
        className={`p-3 rounded-lg shadow-md border max-w-xs ${sender === 'user' ? 'bg-white border-gray-300 text-right' : 'bg-white border-gray-300 text-left'
          }`}
        style={{
          wordWrap: 'break-word',
        }}
      >
        {/* Tên người gửi, chỉ hiển thị nếu không phải là tin nhắn của người dùng */}
        {sender === 'friend' && <p className="text-xs text-gray-500 mb-1">{name}</p>}

        {/* Nội dung tin nhắn */}
        <p className="text-gray-800">{text}</p>
      </div>
    </div>
  );
};

export default Message;
