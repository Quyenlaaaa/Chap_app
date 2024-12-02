import React from "react";

const Message = ({ sender, text }) => {
  return (
    <div className="p-2 mb-2 border-b">
      <div className="flex items-center">
        <img
          src={`https://i.pravatar.cc/150?img=${sender}`}
          alt="User Avatar"
          className="w-8 h-8 rounded-full mr-3"
        />
        <span className="font-semibold">{sender}</span>
      </div>
      <p>{text}</p>
    </div>
  );
};

export default Message;
