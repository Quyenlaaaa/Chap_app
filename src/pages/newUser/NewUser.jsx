import React, { useState } from "react";
import "./newUser.css";
import { toast } from "react-toastify";

export default function NewUser() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    roleId: 2, 
  });

  const token = localStorage.getItem('token');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8090/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("User created successfully!");
        setFormData({
          email: "",
          password: "",
          name: "",
          roleId: 2,
        });
      } else {
        toast.error("Failed to create user. Please try again!");
      }
    } catch (error) {
      toast.error("Error occurred while creating user. Please try again later.");
    }
  };

  return (
    <div className="newUser">
      <h1 className="newUserTitle">New User</h1>
      <form className="newUserForm" onSubmit={handleSubmit}>
        <div className="newUserItem">
          <label>Username</label>
          <input
            type="text"
            placeholder="john"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="newUserItem">
          <label>Email</label>
          <input
            type="email"
            placeholder="john@gmail.com"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="newUserItem">
          <label>Password</label>
          <input
            type="password"
            placeholder="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="newUserItem">
          <label>Role</label>
          <select
            className="newUserSelect"
            name="roleId"
            id="roleId"
            onChange={handleInputChange}
            value={formData.roleId}
          >
            <option value="2">Moderator</option>
            <option value="3">Normal</option>
          </select>
        </div>
        <button className="newUserButton" type="submit">
          Create
        </button>
      </form>
    </div>
  );
}
