import React from 'react';
import { IoPhonePortraitOutline, IoChatbubblesOutline, IoPersonOutline, IoRocketOutline } from 'react-icons/io5';

const About = () => {
  return (
    <div className="about-wrapper">
      <div className="about-header">
        <h2 className="section-title">Why Choose <span className="gradient-text">Nexus?</span></h2>
        <p className="section-subtitle">Redefining social interaction with speed and style.</p>
      </div>

      <div className="features-grid">
        
        <div className="feature-card glass-hover">
          <div className="f-icon-box"><IoPhonePortraitOutline /></div>
          <h3>Immersive Reels</h3>
          <p>
            Scroll through endless entertainment with our high-performance video engine. 
            Full-screen experience optimized for mobile.
          </p>
        </div>

        <div className="feature-card glass-hover">
          <div className="f-icon-box"><IoChatbubblesOutline /></div>
          <h3>Instant Sync Chat</h3>
          <p>
            Powered by Socket.io, our chat system delivers messages in milliseconds. 
            No delays, just pure connection.
          </p>
        </div>

        <div className="feature-card glass-hover">
          <div className="f-icon-box"><IoPersonOutline /></div>
          <h3>Digital Identity</h3>
          <p>
            Customize your avatar, bio, and privacy settings. 
            Your Nexus profile is your digital home.
          </p>
        </div>

         <div className="feature-card glass-hover">
          <div className="f-icon-box"><IoRocketOutline /></div>
          <h3>Lightning Fast</h3>
          <p>
            Built on the latest tech stack ensuring zero lag and 
            smooth transitions across the app.
          </p>
        </div>

      </div>
    </div>
  );
};

export default About;