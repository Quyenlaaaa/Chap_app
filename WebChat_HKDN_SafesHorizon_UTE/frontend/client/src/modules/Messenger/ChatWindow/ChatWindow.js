import React, { useState, useEffect } from "react";
import { FaVideo, FaInfoCircle, FaSignOutAlt, FaTimes } from "react-icons/fa";
import Message from "./Message";
import ChatInput from "./ChatInput";

const ChatWindow = ({ groupId }) => {
  const [messages, setMessages] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [memberCount, setMemberCount] = useState(3);
  const [users, setUsers] = useState([]); 
  const [emailToAdd, setEmailToAdd] = useState(""); 
  const [showAddMemberModal, setShowAddMemberModal] = useState(false); 

  useEffect(() => {
    if (!groupId) return;

    // Fetch group details
    const fetchGroupDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8090/api/rooms/${groupId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!response.ok) throw new Error("Lỗi khi tải dữ liệu nhóm");

        const data = await response.json();
        setGroupName(data.result.name);
        setMessages(data.result.messages || []);
        setMemberCount(data.result.membersCount || 0);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch users in the group
    const fetchRoomUsers = async () => {
      try {
        const response = await fetch(`http://localhost:8090/api/rooms/${groupId}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!response.ok) throw new Error("Lỗi khi tải danh sách người dùng");

        const data = await response.json();
        if (Array.isArray(data.result)) {
          setUsers(data.result || []);
          setMemberCount(data.result.length || 0);
        } else {
          console.error("Dữ liệu trả về không phải là mảng");
          setUsers([]);
        }
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };

    fetchGroupDetails();
    fetchRoomUsers();

    // WebSocket setup for real-time updates
    const socket = new WebSocket("ws://localhost:8090/ws/chat");
    socket.onopen = () => {
      console.log("WebSocket đã kết nối");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);

      if (message.type === "USER_JOINED") {
        setUsers((prevUsers) => [...prevUsers, message.user]);
        setMemberCount((prevCount) => prevCount + 1);
      }

      if (message.type === "USER_LEFT") {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.email !== message.user.email)
        );
        setMemberCount((prevCount) => prevCount - 1);
      }
    };

    return () => {
      socket.close();
    };
  }, [groupId]);

  const handleLeaveGroup = () => {
    alert("Bạn đã rời nhóm!");
  };

  const handleAddMember = async () => {
    if (!emailToAdd) {
      alert("Vui lòng nhập email của thành viên.");
      return;
    }

    const newMember = { roomId: groupId, email: emailToAdd };
    try {
      const response = await fetch("http://localhost:8090/api/rooms/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(newMember),
      });

      if (!response.ok) throw new Error("Thêm thành viên không thành công");

      const data = await response.json();
      if (Array.isArray(data.result)) {
        // setUsers((prevUsers) => [...prevUsers, data.result[0]]);
        // setShowAddMemberModal(false);
        // setEmailToAdd("");
        alert("Thêm thành viên thành công");
      } else {
        console.error("Dữ liệu trả về không phải là mảng");
        alert("Lỗi khi thêm thành viên");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi khi thêm thành viên");
    }
  };

  if (!groupId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Chọn nhóm để bắt đầu chat
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">Đang tải...</div>
    );
  }

  return (
    <div className="flex-1 flex bg-gray-100">
      <div className={`flex-1 flex flex-col ${showGroupInfo ? "w-2/3" : "w-full"} transition-all duration-300`}>
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center space-x-3">
            <img src="https://i.pravatar.cc/150?img=2" alt="Group Avatar" className="w-10 h-10 rounded-full" />
            <div>
              <h3 className="text-lg font-semibold text-black">{groupName}</h3>
              <p className="text-sm text-gray-500">{memberCount} thành viên</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 text-blue-500 hover:bg-blue-100 rounded-full">
              <FaVideo size={20} />
            </button>
            <button className="p-2 text-blue-500 hover:bg-blue-100 rounded-full" onClick={() => setShowGroupInfo(!showGroupInfo)}>
              <FaInfoCircle size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <Message key={index} sender={msg.sender} text={msg.text} />
          ))}
        </div>

        <ChatInput onSendMessage={(msg) => console.log("Send message:", msg)} />
      </div>

      {showGroupInfo && (
        <div className="w-1/3 h-full p-4 bg-white border-l border-gray-300 shadow-lg overflow-y-auto">
          <div className="flex justify-end">
            <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-full" onClick={() => setShowGroupInfo(false)}>
              <FaTimes size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
              <img src="https://i.pravatar.cc/150?img=2" alt="Group Avatar" className="w-full h-full object-cover" />
            </div>
            <h4 className="text-md font-semibold mb-4">{groupName}</h4>
          </div>
          <div className="flex justify-between mb-4">
            <button className="w-full bg-blue-500 text-white p-2 rounded" onClick={() => setShowAddMemberModal(true)}>
              Thêm thành viên
            </button>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold text-lg">Thành viên</h5>
            {users.map((user) => (
              <div key={user.email} className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={user.imagePath ? `http://localhost:8090/profile/${user.imagePath}` : 'http://localhost:8090/profile/default-avatar-url.png'} alt={user.email} className="w-8 h-8 rounded-full mr-3" />
                  <span>{user.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddMemberModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Thêm thành viên</h3>
            <input
              type="email"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              placeholder="Nhập email"
              value={emailToAdd}
              onChange={(e) => setEmailToAdd(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                onClick={() => setShowAddMemberModal(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleAddMember}
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
