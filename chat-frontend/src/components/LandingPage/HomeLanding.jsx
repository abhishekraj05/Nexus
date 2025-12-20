import React from 'react';
import { Link } from 'react-router-dom';
import { IoRocketOutline } from 'react-icons/io5';

// 👇 Name updated to HomeLanding
const HomeLanding = () => {
  return (
    <div className="hero-wrapper">
      <h1 className="hero-title">
        The Future of <br />
        <span style={{ color: '#8b5cf6' }}>Social Connection</span>
      </h1>
      
      <p className="hero-subtitle">
        Nexus isn't just an app; it's a digital ecosystem. Share reels, chat instantly, 
        and build your profile in a world designed for the next generation.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <Link to="/register" className="auth-btn btn-signup" style={{ padding: '15px 40px', fontSize: '18px' }}>
            Get Started 
        </Link>
        <Link to="/about" className="auth-btn btn-login" style={{ border: '1px solid #333' }}>
            Explore Features
        </Link>
      </div>

      {/* Floating Abstract UI */}
      <div className="floating-ui">
        <div style={{ textAlign: 'center' }}>
            <IoRocketOutline size={80} color="#8b5cf6" />
            <h3>Welcome to Nexus</h3>
            <p style={{color:'#666'}}>Connecting {Math.floor(Math.random() * 10000)}+ Users</p>
        </div>
      </div>
    </div>
  );
};

export default HomeLanding;