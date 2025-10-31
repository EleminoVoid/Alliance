import { useState } from "react";
import { useNavigate } from "react-router";
import { PATHS } from "../../../constant";
import { ToastContainer, toast } from "react-toastify"
import { getUsers, changePassword } from "../../../api";
import "./ForgotPassword.css";

export const ForgotPassword = () => {
  const { pathname } = window.location;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !currentPassword || !newPassword || !confirmPassword) {
      toast.info("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Find user by email to get userId
      const users = await getUsers();
      const user = users.find((u: any) => (u.Email ?? u.email) === email);

      if (!user) {
        toast.error("Email not found");
        setIsSubmitting(false);
        return;
      }

      // Call change password API
      await changePassword(user.Id ?? user.id, currentPassword, newPassword, confirmPassword);

      toast.success("Password changed successfully.");
      setTimeout(() => {
        navigate(PATHS.LOGIN.path);
      }, 1500);
    } catch (err: any) {
      console.error("Password change error:", err);
      const errorMessage = err?.message || "Failed to change password. Please check your current password.";
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-wrapper">
      <ToastContainer />
      <div className="forgot-password-container">
        <h2 className="forgot-password-title">Forgot Password</h2>
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <div className="forgot-password-inputContainer">
            <label>
              <span className="forgot-password-label">Email</span>
              <input
                type="email"
                className="forgot-password-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="forgot-password-inputContainer">
            <label>
              <span className="forgot-password-label">Current Password</span>
              <input
                type="password"
                className="forgot-password-input"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="forgot-password-inputContainer">
            <label>
              <span className="forgot-password-label">New Password</span>
              <input
                type="password"
                className="forgot-password-input"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="forgot-password-inputContainer">
            <label>
              <span className="forgot-password-label">Confirm Password</span>
              <input
                type="password"
                className="forgot-password-input"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit" className="forgot-password-submitButton" disabled={isSubmitting}>
            {isSubmitting ? "Changing Password..." : "Change Password"}
          </button>
          {message && <div className="forgot-password-message">{message}</div>}
        </form>
      </div>
    </div>
  );
};