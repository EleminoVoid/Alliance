import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="home-nav">
        <h1>MARSHAL</h1>
        <div className="nav-links">
          <span>Home</span>
          <button onClick={() => navigate("/rooms")}>View Rooms</button>
          <button onClick={() => navigate("/calendar")}>Calendar</button>
          <button onClick={() => navigate("/login")}>Sign In</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <h2>Manage your work and meeting room facility</h2>
          <div className="hero-brand">
            <span>with</span>
            <strong>MARSHAL</strong>
          </div>
          <button 
            className="cta-button"
            onClick={() => navigate("/booking")}
          >
            Book A Room
          </button>
        </div>
      </main>

      {/* Motivational Section */}
      <section className="motivational-section">
        <p>Optimize your workspace. Elevate your productivity.</p>
      </section>
    </div>
  );
};