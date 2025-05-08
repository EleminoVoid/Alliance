import React from 'react';
import './Homepage.css';

export const Homepage: React.FC = () => {
  return (
    <main className="homepage-container">
      <section className="welcome-section">
        <h1 className="welcome-title">MARSHAL</h1>
        <p className="welcome-tagline">
          Manage your work and meeting room facility with ease.
        </p>
        <button className="welcome-button">Book A Room</button>
      </section>

      <section className="quote-section">
        <p className="quote-text">
          <span>something something here</span>{' '}
          <span>motivational speech</span>
        </p>
      </section>
    </main>
  );
};
