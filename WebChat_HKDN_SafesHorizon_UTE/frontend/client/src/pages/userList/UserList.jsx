import "./userList.css";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline } from "@mui/icons-material";
import { userRows } from "../../dummyData";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { FaEnvelope } from "react-icons/fa";

export default function UserList() {
  const [data, setData] = useState(userRows);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false); // State để quản lý dialog
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    roleId: 3, // Default là NORMAL
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8090/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid token or expired session");
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        const formattedData = result.result.map((user, index) => ({
          id: user.id || index,
          username: user.name,
          email: user.email,
          avatar: user.imagePath
            ? `http://localhost:8090/profile/${user.imagePath}`
            : "http://localhost:8090/profile/default-avatar-url.png",
          isVerify: user.isVerify,
          role: user.roleResponse.name || "User",
          status: user.status || "Active",
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError(error.message);
      }
    };

    fetchUsers();
  }, [token]);

  const handleRoleChange = async (id, newRole) => {
    try {
      const response = await fetch(
        `http://localhost:8090/api/users/${id}/roles`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );
      if (response.ok) {
        setData(
          data.map((item) =>
            item.id === id ? { ...item, role: newRole } : item
          )
        );
        toast.success("Role updated successfully!");
      } else {
        toast.error("Failed to update role. Please try again!");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Error updating role. Please try again later.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8090/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setData(data.filter((item) => item.id !== id));
        toast.success("User deleted successfully!");
      } else {
        toast.error("Failed to delete user. Please try again!");
      }
    } catch (error) {
      toast.error("Error deleting user. Please try again later.");
    }
  };

  // Xử lý mở và đóng dialog
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleResetPassword = async (email) => {
    console.log(email);
    try {
      const response = await fetch(
        "http://localhost:8090/api/users/send-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        toast.success("Password reset successfully!");
      } else {
        const errorMsg = await response.text();
        toast.error(`Failed to reset password: ${errorMsg}`);
      }
    } catch (error) {
      toast.error("Error resetting password. Please try again later.");
    }
  };

  // Xử lý tạo user mới
  // Xử lý tạo user mới
  const handleCreateUser = async () => {
    try {
      const response = await fetch("http://localhost:8090/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const createdUser = await response.json();

        console.log(createdUser);
        // Thêm user mới vào bảng
        setData((prevData) => [
          ...prevData,
          {
            id: createdUser.result.id,
            username: createdUser.result.name,
            email: createdUser.result.email,
            role: createdUser.result.roleResponse.name,
            avatar: "http://localhost:8090/profile/default-avatar-url.png",
            status: createdUser.result.status || "Active",
          },
        ]);

        toast.success("User created successfully!");
        handleClose();
      } else {
        const errorMsg = await response.text();
        toast.error(`Failed to create user: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error creating user. Please try again later.");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "user",
      headerName: "Người dùng",
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
    {
      field: "role",
      headerName: "Vai trò",
      width: 150,
      renderCell: (params) => (
        <select
          value={params.row.role}
          onChange={(e) => handleRoleChange(params.row.id, e.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="NORMAL">Normal User</option>
          <option value="MODERATOR">Moderator</option>
          <option value="ADMIN">Admin</option>
        </select>
      ),
      
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "action",
      headerName: "Điều chỉnh",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex items-center space-x-4">
            <FaEnvelope
              className="text-blue-500 cursor-pointer hover:text-blue-700"
              onClick={() => handleResetPassword(params.row.email)}
              size={20}
              title="Send Password"
            />
            <DeleteOutline
              className="text-red-500 cursor-pointer hover:text-red-700"
              onClick={() => handleDelete(params.row.id)}
              size={20}
              title="Delete"
            />
          </div>
        );
      },
      
    },
  ];

  return (
    <div className="userList">
      <div style={{ marginBottom: "20px" }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Tạo tài khoản mới
        </Button>
      </div>
      <DataGrid
        rows={data}
        disableSelectionOnClick
        columns={columns}
        pageSize={8}
        checkboxSelection
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Tạo người dùng mới</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tên"
            fullWidth
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Mật khẩu"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Vai trò"
            fullWidth
            select
            SelectProps={{
              native: true,
            }}
            value={newUser.roleId}
            onChange={(e) =>
              setNewUser({ ...newUser, roleId: parseInt(e.target.value, 10) })
            }
          >
            <option value={1}>Admin</option>
            <option value={2}>Moderator</option>
            <option value={3}>Normal</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateUser} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
