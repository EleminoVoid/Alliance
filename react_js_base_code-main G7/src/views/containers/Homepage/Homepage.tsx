import React from "react";
import { Link } from "@mui/material";
import "./Homepage.css";

export const Homepage: React.FC = () => {
  return (
    <div className="homepage-container">
      <img src="homepage-pic.webp" alt="homepage-pic" className="homepage-backgroundImage" />
      <div className="homepage-overlay"></div>
      <div className="homepage-textContainer">
        <h1 className="homepage-title">Manage your work and meeting room facility</h1>
        <p className="homepage-subtitle">with</p>
        <h1 className="homepage-mainTitle">MARSHAL</h1>
      </div>
      <Link href="/viewRooms" underline="none" className="homepage-link">
        <button
          className="homepage-button"
          onMouseOver={(e) => {
            e.currentTarget.classList.add("homepage-buttonHover");
          }}
          onMouseOut={(e) => {
            e.currentTarget.classList.remove("homepage-buttonHover");
          }}
        >
          Book A Room
        </button>
      </Link>
    </div>
  );
};