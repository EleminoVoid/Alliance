import type React from "react";
import { Link } from "@mui/material";

export const Homepage: React.FC = () => {
  return (
    <div style={styles.container}>
      <img src="homepage-pic.webp" alt="homepage-pic" style={styles.backgroundImage} />
      <div style={styles.overlay}></div>
      <div style={styles.textContainer}>
        <h1 style={styles.title}>Manage your work and meeting room facility</h1>
        <p style={styles.subtitle}>with</p>
        <h1 style={styles.mainTitle}>MARSHAL</h1>
      </div>
      <Link href="/viewRooms" underline="none" style={styles.link}>
        <button
          style={styles.button}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
            e.currentTarget.style.transform = styles.buttonHover.transform;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = styles.button.backgroundColor;
            e.currentTarget.style.transform = styles.button.transform;
          }}
        >
          Book A Room
        </button>
      </Link>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    width: "100%",
    height: "calc(100vh - 64px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    flexDirection: "column",
  },
  backgroundImage: {
    zIndex: -1,
    width: "100%",
    height: "100%",
    position: "absolute",
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: -1,
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    marginBottom: "2em",
    color: "white",
    padding: "0 20px",
    maxWidth: "800px",
  },
  title: {
    fontSize: window.innerWidth < 768 ? "30px" : "50px",
    margin: "0 0 10px 0",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
  },
  subtitle: {
    fontSize: window.innerWidth < 768 ? "18px" : "24px",
    margin: "10px 0",
    opacity: 0.9,
  },
  mainTitle: {
    fontSize: window.innerWidth < 768 ? "40px" : "60px",
    margin: "10px 0 20px 0",
    fontWeight: "bold",
    color: "#b1cddd",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
  },
  button: {
    cursor: "pointer",
    border: "none",
    backgroundColor: "#593F62",
    color: "white",
    fontSize: window.innerWidth < 768 ? "18px" : "25px",
    padding: "12px 30px",
    borderRadius: "30px",
    fontWeight: "bold",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    transition: "transform 0.2s, background-color 0.2s",
    transform: "translateY(0)",
  },
  buttonHover: {
    backgroundColor: "#4e3b52",
    transform: "translateY(-3px)",
  },
  link: {
    textDecoration: "none",
  },
};