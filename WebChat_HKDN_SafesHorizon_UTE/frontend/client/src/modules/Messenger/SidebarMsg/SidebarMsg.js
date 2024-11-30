import React, { useState } from 'react';
import FriendItem from './FriendItem';

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const friends = [
    { id: 1, name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?img=3' },
    // { id: 2, name: 'Lê Thị B', avatar: 'https://i.pravatar.cc/150?img=5' },
    // { id: 3, name: 'Trần C', avatar: 'https://i.pravatar.cc/150?img=8' },
  ];

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 bg-white text-gray-800 p-4 flex flex-col border-r border-gray-300">
      <div className="text-2xl font-semibold mb-4">Web Chat</div>

      <input
        type="text"
        placeholder="Tìm kiếm nhóm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="flex flex-col space-y-2">
        {filteredFriends.map((friend) => (
          <FriendItem key={friend.id} name={friend.name} avatar={friend.avatar} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
