"use client"

import type React from "react"
import { Link } from "@mui/material"
import "./Homepage.css"

export const Homepage: React.FC = () => {
  return (
    <div className="home-container">
      <img
        src="homepage-pic.webp"
        alt="homepage-pic"
        className="home-background-image"
      />
      <div className="home-overlay"></div>
      <div className="home-content">
        <h1 className="home-title">
          Manage your work and meeting room facility
        </h1>
        <p className="home-subtitle">with</p>
        <h1 className="home-highlight">MARSHAL</h1>
      </div>
      <Link href="/viewRooms" underline="none" style={{ textDecoration: "none" }}>
        <button className="home-button">Book A Room</button>
      </Link>
    </div>
  )
}