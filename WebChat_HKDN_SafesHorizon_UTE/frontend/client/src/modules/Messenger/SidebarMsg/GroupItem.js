import React from 'react';

const GroupItem = ({ name, avatar }) => {
  return (
    <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
      {/* Avatar nhóm */}
      <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-300 mr-3">
        <img
          src={avatar || 'https://i.pravatar.cc/150?img=10'} // Avatar mặc định nếu API không cung cấp
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Tên nhóm */}
      <div className="text-gray-800 font-medium">{name}</div>
    </div>
  );
};

export default GroupItem;
