import { useNavigate } from "react-router";
import { PATHS } from "../../../constant";
import React, { useState } from "react";
import bcrypt from "bcryptjs";

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
        // Compare the entered password with the hashed password
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
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.formContainer}>
          <h1 style={styles.title}>Sign In</h1>
          <div>
            <form style={styles.form} onSubmit={handleClickToHomePage}>
              <div style={styles.inputGroup}>
                <label>
                  <span style={styles.label}>Email</span>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                  />
                </label>
              </div>
              <div style={styles.inputGroup}>
                <label>
                  <span style={styles.label}>Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                  />
                </label>
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <p style={styles.forgotPassword}>
                Forgot Password?
                <button type="button" onClick={handleClickToChangePass} style={styles.link}>
                  Click Here
                </button>
              </p>
              <button type="submit" style={styles.submitButton}>
                Sign In
              </button>
            </form>
          </div>
          <div style={styles.registerContainer}>
            <p style={styles.registerText}>
              Don't have an account?
              <button type="button" onClick={handleClickToRegister} style={styles.link}>
                Sign Up
              </button>
            </p>
          </div>
        </div>
        {window.innerWidth >= 768 && (
          <div style={styles.imageContainer}>
            <img src="loginpic.jpg" alt="loginpic" style={styles.image} />
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#56697F",
    fontFamily: "Inter, Arial, sans-serif",
  },
  wrapper: {
    height: "auto",
    width: window.innerWidth < 768 ? "90%" : "860px",
    display: "grid",
    gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "1fr 1fr",
    border: "none",
    borderRadius: "10px",
    padding: "20px",
    margin: "20px",
    backgroundColor: "white",
    gap: "20px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px",
    minHeight: "400px",
  },
  title: {
    textAlign: "left",
    color: "#593F62",
    marginTop: 0,
    fontSize: "28px",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputGroup: {
    width: "100%",
    maxWidth: "300px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#333",
    fontSize: "14px",
  },
  input: {
    marginBottom: "15px",
    padding: "12px 10px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "1em",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
  forgotPassword: {
    margin: "5px 0 0 0",
    fontSize: "14px",
    textAlign: "right",
    width: "100%",
    maxWidth: "300px",
  },
  link: {
    fontStyle: "italic",
    background: "none",
    border: "none",
    color: "#593F62",
    cursor: "pointer",
    fontSize: "14px",
    paddingLeft: "5px",
    fontWeight: "500",
  },
  submitButton: {
    marginTop: "30px",
    padding: "12px 40px",
    backgroundColor: "#593F62",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "1.1em",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  registerContainer: {
    marginTop: "40px",
    textAlign: "center",
  },
  registerText: {
    marginBottom: 0,
    fontSize: "14px",
  },
  imageContainer: {
    height: "100%",
    paddingLeft: "20px",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: "10px",
    objectFit: "cover",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
};