import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import bcrypt from "bcryptjs";
import "./EditUser.css";

interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  password: string;
  avatar?: string;
}

export const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3000/users/${id}`)
      .then((res) => res.json())
      .then((data: UserData) => {
        setUserData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!userData) return;
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;
    let updatedUser = { ...userData };
    if (passwordInput) {
      // Hash the new password
      updatedUser.password = await bcrypt.hash(passwordInput, 10);
    }
    // else, keep the old hash
    fetch(`http://localhost:3000/users/${userData.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update user");
        alert("User updated!");
        navigate(-1);
      })
      .catch(() => alert("Error updating user"));
  };

  if (loading) return <div>Loading...</div>;
  if (!userData) return <div>User not found</div>;

  return (
    <div className="user-form-container">
      <h1>Edit user</h1>
      <form onSubmit={handleSubmit}>
        <div className="avatar-section">
          <div className="user-avatar">
            <img src={userData.avatar || "https://i.pravatar.cc/40"} alt="avatar" />
            <EditIcon />
          </div>
        </div>
        <div className="form-fields">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={userData.username}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={userData.role}
                onChange={handleInputChange}
                required
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Enter new password to change"
              />
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Save
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
