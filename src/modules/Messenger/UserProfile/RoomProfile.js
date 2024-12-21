import React from 'react';

const UserProfile = ({ name, avatar }) => {
  return (
    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-md border border-gray-300">
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
        <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
      </div>
      <div className="text-black font-semibold">{name}</div>
    </div>
  );
};

export default UserProfile;
