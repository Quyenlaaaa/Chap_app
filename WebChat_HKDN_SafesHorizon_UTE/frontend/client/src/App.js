import './App.css';
import Sidebar from './modules/Messenger/Sidebar/Sidebar';
import ChatWindow from './modules/Messenger/ChatWindow/ChatWindow';
import SidebarMenu from './modules/Messenger/Sidebar/SidebarMenu';
import Form from './modules/Forms/Login'; 
import ForgotPassword from './modules/Forms/ForgotPassword';
import { Routes, Route, Navigate } from 'react-router-dom';
import ResetPassword from './modules/Forms/ResetPassword';


function App() {
  return (
    <div className="flex h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={
          <div className="flex h-full w-full">
            <SidebarMenu className="h-full" />
            <Sidebar className="h-full" />
            <ChatWindow className="h-full" />
          </div>
        } />
        <Route path="/login" element={<Form isSignInPage={true} />} />
        <Route path="/signup" element={<Form isSignInPage={false} />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword/>} />
      </Routes>
    </div>
  );
}

export default App;