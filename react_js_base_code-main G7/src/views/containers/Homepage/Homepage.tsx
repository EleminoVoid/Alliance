import React from 'react';
import { Link } from '@mui/material';

export const Homepage = () => {
  return (
    <div style={{ position: 'relative', width: "100%", height: '70vh', display: "flex", justifyContent: "center", alignItems: "center", boxSizing: "border-box", flexDirection: 'column' }}>
        <img src="homepage-pic.webp" alt="homepage-pic" style={{ zIndex: '-1', width: '100%', height: '100%', position: 'absolute' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '-1' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: "center", marginBottom: "2em", color: 'white' }}>
          <h1 style={{ fontSize: '50px' }}>Manage your work and meeting room facility</h1>
          <p>with</p>
          <h1>MARSHAL</h1>
        </div>
        <Link href='/login'>
          <button style={{ cursor: 'pointer', border: 'none', backgroundColor: '#593F62', color: 'white', fontSize: '25px', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold' }}>Book A Room</button>
        </Link>
    </div>
  )
}