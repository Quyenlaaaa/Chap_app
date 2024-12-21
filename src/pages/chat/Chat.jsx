import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarMenu from "../../modules/Messenger/SidebarMsg/SidebarMenu";
import SidebarMsg from "../../modules/Messenger/SidebarMsg/SidebarMsg";
import ChatWindow from "../../modules/Messenger/ChatWindow/ChatWindow";

export default function Chat() {
  const { groupId } = useParams(); // Lấy groupId từ URL
  const [selectedGroupId, setSelectedGroupId] = useState(groupId); // Đặt groupId vào state
  const navigate = useNavigate();

  // Hàm để chuyển hướng tới nhóm khi click vào nhóm trong SidebarMsg
  const handleGroupSelect = (groupId) => {
    setSelectedGroupId(groupId);
    navigate(`/client/room/${groupId}`); // Chuyển hướng tới URL tương ứng với groupId
  };

  return (
    <div className="flex h-screen">
      <div className="flex h-full w-full">
        <SidebarMenu />
        <SidebarMsg onGroupSelect={handleGroupSelect} /> {/* Gửi handleGroupSelect khi chọn nhóm */}
        <ChatWindow groupId={selectedGroupId} />
      </div>
    </div>
  );
}
