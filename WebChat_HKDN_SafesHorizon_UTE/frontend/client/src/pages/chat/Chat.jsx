import ChatWindow from "../../modules/Messenger/ChatWindow/ChatWindow";
import SidebarMenu from "../../modules/Messenger/SidebarMsg/SidebarMenu";
import SidebarMsg from "../../modules/Messenger/SidebarMsg/SidebarMsg";

import React, { useState, useEffect } from "react";

export default function Chat() {
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  return (
    <div className="flex h-screen">
      <div className="flex h-full w-full">
        <SidebarMenu />
        <SidebarMsg onGroupSelect={(groupId) => setSelectedGroupId(groupId)} />
        <ChatWindow groupId={selectedGroupId} />
      </div>
    </div>
  );
}
