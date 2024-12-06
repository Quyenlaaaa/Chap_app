import UserProfileModal from "../../modules/Messenger/UserProfile/UserProfileModal";
import "./widgetLg.css";
import React, { useState, useEffect } from 'react';

export default function WidgetLg() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null); 
  const [userAvatar, setUserAvatar] = useState(''); 
  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };
    // Lấy thông tin người dùng
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await fetch('http://localhost:8090/api/users/me', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          });
  
          if (!response.ok) {
            throw new Error('Lỗi khi lấy thông tin người dùng');
          }
  
          const data = await response.json();
          const userData = data.result; // Dữ liệu người dùng từ API
          setUser(userData); // Lưu thông tin người dùng
          // Lấy ảnh người dùng
          setUserAvatar(`http://localhost:8090/profile/${userData.imagePath}`);
          
        } catch (error) {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
        }
      };
  
      fetchUser();
    }, []);
  const handleAvatarClick = () => {
    console.log("click avatar");
    alert("đk")
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Latest transactions</h3>
      <table className="widgetLgTable">
        <tr className="widgetLgTr">
          <th className="widgetLgTh">Customer</th>
          <th className="widgetLgTh">Date</th>
          <th className="widgetLgTh">Amount</th>
          <th className="widgetLgTh">Status</th>
        </tr>
        <tr className="widgetLgTr">
          <td className="widgetLgUser" >
            <img
              src="https://images.pexels.com/photos/4172933/pexels-photo-4172933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt=""
              className="widgetLgImg"
              onClick={handleAvatarClick}
            />
            <span className="widgetLgName">Susan Carol</span>
          </td>
          <td className="widgetLgDate">2 Jun 2021</td>
          <td className="widgetLgAmount">$122.00</td>
          <td className="widgetLgStatus">
            <Button type="Approved" />
          </td>
        </tr>
        <tr className="widgetLgTr">
          <td className="widgetLgUser">
            <img
              src="https://images.pexels.com/photos/4172933/pexels-photo-4172933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt=""
              className="widgetLgImg"
            />
            <span className="widgetLgName">Susan Carol</span>
          </td>
          <td className="widgetLgDate">2 Jun 2021</td>
          <td className="widgetLgAmount">$122.00</td>
          <td className="widgetLgStatus">
            <Button type="Declined" />
          </td>
        </tr>
        <tr className="widgetLgTr">
          <td className="widgetLgUser">
            <img
              src="https://images.pexels.com/photos/4172933/pexels-photo-4172933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt=""
              className="widgetLgImg"
            />
            <span className="widgetLgName">Susan Carol</span>
          </td>
          <td className="widgetLgDate">2 Jun 2021</td>
          <td className="widgetLgAmount">$122.00</td>
          <td className="widgetLgStatus">
            <Button type="Pending" />
          </td>
        </tr>
        <tr className="widgetLgTr">
          <td className="widgetLgUser">
            <img
              src="https://images.pexels.com/photos/4172933/pexels-photo-4172933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt=""
              className="widgetLgImg"
            />
            <span className="widgetLgName">Susan Carol</span>
          </td>
          <td className="widgetLgDate">2 Jun 2021</td>
          <td className="widgetLgAmount">$122.00</td>
          <td className="widgetLgStatus">
            <Button type="Approved" />
          </td>
        </tr>
      </table>

       {/* Modal Hồ sơ người dùng */}
       <UserProfileModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        user={user} // Truyền thông tin người dùng vào modal
      />
    </div>
  );
}
