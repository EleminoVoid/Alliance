import { useNavigate, useLocation } from "react-router-dom";
import { PATHS } from "../../../constant";
import React, { useState, useEffect } from "react";
import "./Login.css";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import { getErrorMessage } from '../../../utils/error';

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Clear all local storage when the login page loads
  useEffect(() => {
    // No-op: we avoid using localStorage for auth; backend session/cookies
    // and AuthContext handle authentication state.
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const auth = useAuth();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use AuthContext to perform login and populate current user from server
      const user = await auth.login(formData.email, formData.password);
      const role = (user?.role || user?.Role || user?.role || user?.Role || "").toString();
      // If the login flow included a return path, navigate there after successful login
      const from = (location.state as any)?.from as string | undefined;
      if (role.toLowerCase() === "admin") {
        navigate(PATHS.DASHBOARD.path);
      } else if (from) {
        navigate(from);
      } else {
        navigate(PATHS.HOMEPAGE.path);
      }
    } catch (err) {
      const msg = getErrorMessage(err, "Invalid email or password");
      setError(msg);
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