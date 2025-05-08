import React from 'react';
import './Homepage.css';

export const Homepage: React.FC = () => {
  return (
    <>
      <section className="hero-section">
        <img
          className="hero-image"
          src="https://storage.googleapis.com/a1aa/image/c0ead8a9-64a0-47e9-6ce1-1d79f3345ef8.jpg"
          alt="Modern meeting room with chairs around a long table and two large TV screens on the wall"
        />
        <div className="hero-overlay">
          <h1 className="hero-subtitle">
            <span className="hero-highlight">
              Manage your work and meeting room facility
            </span>
          </h1>
          <p className="hero-with">with</p>
          <h2 className="hero-title">MARSHAL</h2>
          <button className="hero-button">Book A Room</button>
        </div>
      </section>

      <section className="quote-section">
        <p className="quote-text">
          <span>something something here</span>{' '}
          <span>motivational speech</span>
        </p>
      </section>
    </>
  );
};
