import React from 'react';
import { Link } from '@mui/material';
import './Homepage.css';

export const Homepage: React.FC = () => {
  return (
    <div className="homepage-container">
      <img src="homepage-pic.webp" alt="homepage-pic" className="homepage-background" />
      <div className="homepage-overlay"></div>
      <div className="homepage-text">
        <h1 className="main-heading">Manage your work and meeting room facility</h1>
        <p>with</p>
        <h1 className="brand-name">MARSHAL</h1>
      </div>
      <Link href="/login" underline="none">
        <button className="book-button">Book A Room</button>
      </Link>
    </div>
  );
};
