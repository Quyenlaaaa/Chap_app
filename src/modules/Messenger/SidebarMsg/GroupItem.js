import React from 'react';

const GroupItem = ({ id, name, avatar, onClick }) => {
  return (
    <div
      className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
      onClick={() => onClick(id)}
    >
      <img
        src={'https://cdn-icons-png.flaticon.com/512/718/718339.png'}

        alt="Avatar"
        className="w-10 h-10 rounded-full mr-2"
      />
      <div className="flex-1">
        <p className="text-sm font-semibold">{name}</p>
      </div>
    </div>
  );
};

export default GroupItem;
