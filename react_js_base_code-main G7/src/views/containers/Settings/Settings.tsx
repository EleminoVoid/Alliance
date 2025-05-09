// Settings.tsx
import React, { useState } from "react";

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("account");
  const [email, setEmail] = useState<string>("user@example.com");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [bookingReminders, setBookingReminders] = useState<boolean>(true);
  const [systemUpdates, setSystemUpdates] = useState<boolean>(false);

  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");

  const handleSaveAccount = (): void => {
    // Validate passwords
    if (newPassword && newPassword !== confirmPassword) {
      setNotificationMessage("Passwords don't match. Please make sure your new password and confirmation match.");
      setShowNotification(true);
      return;
    }

    // In a real app, this would update the user's account
    setNotificationMessage("Account information updated successfully.");
    setShowNotification(true);

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleSaveNotifications = (): void => {
    // In a real app, this would update notification preferences
    setNotificationMessage("Notification preferences saved successfully.");
    setShowNotification(true);

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div style={styles.settingsPage}>
      <h1 style={styles.pageTitle}>Account Settings</h1>

      <div style={styles.settingsTabs}>
        <button 
          style={{
            ...styles.settingsTab,
            ...(activeTab === "account" ? styles.settingsTabActive : {})
          }}
          onClick={() => setActiveTab("account")}
        >
          Account
        </button>
        <button 
          style={{
            ...styles.settingsTab,
            ...(activeTab === "notifications" ? styles.settingsTabActive : {})
          }}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button>
      </div>

      {activeTab === "account" && (
        <div style={styles.settingsSection}>
          <h2 style={styles.sectionTitle}>Account Settings</h2>
          <p style={styles.sectionDescription}>Update your account information and change your password</p>
          
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={styles.input}
            />
          </div>

          <h3 style={styles.subsectionTitle}>Change Password</h3>

          <div style={styles.formGroup}>
            <label htmlFor="current-password" style={styles.label}>Current Password</label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="new-password" style={styles.label}>New Password</label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="confirm-password" style={styles.label}>Confirm New Password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <button onClick={handleSaveAccount} style={styles.saveButton}>
            Save Changes
          </button>
        </div>
      )}

      {activeTab === "notifications" && (
        <div style={styles.settingsSection}>
          <h2 style={styles.sectionTitle}>Notification Settings</h2>
          <p style={styles.sectionDescription}>Configure how and when you receive notifications</p>
          
          <div style={styles.notificationOption}>
            <div>
              <label htmlFor="push-notifications" style={styles.label}>Push Notifications</label>
              <p style={styles.optionDescription}>Receive notifications in your browser</p>
            </div>
            <input 
              id="push-notifications" 
              type="checkbox" 
              checked={pushNotifications} 
              onChange={() => setPushNotifications(!pushNotifications)} 
              style={styles.checkbox}
            />
          </div>

          <div style={styles.notificationOption}>
            <div>
              <label htmlFor="email-notifications" style={styles.label}>Email Notifications</label>
              <p style={styles.optionDescription}>Receive notifications via email</p>
            </div>
            <input 
              id="email-notifications" 
              type="checkbox" 
              checked={emailNotifications} 
              onChange={() => setEmailNotifications(!emailNotifications)} 
              style={styles.checkbox}
            />
          </div>

          <h3 style={styles.subsectionTitle}>Notification Types</h3>

          <div style={styles.notificationOption}>
            <div>
              <label htmlFor="booking-reminders" style={styles.label}>Booking Reminders</label>
              <p style={styles.optionDescription}>Receive reminders before your scheduled bookings</p>
            </div>
            <input 
              id="booking-reminders" 
              type="checkbox" 
              checked={bookingReminders} 
              onChange={() => setBookingReminders(!bookingReminders)} 
              style={styles.checkbox}
            />
          </div>

          <div style={styles.notificationOption}>
            <div>
              <label htmlFor="system-updates" style={styles.label}>System Updates</label>
              <p style={styles.optionDescription}>Receive notifications about system updates and new features</p>
            </div>
            <input 
              id="system-updates" 
              type="checkbox" 
              checked={systemUpdates} 
              onChange={() => setSystemUpdates(!systemUpdates)} 
              style={styles.checkbox}
            />
          </div>

          <button onClick={handleSaveNotifications} style={styles.saveButton}>
            Save Preferences
          </button>
        </div>
      )}

      {showNotification && (
        <div style={styles.notification}>
          <p>{notificationMessage}</p>
        </div>
      )}
    </div>
  );
};

// Inline styles
const styles = {
  settingsPage: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  settingsTabs: {
    display: 'flex',
    borderBottom: '1px solid #ddd',
    marginBottom: '20px',
  },
  settingsTab: {
    padding: '10px 15px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
  },
  settingsTabActive: {
    borderBottomColor: '#4a3450',
    color: '#4a3450',
  },
  settingsSection: {
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '20px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: '0',
    marginBottom: '5px',
  },
  sectionDescription: {
    color: '#666',
    marginBottom: '20px',
  },
  subsectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '30px',
    marginBottom: '15px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  notificationOption: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee',
  },
  optionDescription: {
    margin: '0',
    color: '#666',
    fontSize: '14px',
  },
  checkbox: {
    width: '20px',
    height: '20px',
  },
  saveButton: {
    padding: '10px 15px',
    backgroundColor: '#4a3450',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
    fontSize: '16px',
  },
  notification: {
    position: 'fixed' as const,
    bottom: '20px',
    right: '20px',
    backgroundColor: '#4a3450',
    color: 'white',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
};

export default Settings;