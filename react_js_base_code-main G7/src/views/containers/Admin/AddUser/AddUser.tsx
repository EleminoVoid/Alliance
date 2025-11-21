import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddUser.css"
import { ADMIN_PATHS } from "../../../../constant/constants";
import { getUsers, addUser } from "../../../../api";

export const AddUser = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate password confirmation
    if (userData.password !== userData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      const existingUsers = await getUsers();
      if ((existingUsers || []).some((u: any) => (u.Email ?? u.email) === userData.email)) {
        toast.error("An account with this email already exists.");
        setIsSubmitting(false);
        return;
      }

      const newUser = {
        Email: userData.email,
        Username: userData.username.trim(),
        Password: userData.password,
        Role: userData.role
      }

      await addUser(newUser);
      toast.success("User added successfully!")
      setTimeout(() => {
        navigate(ADMIN_PATHS.USER_MANAGEMENT.path)
      }, 1500);
      setUserData({
        username: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
      })
    } catch (err: any) {
      toast.error(err.message || "Error adding user")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="user-form-container">
      <ToastContainer />
      <h1>Add user</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-fields">
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={userData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" value={userData.role} onChange={handleInputChange} required>
                <option value="">Select a role</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={userData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={userData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
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
  )
}
