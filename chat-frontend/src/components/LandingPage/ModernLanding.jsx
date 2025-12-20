import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowForward } from 'react-icons/io5';
import { IoCamera ,IoChatbubbles,IoVideocam} from 'react-icons/io5';
import './NexusLanding.css';

const ModernLanding = () => {
  const navigate = useNavigate();

  return (
    <header className="hero-container">
        
        {/* Background Glow */}
        <div className="glow-orb top-left"></div>
        <div className="glow-orb bottom-right"></div>

        <div className="hero-content">
            <h1 className="hero-title fade-in-up">
                Connect Beyond <br />
                <span className="gradient-text">Limits.</span>
            </h1>
            
            <p className="hero-subtitle fade-in-up delay-1">
                Experience the next generation of social interaction. 
                Share stories, watch reels, and chat instantly in a dark-themed ecosystem.
            </p>

            <div className="hero-buttons fade-in-up delay-2">
                <button onClick={() => navigate('/register')} className="cta-button">
                    Get Started <IoArrowForward />
                </button>
            </div>
        </div>

        {/* Abstract Floating Visual */}
        <div className="hero-visual fade-in-up delay-3">
            <div className="floating-card card-1"><IoCamera size={20} color="#ec4899" /> Share</div>
            <div className="floating-card card-2"><IoChatbubbles size={20} color="#3b82f6" /> Chat</div>
            <div className="floating-card card-3"><IoVideocam size={20} color="#8b5cf6" /> Reels</div>
        </div>

    </header>
  );
};

export default ModernLanding;