import React from "react";
import "./topbar.css";
import { Settings, Logout } from '@mui/icons-material';

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">WebChatZ</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
          <img src="https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" className="topAvatar" />
          </div>
          <div className="topbarIconContainer">
            <Settings />
          </div>  
          <div className="topbarIconContainer">
            <Logout />
          </div>
        </div>
      </div>
    </div>
  );
}
