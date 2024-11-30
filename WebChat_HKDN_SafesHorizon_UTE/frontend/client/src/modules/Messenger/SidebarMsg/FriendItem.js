import React from 'react';

const FriendItem = ({ name, avatar }) => {
  return (
    <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-300 mr-3">
        <img
          src={avatar || 'https://i.pravatar.cc/150'} // Avatar mặc định nếu không có avatar truyền vào
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Tên bạn bè */}
      <div className="text-gray-800 font-medium">{name}</div>
    </div>
  );
};

export default FriendItem;
