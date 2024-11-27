import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import RoomList from "./pages/roomList/RoomList";
import Room from "./pages/room/room";
import NewRoom from "./pages/newRoom/NewRoom"; 
import LoginForm from './modules/Forms/Login'; 
import ChangePassword from "./pages/password/ChangePassword";
import Form from "./modules/Forms/Login";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/login" element={<Form isSignInPage={true} />} />
        <Route path="*" element={
          <>
            <Topbar />
            <div className="container">
              <Sidebar />
              <Routes>
                <Route path="/" element={<Navigate to="/admin" replace />} />
                <Route path="/admin" element={<Home />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/user/:userId" element={<User />} />
                <Route path="/newUser" element={<NewUser />} />
                <Route path="/rooms" element={<RoomList />} />
                <Route path="/room/:roomId" element={<Room />} />
                <Route path="/newroom" element={<NewRoom />} />
                <Route path="/auth" element={<ChangePassword />} />
              </Routes>
            </div>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
