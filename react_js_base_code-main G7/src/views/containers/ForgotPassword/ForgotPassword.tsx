import { useState } from "react";
import { useNavigate } from "react-router";
import { PATHS } from "../../../constant";
import "./ForgotPassword.css";

export const ForgotPassword = () => {
  const { pathname } = window.location;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email || !newPassword || !confirmPassword) {
      setMessage("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // Check if user exists
    const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
    const users = await res.json();

    if (users.length === 0) {
      setMessage("Email not found.");
      return;
    }

    // Update password (plain text for demo; hash in real app)
    const user = users[0];
    await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword })
    });

    setMessage("Password changed successfully.");
    setTimeout(() => {
      if (pathname === PATHS.FORGOT_PASSWORD.path) {
        navigate(PATHS.LOGIN.path);
      }
    }, 1500);
  };

  return (
    <div className="forgot-password-wrapper">
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
          <button type="submit" className="forgot-password-submitButton">
            Change Password
          </button>
          {message && <div className="forgot-password-message">{message}</div>}
        </form>
      </div>
    </div>
  );
};