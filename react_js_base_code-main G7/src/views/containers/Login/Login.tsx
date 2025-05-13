import { useNavigate } from "react-router";
import { PATHS } from "../../../constant";
import React, { useState } from "react";
import bcrypt from "bcryptjs";
import "./Login.css";

export const Login = () => {
  const { pathname } = window.location;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleClickToHomePage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/users");
      const users = await response.json();

      const foundUser = users.find((user: any) => user.email === email);

      if (foundUser) {
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);

        if (isPasswordValid) {
          if (foundUser.role === "admin") {
            navigate(PATHS.DASHBOARD.path);
          } else {
            navigate(PATHS.HOMEPAGE.path);
          }
        } else {
          setError("Invalid email or password.");
        }
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("Failed to connect to server.");
      console.error(err);
    }
  };

  const handleClickToChangePass = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === PATHS.LOGIN.path) {
      navigate(PATHS.FORGOTPASSWORD.path);
    }
  };

  const handleClickToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === PATHS.LOGIN.path) {
      navigate(PATHS.REGISTER.path);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-formContainer">
          <h1 className="login-title">Sign In</h1>
          <div>
            <form className="login-form" onSubmit={handleClickToHomePage}>
              <div className="login-inputGroup">
                <label>
                  <span className="login-label">Email</span>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                  />
                </label>
              </div>
              <div className="login-inputGroup">
                <label>
                  <span className="login-label">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                  />
                </label>
              </div>
              {error && <p className="login-error">{error}</p>}
              <p className="login-forgotPassword">
                Forgot Password?
                <button type="button" onClick={handleClickToChangePass} className="login-link">
                  Click Here
                </button>
              </p>
              <button type="submit" className="login-submitButton">
                Sign In
              </button>
            </form>
          </div>
          <div className="login-registerContainer">
            <p className="login-registerText">
              Don't have an account?
              <button type="button" onClick={handleClickToRegister} className="login-link">
                Sign Up
              </button>
            </p>
          </div>
        </div>
        {window.innerWidth >= 768 && (
          <div className="login-imageContainer">
            <img src="loginpic.jpg" alt="loginpic" className="login-image" />
          </div>
        )}
      </div>
    </div>
  );
};