import React, { useState, useEffect, useRef } from "react";
import {
  FaVideo,
  FaInfoCircle,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import Message from "./Message";
import ChatInput from "./ChatInput";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const ChatWindow = ({ groupId }) => {
  const [messages, setMessages] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const stompClientRef = useRef(null);

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
          // setMessages((prevMessages) => [...prevMessages, message]);
        });
      },
      (error) => {
        console.error("Không thể kết nối lại WebSocket", error);
        setTimeout(reconnectWebSocket, 5000);
      }
    );
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

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
        console.log("WebSocket đã ngắt kết nối");
      }
    };
  }, [groupId]);

  // Handle sending message
  const handleSendMessage = (messageText, imageBase64) => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      alert("Không thể gửi tin nhắn. Kết nối WebSocket không thành công.");
      reconnectWebSocket();
      return;
    }

    const messagePayload = {
      roomId: groupId,
      messageText: messageText,
      imageBase64: imageBase64 || "", // Gửi ảnh dưới dạng Base64 nếu có
    };

    stompClientRef.current.send(
      `/app/chat/${groupId}`,
      {},
      JSON.stringify(messagePayload)
    );
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

  // Handle adding a member
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

  const handlePinMessage = async (messageId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8090/api/messages/${messageId}/pin`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Tin nhắn đã được ghim.");
      } else {
        throw new Error("Ghim tin nhắn thất bại");
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi ghim tin nhắn");
    }
  };

  // const handleDeleteMessage = async (messageId) => {
  //   const confirmDelete = window.confirm("Bạn có chắc muốn xóa tin nhắn này?");
  //   if (!confirmDelete) return;

  //   // Loại bỏ tin nhắn khỏi UI ngay lập tức
  //   setMessages((prevMessages) =>
  //     prevMessages.filter((msg) => msg.id !== messageId)
  //   );

  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await fetch(
  //       `http://localhost:8090/api/messages/${messageId}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Xóa tin nhắn thất bại");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert("Đã xảy ra lỗi khi xóa tin nhắn. Vui lòng thử lại.");
  //     // Phục hồi tin nhắn nếu lỗi
  //     fetchMessages();
  //   }
  // };
  const handleDeleteMessage = (messageId) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa tin nhắn này?");
    if (!confirmDelete) return;
  
    const token = localStorage.getItem("token");
    console.log("Xóa tin nhắn với ID:", messageId); // Kiểm tra xem hàm có được gọi không
  
    // Gửi yêu cầu xóa tin nhắn
    fetch(`http://localhost:8090/api/messages/${messageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())  // Chuyển đổi phản hồi thành JSON
      .then((data) => {
        if (data.code === 1000) {
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== messageId)
          );
        } else {
          alert("Không thể xóa tin nhắn!");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi kết nối đến server:", error);
        alert("Đã xảy ra lỗi khi xóa tin nhắn. Vui lòng thử lại.");
        // Có thể phục hồi tin nhắn nếu cần thiết
      });
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
      <div
        className={`flex-1 flex flex-col ${
          showGroupInfo ? "w-2/3" : "w-full"
        } transition-all duration-300`}
      >
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

        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <Message
              key={msg.id} // Đảm bảo sử dụng ID tin nhắn thay vì index
              image={msg.userResponse.imagePath} // Avatar của user gửi tin nhắn
              text={msg.messageText} // Nội dung tin nhắn
              fileUrl={msg.fileUrl} // URL file
              onPin={() => handlePinMessage(msg.id)} // Xử lý ghim tin nhắn
              onDelete={() => handleDeleteMessage(msg.id)} // Xử lý xóa tin nhắn
            />
          ))}
        </div>

        <ChatInput onSendMessage={handleSendMessage} />
      </div>

      {showGroupInfo && (
        <div className="w-1/3 bg-white p-4 border-l">
          <h4 className="text-lg font-semibold mb-4">Thông tin nhóm</h4>
          <p className="text-sm text-gray-500">{memberCount} thành viên</p>
          <ul className="mt-4 space-y-2">
            {users.map((user, index) => (
              <li key={index} className="flex items-center space-x-3">
                <img
                  src={`https://i.pravatar.cc/150?img=${index}`}
                  alt={user.email}
                  className="w-8 h-8 rounded-full"
                />
                <p className="text-sm text-gray-700">{user.email}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <input
              type="email"
              placeholder="Nhập email để thêm"
              className="border p-2 w-full mb-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddMember(e.target.value);
                  e.target.value = "";
                }
              }}
            />
            <button className="w-full bg-blue-500 text-white py-2 rounded-md">
              <FaUserPlus className="inline-block mr-2" />
              Thêm thành viên
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
