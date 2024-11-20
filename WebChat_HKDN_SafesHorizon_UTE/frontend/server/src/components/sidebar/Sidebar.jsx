import "./sidebar.css";
import {
  LineStyle,
  Timeline,
  TrendingUp
} from '@mui/icons-material';
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">MENU</h3>
          <ul className="sidebarList">
            <Link to="/admin" className="link">
            <li className="sidebarListItem active">
              <LineStyle className="sidebarIcon" />
              Tổng quan
            </li>

            </Link>
            <Link to="/users" className="link">
            <li className="sidebarListItem">
              <Timeline className="sidebarIcon" />
              Tài khoản
            </li>
            </Link>
            
            <Link to="/rooms" className="link">
            <li className="sidebarListItem">
              <TrendingUp className="sidebarIcon" />
              Phòng chat
            </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
