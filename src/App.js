import './App.css';
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
import Chat from './pages/chat/Chat';


function App() {
  return (
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
        
        <Route path="client/home" element={<Chat />} />
        <Route path="client/room/:groupId" element={<Chat />} /> 
        <Route path="/signup" element={<Form isSignInPage={false} />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword/>} />
      </Routes>
  );
}

export default App;