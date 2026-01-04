import React from 'react';
import { IoClose, IoDocumentText, IoStar, IoShieldCheckmark } from 'react-icons/io5';
import './DocumentationModal.css';

const DocumentationModal = ({ onClose }) => {
  return (
    <div className="doc-overlay" onClick={onClose}>
      <div className="doc-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="doc-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IoDocumentText size={24} color="#3b82f6" />
            <h3>Nexus Features & Guide</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="doc-body">
          
          <div className="intro-section">
            <h4>Welcome to Nexus 🫧</h4>
            <p>
              Nexus is a next-generation social platform designed to help you connect, share, and vibe with your friends. Here is a detailed guide to all the features available to you.
            </p>
          </div>

          <hr className="doc-divider" />

          {/* 1. HOME FEED */}
          <div className="feature-block">
            <h4>🏠 Dynamic Home Feed</h4>
            <p>Your central hub for updates. The feed shows posts from your friends and people you follow.</p>
            <ul>
              <li><strong>Rich Media:</strong> Upload high-quality Photos and Videos directly from your device.</li>
              <li><strong>Interactive Actions:</strong> Like ❤️, Comment 💬, and Share 🔗 posts instantly.</li>
              <li><strong>Real-time Updates:</strong> See exactly when a post was shared (e.g., "Just now", "5m ago").</li>
            </ul>
          </div>

          {/* 2. STORIES */}
          <div className="feature-block">
            <h4>📸 24-Hour Stories</h4>
            <p>Share fleeting moments that disappear after 24 hours.</p>
            <ul>
              <li>Appears at the top of your feed for easy access.</li>
              <li>Tap to view friends' daily updates in a full-screen immersive view.</li>
              <li>Great for behind-the-scenes or quick life updates.</li>
            </ul>
          </div>

          {/* 3. REELS */}
          <div className="feature-block">
            <h4>🎥 Reels (Short Videos)</h4>
            <p>Dive into entertainment with our dedicated Reels section.</p>
            <ul>
              <li>Discover short, engaging videos from the community.</li>
              <li>Auto-play functionality for a seamless viewing experience.</li>
              <li>Full-screen video player with controls.</li>
            </ul>
          </div>

          {/* 4. CHAT SYSTEM */}
          <div className="feature-block">
            <h4>💬 Real-Time Messaging</h4>
            <p>Stay connected with your friends instantly.</p>
            <ul>
              <li><strong>Live Chat:</strong> Messages are delivered instantly (powered by Socket.io).</li>
              <li><strong>Online Status:</strong> See when your friends are Online 🟢 or when they were Last Seen.</li>
              <li><strong>Secure:</strong> Private conversations between you and your connections.</li>
            </ul>
          </div>

          {/* 5. FRIENDS & CONNECTIONS */}
          <div className="feature-block">
            <h4>👥 Friend System</h4>
            <p>Build your network by connecting with people.</p>
            <ul>
              <li><strong>Send Requests:</strong> Find users and send friend requests easily.</li>
              <li><strong>Accept/Reject:</strong> Manage your incoming requests from the "Requests" tab.</li>
              <li><strong>Followers/Following:</strong> Track your social circle growth.</li>
            </ul>
          </div>

          {/* 6. PROFILE CUSTOMIZATION */}
          <div className="feature-block">
            <h4>👤 Profile & Customization</h4>
            <p>Make your profile truly yours.</p>
            <ul>
              <li><strong>Edit Profile:</strong> Update your Bio, Name, and details.</li>
              <li><strong>Smart Avatar:</strong> Upload a photo or create a custom "Cartoon Avatar" instantly.</li>
              <li><strong>My Posts:</strong> View all your shared content in a beautiful grid layout.</li>
            </ul>
          </div>

          <hr className="doc-divider" />

          {/* 7. TERMS & PRIVACY */}
          <div className="feature-block">
            <h4><IoShieldCheckmark style={{marginBottom: '-2px'}}/> Terms & Privacy</h4>
            <p>
              By using Nexus, you agree to respect our community guidelines. We prioritize your privacy and do not share your personal data with third parties without consent. Harassment or explicit content will lead to account termination.
            </p>
          </div>

          <div className="footer-note">
            <p>© 2025 Nexus Inc. Built with ❤️ for the Community.</p>
          </div>
        </div>

        {/* Footer Button */}
        <div className="doc-footer">
          <button className="accept-btn" onClick={onClose}>Got it!</button>
        </div>

      </div>
    </div>
  );
};

export default DocumentationModal;