import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext'; 
import { IoClose, IoShareSocial, IoLogOut, IoSettingsSharp, IoArrowBack, IoConstruct } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import './MoreOptionsModal.css'; 

const MoreOptionsModal = ({ onClose, onOpenShare }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // 👇 State to toggle between Menu and Settings Message
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
      logout();
      navigate("/login");
      onClose();
  };

  return (
    <div className="more-overlay" onClick={onClose}>
      <div className="more-menu-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="more-header">
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            {/* Agar Settings khuli hai to Back button dikhao */}
            {showSettings && (
                <button className="close-icon-btn" onClick={() => setShowSettings(false)}>
                    <IoArrowBack size={20} />
                </button>
            )}
            <h3>{showSettings ? "Settings" : "Menu"}</h3>
          </div>
          
          <button className="close-icon-btn" onClick={onClose}>
            <IoClose size={22} />
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="menu-list">
            
            {/* CONDITION: Agar Settings True hai to Message dikhao, nahi to Menu dikhao */}
            {showSettings ? (
                <div className="wip-container">
                    <IoConstruct size={50} color="#e91e63" style={{marginBottom: '10px',marginLeft: '40%'}} />
                    <p style={{color: 'white', fontWeight: 'bold',justifyContent: 'center',textAlign: 'center'}}>Coming Soon!</p>
                    <p style={{color: '#888', fontSize: '14px', textAlign: 'center'}}>
                        Now I am working on this feature. <br/> Stay tuned! 
                    </p>
                </div>
            ) : (
                <>
                    {/* Option 1: Share Profile */}
                    <div className="menu-item" onClick={() => { onClose(); onOpenShare(); }}>
                        <div className="icon-circle blue-bg">
                        <IoShareSocial />
                        </div>
                        <span>Share Profile</span>
                    </div>

                    {/* Option 2: Settings (CLICK LOGIC ADDED) */}
                    <div className="menu-item" onClick={() => setShowSettings(true)}>
                        <div className="icon-circle gray-bg">
                        <IoSettingsSharp />
                        </div>
                        <span>Settings</span>
                    </div>

                    <hr className="menu-divider" />

                    {/* Option 3: LOGOUT */}
                    <div className="menu-item logout-item" onClick={handleLogout}>
                        <div className="icon-circle red-bg">
                        <IoLogOut />
                        </div>
                        <span>Log Out</span>
                    </div>
                </>
            )}

        </div>

      </div>
    </div>
  );
};

export default MoreOptionsModal;