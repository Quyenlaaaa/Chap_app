import "./userList.css";
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutline } from '@mui/icons-material';
import { userRows } from "../../dummyData";
import { Link } from "react-router-dom";
// import { useState } from "react";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function UserList() {
  const [data, setData] = useState(userRows);
  
  const [error, setError] = useState(null); 

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8090/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
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
          avatar: user.imagePath ? `http://localhost:8090/profile/${user.imagePath}` : 'http://localhost:8090/profile/default-avatar-url.png',
          isVerify: user.isVerify,
          role: user.roleResponse.name || 'User',
          status: user.status || 'Active',
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError(error.message); 
      }
    };

    fetchUsers();
  }, [token]);

  // Handle role change
  const handleRoleChange = async (id, newRole) => {
    try {
      const response = await fetch(`http://localhost:8090/api/users/${id}/roles`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Thêm Authorization header
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (response.ok) {
        // Update the local state after successful role change
        setData(data.map((item) => (item.id === id ? { ...item, role: newRole } : item)));
        toast.success('Role updated successfully!');
      } else {
        toast.error('Failed to update role. Please try again!');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Error updating role. Please try again later.');
    }
  };

  // Hàm xóa người dùng
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8090/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      if (response.ok) {
        setData(data.filter((item) => item.id !== id));
        toast.success('User deleted successfully!');
      } else {
        toast.error('Failed to delete user. Please try again!');
      }
    } catch (error) {
      toast.error('Error deleting user. Please try again later.');
    }
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
    { field: 'role', headerName: 'Role', width: 150, 
      renderCell: (params) => (
        <select 
          value={params.row.role} 
          onChange={(e) => handleRoleChange(params.row.id, e.target.value)}
        >
          <option value="NORMAL">Normal User</option>
          <option value="MODERATOR">Moderator</option>
          <option value="ADMIN">Admin</option>
        </select>
      )
    },
    { field: "email", headerName: "Email", width: 200 },
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
