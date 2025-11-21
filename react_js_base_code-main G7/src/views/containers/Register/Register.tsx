import { useNavigate } from "react-router";
import { PATHS } from "../../../constant";
import React, { useState } from "react";
import "./Register.css";
import { ToastContainer, toast } from "react-toastify";
import { getUsers, addUser } from "../../../api";
import { getErrorMessage } from "../../../utils/error";

export const Register = () => {
  const { pathname } = window.location;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !username || !password) {
      toast.error("All field are required.");
      return;
    }

    if (isSubmitting) {
      return; // Prevent double submission
    }

    setIsSubmitting(true);

    try {
      // Check if email already exists
      const existingUsers = await getUsers();
      if ((existingUsers || []).some((u: any) => (u.Email ?? u.email) === email)) {
        toast.error("An account with this email already exists.");
        setIsSubmitting(false);
        return;
      }

      // Send plain password - backend will hash it
      try {
        const result = await addUser({ Email: email, Username: username, Password: password, Role: "user" });
        console.log("Registration result:", result);

        // Successfully registered, navigate to login
        toast.success("Registration successful! Please login.");
        setTimeout(() => {
          navigate(PATHS.LOGIN.path);
        }, 1500);
      } catch (err: any) {
        console.error("Registration error:", err);
        const errorMessage = getErrorMessage(err, "Failed to register. Please try again.");
        toast.error(errorMessage);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMessage = getErrorMessage(err, "Failed to register. Please try again.");
      toast.error(errorMessage);
      setIsSubmitting(false);
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
              <button type="submit" className="register-submitButton" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Sign Up"}
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