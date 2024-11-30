import './App.css';
// import Sidebar from './modules/Messenger/Sidebar/Sidebar';
import ChatWindow from './modules/Messenger/ChatWindow/ChatWindow';
import SidebarMenu from './modules/Messenger/SidebarMsg/SidebarMenu';
import Form from './modules/Forms/Login'; 
import ForgotPassword from './modules/Forms/ForgotPassword';
import { Routes, Route, Navigate } from 'react-router-dom';
import ResetPassword from './modules/Forms/ResetPassword';
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import RoomList from "./pages/roomList/RoomList";
import Room from "./pages/room/room";
import NewRoom from "./pages/newRoom/NewRoom"; 
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import Home from "./pages/home/Home";
import ChangePassword from "./pages/password/ChangePassword";


function App() {
  return (
    // <div className="flex h-screen">
      <Routes>
      <Route path="/login" element={<Form isSignInPage={true} />} />
        <Route path="*" element={
          <>
            <Topbar />
            <div className="container">
              <Sidebar />
              <Routes>
                <Route path="/admin/" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/admin" element={<Home />} />
                <Route path="/admin/users" element={<UserList />} />
                <Route path="/admin/user/:userId" element={<User />} />
                <Route path="/admin/newUser" element={<NewUser />} />
                <Route path="/admin/rooms" element={<RoomList />} />
                <Route path="/admin/room/:roomId" element={<Room />} />
                <Route path="/admin/newroom" element={<NewRoom />} />
                <Route path="/admin/auth" element={<ChangePassword />} />
              </Routes>
            </div>
          </>
        } />
        {/* <Route path="client/" element={<Navigate to="/login" replace />} /> */}
        <Route path="client/home" element={
          <div className="flex h-screen">
          <div className="flex h-full w-full">
            <SidebarMenu className="h-full" />
            {/* <Sidebar className="h-full" /> */}
            <ChatWindow className="h-full" />
            </div>
          </div>
        } />
        {/* <Route path="client/login" element={<Form isSignInPage={true} />} /> */}
        <Route path="/signup" element={<Form isSignInPage={false} />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword/>} />
      </Routes>
    // </div>
  );
}

export default App;