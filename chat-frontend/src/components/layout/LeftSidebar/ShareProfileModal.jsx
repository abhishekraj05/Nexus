import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext'; // Path check kar lena
import { IoClose, IoCopy, IoShareSocial } from 'react-icons/io5';
import './ShareProfileModal.css';

const ShareProfileModal = ({ onClose }) => {
  const { user } = useContext(AuthContext);
  const [copied, setCopied] = useState(false);

  // Profile Link Generate
  const profileLink = `${window.location.origin}/profile/${user?._id}`;
  
  // QR Code Generator API (Dark theme ke hisab se colors set kiye hain)
  // bgcolor=1e1e1e (Background Dark) & color=ffffff (Dots White)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${profileLink}&bgcolor=1e1e1e&color=ffffff&margin=10`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="share-overlay" onClick={onClose}>
      <div className="share-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="share-close-btn" onClick={onClose}>
          <IoClose size={24} />
        </button>

        {/* --- ID CARD DESIGN --- */}
        <div className="id-card-content">
          <div className="avatar-glow">
             <img 
               src={user?.photoURL || "https://via.placeholder.com/100"} 
               alt="User" 
               className="share-avatar"
               onError={(e) => {e.target.src = "https://via.placeholder.com/100"}}
             />
          </div>
          
          <h2 className="share-name">{user?.name || "User"}</h2>
          <p className="share-bio">@{user?.name?.toLowerCase().replace(/\s/g, '_') || "username"}</p>

          {/* QR CODE */}
          <div className="qr-box">
            <img src={qrCodeUrl} alt="QR Code" />
          </div>

          <p className="scan-text">Scan to connect</p>
        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="share-actions">
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? "Copied! ✅" : <><IoCopy /> Copy Link</>}
          </button>
          
          {/* Mobile Native Share */}
          <button className="native-share-btn" onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Join me on Codrexa',
                text: `Check out ${user?.name}'s profile!`,
                url: profileLink,
              });
            } else {
              alert("Link copied to clipboard!");
              handleCopy();
            }
          }}>
            <IoShareSocial /> Share
          </button>
        </div>

      </div>
    </div>
  );
};

export default ShareProfileModal;