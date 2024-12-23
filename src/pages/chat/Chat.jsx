import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarMenu from "../../modules/Messenger/SidebarMsg/SidebarMenu";
import SidebarMsg from "../../modules/Messenger/SidebarMsg/SidebarMsg";
import ChatWindow from "../../modules/Messenger/ChatWindow/ChatWindow";

export default function Chat() {
  const { groupId } = useParams(); 
  const [selectedGroupId, setSelectedGroupId] = useState(groupId); 
  const navigate = useNavigate();

  const handleGroupSelect = (groupId) => {
    setSelectedGroupId(groupId);
    navigate(`/client/room/${groupId}`); 
  };

  return (
    <div className="flex h-screen">
      <div className="flex h-full w-full">
        <SidebarMenu />
        <SidebarMsg onGroupSelect={handleGroupSelect} />
        <ChatWindow groupId={selectedGroupId} />
      </div>
    </div>
  );
}
