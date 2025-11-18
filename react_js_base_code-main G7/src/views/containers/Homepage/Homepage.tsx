import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import "./Homepage.css";

export const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleBook = () => {
    // If user is authenticated, go directly to viewRooms; otherwise send to login and include return path
    if (auth?.user) {
      navigate("/viewRooms");
    } else {
      navigate("/login", { state: { from: "/viewRooms" } });
    }
  };

  return (
    <div className="homepage-container">
      <img src="homepage-pic.webp" alt="homepage-pic" className="homepage-backgroundImage" />
      <div className="homepage-overlay"></div>
      <div className="homepage-textContainer">
        <h1 className="homepage-title">Manage your work and meeting room facility</h1>
        <p className="homepage-subtitle">with</p>
        <h1 className="homepage-mainTitle">MARSHAL</h1>
      </div>
      <div className="homepage-link">
        <button
          className="homepage-button"
          onMouseOver={(e) => {
            e.currentTarget.classList.add("homepage-buttonHover");
          }}
          onMouseOut={(e) => {
            e.currentTarget.classList.remove("homepage-buttonHover");
          }}
          onClick={handleBook}
        >
          Book A Room
        </button>
      </div>
    </div>
  );
};