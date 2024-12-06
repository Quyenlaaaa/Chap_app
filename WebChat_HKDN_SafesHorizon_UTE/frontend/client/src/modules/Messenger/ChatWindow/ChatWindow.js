import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import GroupInfo from "./GroupInfo";
import { FaVideo, FaInfoCircle } from "react-icons/fa";
import Message from "./Message";
import ChatInput from "./ChatInput";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const ChatWindow = ({ groupId }) => {
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAddMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const stompClientRef = useRef(null);

  const onPinMessage = async (messageId) => {
    await handlePinMessage(messageId, setPinnedMessage);
  };

  // Reconnect WebSocket in case of disconnection
  const reconnectWebSocket = () => {
    const socket = new SockJS(
      `http://localhost:8090/ws?token=${localStorage.getItem("token")}`
    );
    const client = Stomp.over(socket);

    client.connect(
      {},
      () => {
        console.log("WebSocket đã kết nối lại");
        setIsConnected(true);
        stompClientRef.current = client;

        client.subscribe(`/topic/chat/${groupId}`, (messageOutput) => {
          const message = JSON.parse(messageOutput.body);
          console.log(message);
        });
      },
      (error) => {
        console.error("Không thể kết nối lại WebSocket", error);
        setTimeout(reconnectWebSocket, 5000);
      }
    );
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token không hợp lệ. Đăng nhập lại để tiếp tục.");
        return;
      }

      const response = await fetch("http://localhost:8090/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Lỗi khi tải thông tin người dùng");
      }

      const data = await response.json();
      setCurrentUser(data.result);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  // Fetch data from the server
  useEffect(() => {
    if (!groupId) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Token không hợp lệ. Đăng nhập lại để tiếp tục.");
          return;
        }

        const [groupResponse, usersResponse] = await Promise.all([
          fetch(`http://localhost:8090/api/rooms/${groupId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`http://localhost:8090/api/rooms/${groupId}/users`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!groupResponse.ok || !usersResponse.ok) {
          throw new Error("Lỗi khi tải dữ liệu nhóm hoặc danh sách người dùng");
        }

        const groupData = await groupResponse.json();
        const usersData = await usersResponse.json();

        setGroupName(groupData.result.name);
        setMessages(groupData.result.messages || []);
        setMemberCount(usersData.result.length || 0);
        setUsers(usersData.result || []);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    // Set up WebSocket connection
    const setupWebSocket = () => {
      const socket = new SockJS(
        `http://localhost:8090/ws?token=${localStorage.getItem("token")}`
      );
      const client = Stomp.over(socket);

      client.connect(
        {},
        () => {
          console.log("WebSocket đã kết nối");
          setIsConnected(true);
          stompClientRef.current = client;

          client.subscribe(`/topic/chat/${groupId}`, (messageOutput) => {
            const message = JSON.parse(messageOutput.body);
            console.log(message);
            setMessages((prevMessages) => [...prevMessages, message]);
          });
        },
        (error) => {
          console.error("Không thể kết nối WebSocket", error);
          alert("Không thể kết nối WebSocket. Kiểm tra lại server hoặc token.");
        }
      );
    };

    fetchData();
    setupWebSocket();
    fetchCurrentUser();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
        console.log("WebSocket đã ngắt kết nối");
      }
    };
  }, [groupId]);

  // Handle sending message
  const handleSendMessage = (messageText, file) => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      alert("Không thể gửi tin nhắn. Kết nối WebSocket không thành công.");
      reconnectWebSocket();
      return;
    }

    // Nếu có file, chuyển đổi file sang Base64
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        const messagePayload = {
          roomId: groupId,
          messageText: messageText,
          imageBase64: base64Data,
        };

        // Gửi tin nhắn qua WebSocket
        stompClientRef.current.send(
          `/app/chat/${groupId}`,
          {},
          JSON.stringify(messagePayload)
        );
      };

      reader.readAsDataURL(file);
    } else {
      const messagePayload = {
        roomId: groupId,
        messageText: messageText,
        imageBase64: "",
      };

      stompClientRef.current.send(
        `/app/chat/${groupId}`,
        {},
        JSON.stringify(messagePayload)
      );
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token không hợp lệ. Đăng nhập lại để tiếp tục.");
        return;
      }

      const response = await fetch(
        `http://localhost:8090/api/messages/room/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi tải tin nhắn");
      }

      const data = await response.json();

      if (data.code === 1000) {
        setMessages(data.result || []);
      } else {
        alert(data.message || "Không thể tải tin nhắn");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    if (!groupId) return;
    fetchMessages();
  }, [groupId]);

  const handleAddMember = async (email) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8090/api/rooms/${groupId}/add-member`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Thêm thành viên thất bại");
      }

      const data = await response.json();
      setUsers((prevUsers) => [...prevUsers, data.result]);
      setMemberCount((prevCount) => prevCount + 1);
      alert("Thêm thành viên thành công");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi thêm thành viên");
    }
  };
  const handlePinMessage = async (messageId, setPinnedMessage) => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        throw new Error("Người dùng chưa đăng nhập.");
      }
  
      const response = await fetch(
        `http://localhost:8090/api/messages/${messageId}/pin`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.ok) {
        const responseData = await response.json();
  
        if (responseData.code === 1000) {
          // Cập nhật trạng thái tin nhắn ghim
          const pinnedMessage = responseData.result;
          setPinnedMessage(pinnedMessage);
  
          alert("Tin nhắn đã được ghim thành công.");
        } else {
          throw new Error(responseData.message || "Ghim tin nhắn thất bại.");
        }
      } else {
        throw new Error("Không thể kết nối tới server.");
      }
    } catch (error) {
      console.error("Lỗi khi ghim tin nhắn:", error.message);
      alert(`Đã xảy ra lỗi: ${error.message}`);
    }
  };
  

  const handleDeleteMessage = (messageId) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa tin nhắn này?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    console.log("Xóa tin nhắn với ID:", messageId);

    fetch(`http://localhost:8090/api/messages/${messageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 1000) {
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== messageId)
          );
          toast.success("Tin nhắn đã được xóa thành công!");
        } else {
          toast.error("Không thể xóa tin nhắn!");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi kết nối đến server:", error);
        toast.error("Đã xảy ra lỗi khi xóa tin nhắn. Vui lòng thử lại.");
      });
  };

  const fetchGroupInfo = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8090/api/rooms/${groupId}/users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.code === 1000) {
        const members = data.result;
        setUsers(members);
        setMemberCount(members.length);
      } else {
        console.error("Lỗi khi lấy danh sách thành viên:", data.message);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const closeGroupInfo = () => {
    setShowGroupInfo(false);
  };
  useEffect(() => {
    fetchGroupInfo();
  }, [groupId]);

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
      <div
        className={`flex-1 flex flex-col ${
          showGroupInfo ? "w-2/3" : "w-full"
        } transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center space-x-3">
            <img
              src="https://i.pravatar.cc/150?img=2"
              alt="Group Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold text-black">{groupName}</h3>
              <p className="text-sm text-gray-500">{memberCount} thành viên</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 text-blue-500 hover:bg-blue-100 rounded-full">
              <FaVideo size={20} />
            </button>
            <button
              className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"
              onClick={() => setShowGroupInfo(!showGroupInfo)}
            >
              <FaInfoCircle size={20} />
            </button>
          </div>
        </div>

        {/* Khu vực tin nhắn được ghim */}
        {pinnedMessage && (
          <div className="p-4 bg-yellow-100 border-b flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-700">Tin nhắn đã ghim:</h4>
              <p className="text-sm text-gray-600">{pinnedMessage.messageText}</p>
            </div>
            <button
              // onClick={() => setPinnedMessage(null)}
              className="text-red-500 hover:text-red-700"
            >
              Gỡ ghim
            </button>
          </div>
        )}

        {/* Message list */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg) => (
            <Message
              key={msg.id}
              image={msg.userResponse.imagePath}
              userName={msg.userResponse.name}
              text={msg.messageText}
              fileUrl={msg.fileUrl}
              onPin={() => onPinMessage(msg.id)}
              onDelete={() => handleDeleteMessage(msg.id)}
              isSentByCurrentUser={msg.userResponse.email === currentUser.email}
            />
          ))}
        </div>

        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>

      {showGroupInfo && (
        <GroupInfo
          showGroupInfo={showGroupInfo}
          memberCount={users.length}
          users={users}
          groupId={groupId}
          onClose={closeGroupInfo}
        />
      )}
    </div>
  );
};

export default ChatWindow;
