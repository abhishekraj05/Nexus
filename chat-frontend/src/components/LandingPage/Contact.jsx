import React from 'react';
import { IoMailOutline, IoLocationOutline, IoLogoTwitter, IoLogoInstagram, IoLogoLinkedin, IoGlobeOutline, IoLogoFacebook } from 'react-icons/io5';

const Contact = () => {
  return (
    <div className="contact-modern-wrapper">
      
      {/* Ab ye single centered card hoga */}
      <div className="contact-glass-card full-width-card">
        
        <div className="contact-info-center">
            <h2 className="gradient-text" style={{fontSize: '3rem', marginBottom: '10px'}}>Get in Touch</h2>
            <p className="contact-desc" style={{maxWidth: '600px', margin: '0 auto 40px auto'}}>
                We are building the future of social connection. Whether you have a query, 
                feedback, or investment opportunity, we are always open to discuss.
            </p>

            {/* Info Grid - Side by Side Cards */}
            <div className="info-cards-grid">
                
                {/* Email Card */}
                <div className="info-box-item">
                    <div className="icon-box-large"><IoMailOutline /></div>
                    <h3>Email Us</h3>
                    <p>support@nexus.com</p>
                    {/* <p>dev@nexus.com</p> */}
                </div>

                {/* Location Card */}
                <div className="info-box-item">
                    <div className="icon-box-large"><IoLocationOutline /></div>
                    <h3>Visit Us</h3>
                    <p>Jagannath University</p>
                    <p>Jaipur Rajsthan</p>
                </div>

                {/* Website Card */}
                <div className="info-box-item">
                    <div className="icon-box-large"><IoGlobeOutline /></div>
                    <h3>Website</h3>
                    <p>www.nexus.online</p>
                </div>

            </div>

            <div className="divider-line"></div>

            <h3 style={{color: 'white', marginBottom: '20px'}}>Connect on Socials</h3>
            <div className="social-links-center">
                <a href="https://x.com/cod92570" className="s-icon-large"><IoLogoTwitter /></a>
                <a href="https://www.instagram.com/codrexa?utm_source=qr&igsh=MXFsamFrazNhODZpYQ%3D%3D" className="s-icon-large"><IoLogoInstagram /></a>
                <a href="https://www.facebook.com/profile.php?id=61579396951220" className="s-icon-large"><IoLogoFacebook /></a>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;