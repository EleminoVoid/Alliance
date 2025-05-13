import type React from "react"
import { useState, useEffect } from "react"
import EditIcon from "@mui/icons-material/Edit";
import "./EditUser.css"

interface UserData {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  password: string
}

export const EditUser = ({ userId = 1 }: { userId?: number }) => {
  const [userData, setUserData] = useState<UserData>({
    id: userId,
    firstName: "John",
    lastName: "Doe",
    email: "john_doe@gmail.com",
    role: "Admin",
    password: "Testing!23$",
  })

  useEffect(() => {
    // Fetch user data based on userId
    // This would be an API call in a real application
    console.log(`Fetching user data for user ID: ${userId}`)
  }, [userId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("User data updated:", userData)
    // Add API call here
  }

  return (
    <div className="user-form-container">
      <h1>Edit user</h1>

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
                value={userData.firstName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" name="lastName" value={userData.lastName} onChange={handleInputChange} />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={userData.email} onChange={handleInputChange} />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" value={userData.role} onChange={handleInputChange}>
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
                value={userData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Save
          </button>
          <button type="button" className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
