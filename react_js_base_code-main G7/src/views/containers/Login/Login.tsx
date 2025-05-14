import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../constant";
import React, { useState } from "react";
import bcrypt from "bcryptjs";
import "./Login.css";
import { CircularProgress } from "@mui/material";

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const users = await response.json();
      const foundUser = users.find((user: any) => user.email === formData.email);

      if (!foundUser) {
        throw new Error("Invalid email or password");
      }

      const isPasswordValid = await bcrypt.compare(formData.password, foundUser.password);
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      // Store both user ID and role in localStorage
      localStorage.setItem("userId", foundUser.id);
      localStorage.setItem("userRole", foundUser.role);
      localStorage.setItem("username", foundUser.username);

      // Redirect based on role
      if (foundUser.role === "admin") {
        navigate(PATHS.DASHBOARD.path || PATHS.DASHBOARD.path);
      } else {
        navigate(PATHS.HOMEPAGE.path);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to server");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-formContainer">
          <h1 className="login-title">Sign In</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-inputGroup">
              <label>
                <span className="login-label">Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="login-input"
                  required
                />
              </label>
            </div>
            <div className="login-inputGroup">
              <label>
                <span className="login-label">Password</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="login-input"
                />
              </label>
            </div>
            
            {error && <p className="login-error">{error}</p>}
            
            <p className="login-forgotPassword">
              Forgot Password?{" "}
              <button 
                type="button" 
                onClick={navigateTo(PATHS.FORGOT_PASSWORD.path)} 
                className="login-link"
              >
                Click Here
              </button>
            </p>
            
            <button 
              type="submit" 
              className="login-submitButton"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </button>
          </form>
          
          <div className="login-registerContainer">
            <p className="login-registerText">
              Don't have an account?{" "}
              <button 
                type="button" 
                onClick={navigateTo(PATHS.REGISTER.path)} 
                className="login-link"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
        
        {window.innerWidth >= 768 && (
          <div className="login-imageContainer">
            <img src="loginpic.jpg" alt="login" className="login-image" />
          </div>
        )}
      </div>
    </div>
  );
};