import "./sidebar.css";
import {
  LineStyle,
  Timeline,
  TrendingUp,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Sidebar() {
  const navigate = useNavigate();

  // Xử lý đăng xuất
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Bạn có muốn đăng xuất?");
    if (confirmLogout) {
      try {
        const token = localStorage.getItem("token");
        const payload = {
          token: token
        }

        const response = await fetch("http://localhost:8090/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          // Xóa token khỏi localStorage
          localStorage.removeItem("token");

          // Điều hướng về trang đăng nhập
          navigate("/login");

          toast.success("Bạn đã đăng xuất thành công!");
        } else {
          const errorMsg = await response.text();
          toast.error(`Đăng xuất thất bại: ${errorMsg}`);
        }
      } catch (error) {
        console.error("Error during logout:", error);
        toast.error("Lỗi khi đăng xuất. Vui lòng thử lại!");
      }
    }
  };

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
            <Link to="admin/users" className="link">
              <li className="sidebarListItem">
                <Timeline className="sidebarIcon" />
                Tài khoản
              </li>
            </Link>
            <Link to="admin/rooms" className="link">
              <li className="sidebarListItem">
                <TrendingUp className="sidebarIcon" />
                Phòng chat
              </li>
            </Link>
            <Link to="admin/auth" className="link">
              <li className="sidebarListItem">
                <TrendingUp className="sidebarIcon" />
                Đổi mật khẩu
              </li>
            </Link>
            {/* <Link to="admin/auth" className="link">
              <li className="sidebarListItem">
                <TrendingUp className="sidebarIcon" />
                Cập nhật thông tin
              </li>
            </Link> */}
            {/* Đăng xuất */}
            <li className="sidebarListItem" onClick={handleLogout}>
              <TrendingUp className="sidebarIcon" />
              Đăng xuất
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
