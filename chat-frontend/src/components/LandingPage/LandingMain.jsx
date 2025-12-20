import React from 'react';
import { useNavigate } from 'react-router-dom';
import ModernLanding from './ModernLanding'; 
import About from './About'; 
import { IoRocketOutline, IoPeopleOutline, IoGlobeOutline } from 'react-icons/io5';
import './NexusLanding.css';

const LandingMain = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-main-wrapper">
      
      {/* 1. HERO SECTION */}
      <ModernLanding />

      {/* 2. STATS STRIP */}
      <div className="stats-strip">
        <div className="stat-content">
            <div className="stat-item">
                <IoPeopleOutline size={32} color="#8b5cf6" />
                <div className="stat-text">
                    <h3>10k+</h3>
                    <p>Active Users</p>
                </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
                <IoGlobeOutline size={32} color="#3b82f6" />
                <div className="stat-text">
                    <h3>50+</h3>
                    <p>Countries</p>
                </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
                <IoRocketOutline size={32} color="#ec4899" />
                <div className="stat-text">
                    <h3>1M+</h3>
                    <p>Messages Sent</p>
                </div>
            </div>
        </div>
      </div>

      {/* 3. FEATURES SECTION */}
      <div id="features" style={{marginTop: '80px'}}>
        <About />
      </div>

      {/* --- 👇 NEW: FAQ SECTION START 👇 --- */}
      <div className="faq-section">
        <h2 className="gradient-text" style={{fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center'}}>
            Frequently Asked Questions
        </h2>
        
        <div className="faq-grid">
            {/* Q1 */}
            <div className="faq-card">
                <h3>Is Nexus free to use?</h3>
                <p>Yes! Nexus is completely free for everyone. We believe in open communication without barriers.</p>
            </div>

            {/* Q2 */}
            <div className="faq-card">
                <h3>Is my data secure with Codrexa?</h3>
                <p>Absolutely. We use end-to-end encryption to ensure your messages and personal data stay private.</p>
            </div>

            {/* Q3 */}
            <div className="faq-card">
                <h3>Can I use it on Mobile?</h3>
                <p>Yes, Nexus is fully responsive and works perfectly on mobile, tablet, and desktop devices.</p>
            </div>

            {/* Q4 */}
            <div className="faq-card">
                <h3>How do I contact support?</h3>
                <p>You can reach out to us at <strong>infocodrexa@gmail.com</strong> for any help or feedback.</p>
            </div>
        </div>
      </div>
      {/* --- 👆 FAQ SECTION END 👆 --- */}

      {/* 4. BIG BOTTOM CTA */}
      <div className="bottom-cta-section">
        <div className="cta-box">
            <h2>Ready to join the <span className="gradient-text">Revolution?</span></h2>
            <p>Create your account today and experience the future of connection.</p>
            
            <button onClick={() => navigate('/register')} className="cta-btn-large">
                Create Free Account
            </button>
        </div>
      </div>

    </div>
  );
};

export default LandingMain;