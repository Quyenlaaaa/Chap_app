import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./changePassword.css";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8090/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to change password. Please check your inputs.");
      }

      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="changePassword">
      <h1 className="changePasswordTitle">Change Password</h1>
      <form className="changePasswordForm" onSubmit={handleChangePassword}>
        <div className="changePasswordItem">
          <label>Old Password</label>
          <div className="passwordField">
            <input
              type={isOldPasswordVisible ? "text" : "password"}
              placeholder="Enter your old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="togglePasswordVisibility"
              onClick={() => setIsOldPasswordVisible(!isOldPasswordVisible)}
            >
              {isOldPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="changePasswordItem">
          <label>New Password</label>
          <div className="passwordField">
            <input
              type={isNewPasswordVisible ? "text" : "password"}
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="togglePasswordVisibility"
              onClick={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
            >
              {isNewPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <button type="submit" className="changePasswordButton" disabled={isLoading}>
          {isLoading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
