import React, { useEffect, useState } from "react";
import "./Settings.css";
import { ToastContainer, toast } from "react-toastify";

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("account");
  const [email, setEmail] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [bookingReminders, setBookingReminders] = useState<boolean>(true);
  const [systemUpdates, setSystemUpdates] = useState<boolean>(false);

  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");

  // Fetch user info
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    fetch(`http://localhost:3000/users/${userId}`)
      .then(res => res.json())
      .then(user => {
        if (user && user.email) setEmail(user.email);
      })
      .catch(() => setEmail(""));
  }, []);

  const handleSaveAccount = (): void => {
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Passwords don't match. Please make sure your new password and confirmation match.");
      return;
    }

    toast.success("Account information updated successfully.");
  };

  const handleSaveNotifications = (): void => {
    toast.success("Notification preferences saved successfully.");
  };

  return (
    <div className="settings-page">
      <ToastContainer />
      <h1 className="page-title">Account Settings</h1>

      <div className="settings-tabs">
        <button
          className={`settings-tab ${activeTab === "account" ? "settings-tab-active" : ""}`}
          onClick={() => setActiveTab("account")}
        >
          Account
        </button>
        <button
          className={`settings-tab ${activeTab === "notifications" ? "settings-tab-active" : ""}`}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button>
      </div>

      {activeTab === "account" && (
        <div className="settings-section">
          <h2 className="section-title">Account Settings</h2>
          <p className="section-description">Update your account information and change your password</p>

          <div className="form-group">
            <label htmlFor="email" className="label">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>

          <h3 className="subsection-title">Change Password</h3>

          <div className="form-group">
            <label htmlFor="current-password" className="label">Current Password</label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="new-password" className="label">New Password</label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password" className="label">Confirm New Password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
            />
          </div>

          <button onClick={handleSaveAccount} className="save-button">
            Save Changes
          </button>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="settings-section">
          <h2 className="section-title">Notification Settings</h2>
          <p className="section-description">Configure how and when you receive notifications</p>

          <div className="notification-option">
            <div>
              <label htmlFor="push-notifications" className="label">Push Notifications</label>
              <p className="option-description">Receive notifications in your browser</p>
            </div>
            <input
              id="push-notifications"
              type="checkbox"
              checked={pushNotifications}
              onChange={() => setPushNotifications(!pushNotifications)}
              className="checkbox"
            />
          </div>

          <div className="notification-option">
            <div>
              <label htmlFor="email-notifications" className="label">Email Notifications</label>
              <p className="option-description">Receive notifications via email</p>
            </div>
            <input
              id="email-notifications"
              type="checkbox"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
              className="checkbox"
            />
          </div>

          <h3 className="subsection-title">Notification Types</h3>

          <div className="notification-option">
            <div>
              <label htmlFor="booking-reminders" className="label">Booking Reminders</label>
              <p className="option-description">Receive reminders before your scheduled bookings</p>
            </div>
            <input
              id="booking-reminders"
              type="checkbox"
              checked={bookingReminders}
              onChange={() => setBookingReminders(!bookingReminders)}
              className="checkbox"
            />
          </div>

          <div className="notification-option">
            <div>
              <label htmlFor="system-updates" className="label">System Updates</label>
              <p className="option-description">Receive notifications about system updates and new features</p>
            </div>
            <input
              id="system-updates"
              type="checkbox"
              checked={systemUpdates}
              onChange={() => setSystemUpdates(!systemUpdates)}
              className="checkbox"
            />
          </div>

          <button onClick={handleSaveNotifications} className="save-button">
            Save Preferences
          </button>
        </div>
      )}

      {showNotification && (
        <div className="notification">
          <p>{notificationMessage}</p>
        </div>
      )}
    </div>
  );
};