import type React from "react"
import { useState } from "react"
import EditIcon from "@mui/icons-material/Edit";
import "./AddUser.css"

export const AddUser = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("User data submitted:", userData)
    // Add API call here
  }

  return (
    <div className="user-form-container">
      <h1>Add user</h1>

      <form onSubmit={handleSubmit}>
        <div className="avatar-section">
          <div className="user-avatar">
            <EditIcon />
          </div>
        </div>

        <div className="form-fields">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={userData.firstName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={userData.lastName}
                onChange={handleInputChange}
              />
            </div>
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
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" value={userData.role} onChange={handleInputChange}>
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
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Submit
          </button>
          <button type="button" className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
