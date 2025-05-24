import { useNavigate } from "react-router";
import { PATHS } from "../../../constant";
import React, { useState } from "react";
import bcrypt from "bcryptjs";
import "./Register.css";
import { ToastContainer, toast } from "react-toastify";

export const Register = () => {
  const { pathname } = window.location;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !username || !password) {
      toast.error("All field are required.");
      return;
    }

    try {
      // Check if email already exists
      const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
      const existingUsers = await res.json();
      if (existingUsers.length > 0) {
        toast.error("An account with this email already exists.");
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password: hashedPassword, role: "user" }),
      });

      if (response.ok) {
        navigate(PATHS.LOGIN.path);
      } else {
        toast.error("Failed to register. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to connect to server.");
      console.error(err);
    }
  };

  const handleClickToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === PATHS.REGISTER.path) {
      navigate(PATHS.LOGIN.path);
    }
  };

  return (
    <div className="register-container">
      <ToastContainer />
      <div className="register-wrapper">
        <div className="register-formContainer">
          <h1 className="register-title">Sign Up</h1>
          <div>
            <form className="register-form" onSubmit={handleRegister}>
              <div className="register-inputGroup">
                <label>
                  <span className="register-label">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="register-input"
                  />
                </label>
              </div>
              <div className="register-inputGroup">
                <label>
                  <span className="register-label">Username</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="register-input"
                  />
                </label>
              </div>
              <div className="register-inputGroup">
                <label>
                  <span className="register-label">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="register-input"
                  />
                </label>
              </div>
              {error && <p className="register-error">{error}</p>}
              <button type="submit" className="register-submitButton">
                Sign Up
              </button>
            </form>
          </div>
          <div className="register-registerContainer">
            <p className="register-registerText">
              Already have an account?
              <button onClick={handleClickToLogin} className="register-link">
                Sign In
              </button>
            </p>
          </div>
        </div>
        {window.innerWidth >= 768 && (
          <div className="register-imageContainer">
            <img src="registerpic.jpg" alt="registerpic" className="register-image" />
          </div>
        )}
      </div>
    </div>
  );
};