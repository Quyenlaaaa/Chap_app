import "./roomList.css";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline } from "@mui/icons-material";
import { FaEdit } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

export default function RoomList() {
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogCreate, setOpenDialogCreate] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [newMemberEmails, setNewMemberEmails] = useState("");
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:8090/api/rooms", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm token nếu cần
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const result = await response.json();
        console.log(result);
        setData(result.result);
      } catch (error) {
        toast.error("Failed to fetch rooms. Please try again.");
      }
    };

    fetchRooms();
  }, []);

  const handleUpdateRoom = async () => {
    if (!selectedRoom) return;

    try {
      const response = await fetch(
        `http://localhost:8090/api/rooms/${selectedRoom.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ name: updatedName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update room");
      }
      setData((prevData) =>
        prevData.map((room) =>
          room.id === selectedRoom.id ? { ...room, name: updatedName } : room
        )
      );

      toast.success("Room updated successfully!");
      setOpenDialog(false); // Đóng dialog
    } catch (error) {
      toast.error("Failed to update room. Please try again.");
    }
  };

  const handleEditClick = (room) => {
    console.log(room);
    setSelectedRoom(room);
    setUpdatedName(room.name);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoom(null);
    setUpdatedName("");
  };

  const handleCreateRoom = async () => {
    const memberEmailsArray = newMemberEmails
      .split(",")
      .map((email) => email.trim());
    try {
      const response = await fetch("http://localhost:8090/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: newRoomName,
          memberEmails: memberEmailsArray,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const result = await response.json();

      const newRoom = result.result;
      if (!newRoom.id) {
        throw new Error("Room does not have an ID");
      }

      setData((prevData) => [...prevData, { id: newRoom.id, ...newRoom }]);
      toast.success("Room created successfully!");
      setOpenDialogCreate(false);
      setNewRoomName("");
      setNewMemberEmails("");
    } catch (error) {
      toast.error(error.message || "Failed to create room. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8090/api/rooms/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete room");
      }
      setData(data.filter((item) => item.id !== id));
      toast.success("Room deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete room. Please try again.");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Tên nhóm",
      width: 200,
    },
    { field: "createdByEmail", headerName: "Người tạo", width: 200 },

    {
      field: "action",
      headerName: "Điều chỉnh ",
      width: 200,
      renderCell: (params) => (
        <div className="flex items-center space-x-4">
          <FaEdit
            className="text-blue-500 cursor-pointer hover:text-blue-700"
            onClick={() => handleEditClick(params.row)}
            size={20}
            title="Edit"
          />
          <DeleteOutline
            className="text-red-500 cursor-pointer hover:text-red-700"
            onClick={() => handleDelete(params.row.id)}
            size={20}
            title="Delete"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="productList">
      <div style={{ marginBottom: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialogCreate(true)}
        >
          Tạo nhóm mới
        </Button>
      </div>
      <DataGrid
        rows={data}
        disableSelectionOnClick
        columns={columns}
        pageSize={8}
        checkboxSelection
      />
      {/* Dialog để chỉnh sửa Room Name */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Sửa tên nhóm</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Room Name"
            type="text"
            fullWidth
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdateRoom} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog tạo mới */}
      <Dialog
        open={openDialogCreate}
        onClose={() => setOpenDialogCreate(false)}
      >
        <DialogTitle>Tạo nhóm mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên nhóm"
            type="text"
            fullWidth
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Danh sách email, cách nhau dấu phẩy"
            type="text"
            fullWidth
            value={newMemberEmails}
            onChange={(e) => setNewMemberEmails(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogCreate(false)}>Cancel</Button>
          <Button onClick={handleCreateRoom} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
