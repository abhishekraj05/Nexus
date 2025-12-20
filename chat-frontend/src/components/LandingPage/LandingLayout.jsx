import React, { useState, useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { IoLogoIonic, IoApps, IoLogOutOutline, IoMenu, IoClose } from 'react-icons/io5';
import { AuthContext } from '../../context/AuthContext';
import logoImg from "../../assets/logo.png";
import './NexusLanding.css';

const LandingLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  
  // 👇 State for Mobile Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle Function
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close Menu when link is clicked
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="landing-wrapper">
      
      {/* --- NAVBAR --- */}
      <nav className="glass-nav">
        
        {/* 1. LOGO */}
        <div className="logo-container" onClick={() => navigate('/')}>
            {/* <IoLogoIonic className="logo-icon" /> */}
            <img src={logoImg} alt="Nexus Logo" className="logo-image" />
            <span className="logo-text">Nexus</span>
        </div>
        
        {/* 2. DESKTOP LINKS (Hidden on Mobile) */}
        <div className="nav-links-center desktop-only">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">Features</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
        </div>

        {/* 3. DESKTOP ACTIONS (Hidden on Mobile) */}
        <div className="nav-actions desktop-only">
            {user ? (
                <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                    <button onClick={() => navigate('/')} className="nav-signup-btn glow-btn">
                        <IoApps size={18}/> Open App
                    </button>
                    <button onClick={logout} className="nav-icon-btn">
                        <IoLogOutOutline size={24} color="#ef4444" />
                    </button>
                </div>
            ) : (
                <>
                    <Link to="/login" className="nav-login-btn">Login</Link>
                    <button onClick={() => navigate('/register')} className="nav-signup-btn">
                        Sign Up
                    </button>
                </>
            )}
        </div>

        {/* 4. MOBILE MENU TOGGLE (Visible only on Mobile) */}
        <div className="mobile-menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <IoClose size={30} /> : <IoMenu size={30} />}
        </div>

      </nav>

      {/* --- 5. MOBILE MENU DROPDOWN --- */}
      <div className={`mobile-menu-dropdown ${isMenuOpen ? 'active' : ''}`}>
        
        <Link to="/" className="mobile-link" onClick={closeMenu}>Home</Link>
        <Link to="/about" className="mobile-link" onClick={closeMenu}>Features</Link>
        <Link to="/contact" className="mobile-link" onClick={closeMenu}>Contact</Link>
        
        <div className="mobile-divider"></div>

        {user ? (
            <>
                <button onClick={() => { navigate('/'); closeMenu(); }} className="mobile-btn glow">
                    Open App <IoApps />
                </button>
                <button onClick={() => { logout(); closeMenu(); }} className="mobile-btn logout">
                    Logout
                </button>
            </>
        ) : (
            <>
                <Link to="/login" className="mobile-link" onClick={closeMenu}>Login</Link>
                <button onClick={() => { navigate('/register'); closeMenu(); }} className="mobile-btn">
                    Sign Up
                </button>
            </>
        )}
      </div>

      {/* PAGE CONTENT */}
      <div className="page-content">
        <Outlet /> 
      </div>

      <footer className="landing-footer">
        <div className="footer-content">
            <p>&copy; 2025 Nexus Inc.</p>
            <p>A Product of Codrexa</p>
            <div className="footer-links">
                <Link to="/contact">Support</Link>
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
            </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingLayout;