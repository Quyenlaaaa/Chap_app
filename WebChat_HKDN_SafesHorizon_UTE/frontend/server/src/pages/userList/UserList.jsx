import "./userList.css";
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutline } from '@mui/icons-material';
import { userRows } from "../../dummyData";
import { Link } from "react-router-dom";
// import { useState } from "react";
import React, { useState, useEffect } from 'react';

export default function UserList() {
  const [data, setData] = useState(userRows);
  
  const [error, setError] = useState(null); // Để lưu lỗi nếu có

  // Token giả định (thay bằng cách lấy token từ localStorage hoặc context của bạn)
  const token = localStorage.getItem('token');

  // Gọi API để lấy danh sách người dùng
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8090/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Thêm Authorization header
          },
        });
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid token or expired session');
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        console.log(result)
        const formattedData = result.result.map((user, index) => ({
          id: user.id || index,
          username: user.name,
          email: user.email,
          avatar: user.imagePath ? `http://localhost:8090/profile/${user.imagePath}` : 'default-avatar-url.png',
          isVerify: user.isVerify,
          role: user.roleResponse.name || 'User',
          status: user.status || 'Active',
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError(error.message); // Lưu lỗi vào state
      }
    };

    fetchUsers();
  }, [token]);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "user",
      headerName: "User",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.avatar} alt="" />
            {params.row.username}
          </div>
        );
      },
    },
    // {field: "isVerify", headerName: "isVerify", width: 150},
    {field: "role", headerName: "Role", width: 150},
    { field: "email", headerName: "Email", width: 200 },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   width: 100,
    // },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/user/" + params.row.id}>
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="userList">
      <DataGrid
        rows={data}
        disableSelectionOnClick
        columns={columns}
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}
