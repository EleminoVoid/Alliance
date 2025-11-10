import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserById, updateUser, resetUserPassword } from "../../../../api";
import "./EditUser.css";

interface UserData {
  Id: string;
  Username: string;
  Email: string;
  Role: string;
}

export const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => {
    if (!id) return;
    console.log("Fetching user with ID:", id);
    getUserById(id)
      .then((data: any) => {
        console.log("User data received:", data);
        // Handle both PascalCase and camelCase
        const role = data.Role || data.role || "";
        // Normalize role to PascalCase (capitalize first letter)
        const normalizedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

        const normalizedData = {
          Id: data.Id || data.id,
          Username: data.Username || data.username,
          Email: data.Email || data.email,
          Role: normalizedRole
        };
        console.log("Normalized user data:", normalizedData);
        setUserData(normalizedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading user:", err);
        toast.error("Failed to load user");
        setLoading(false);
      });
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

    try {
      // Update user details
      const updatedUserData = {
        Username: userData.Username,
        Email: userData.Email,
        Role: userData.Role
      };
      await updateUser(userData.Id, updatedUserData);

      // Reset password if provided
      if (passwordInput) {
        await resetUserPassword(userData.Id, passwordInput);
      }

      toast.success("User updated successfully!");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Error updating user");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!userData) return <div>User not found</div>;

  return (
    <div className="user-form-container">
      <ToastContainer />
      <h1>Edit user</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-fields">
          <div className="form-field">
            <label htmlFor="Username">Username</label>
            <input
              type="text"
              id="Username"
              name="Username"
              value={userData.Username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={userData.Email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="Role">Role</label>
              <select
                id="Role"
                name="Role"
                value={userData.Role}
                onChange={handleInputChange}
                required
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="password">New Password (optional)</label>
              <input
                type="password"
                id="password"
                name="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Leave empty to keep current password"
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
