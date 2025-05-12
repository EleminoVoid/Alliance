import { useNavigate } from "react-router";
import { PATHS } from "../../../constant";
import React, { useState } from "react";
import bcrypt from "bcryptjs";

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
      setError("All fields are required.");
      return;
    }

    try {
      // Hash the password before sending it to the server
      const hashedPassword = await bcrypt.hash(password, 10);

      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password: hashedPassword, role: "user" }),
      });

      if (response.ok) {
        navigate(PATHS.LOGIN.path);
      } else {
        setError("Failed to register. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to server.");
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
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.formContainer}>
          <h1 style={styles.title}>Sign Up</h1>
          <div>
            <form style={styles.form} onSubmit={handleRegister}>
              <div style={styles.inputGroup}>
                <label>
                  <span style={styles.label}>Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                  />
                </label>
              </div>
              <div style={styles.inputGroup}>
                <label>
                  <span style={styles.label}>Username</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                <button type="submit" style={styles.submitButton}>
                  Sign Up
                </button>
              </form>
            </div>
          </div>
          <div style={styles.registerContainer}>
            <p style={styles.registerText}>
              Already have an account?
              <button onClick={handleClickToLogin} style={styles.link}>
                Sign In
              </button>
            </p>
          </div>
        {window.innerWidth >= 768 && (
          <div style={styles.imageContainer}>
            <img src="registerpic.jpg" alt="registerpic" style={styles.image} />
          </div>
        )}
      </div>
    </div>
  );
};
const styles: { [key: string]: React.CSSProperties } = {
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