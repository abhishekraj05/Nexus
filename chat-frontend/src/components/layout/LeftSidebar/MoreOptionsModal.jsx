// import React, { useContext, useState } from 'react';
// import { AuthContext } from '../../../context/AuthContext'; 
// import { IoClose, IoShareSocial, IoLogOut, IoSettingsSharp, IoArrowBack, IoConstruct } from 'react-icons/io5';
// import { useNavigate } from 'react-router-dom';
// import './MoreOptionsModal.css'; 

// const MoreOptionsModal = ({ onClose, onOpenShare }) => {
//   const { logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // 👇 State to toggle between Menu and Settings Message
//   const [showSettings, setShowSettings] = useState(false);

//   const handleLogout = () => {
//       logout();
//       navigate("/login");
//       onClose();
//   };

//   return (
//     <div className="more-overlay" onClick={onClose}>
//       <div className="more-menu-card" onClick={(e) => e.stopPropagation()}>
        
//         {/* Header */}
//         <div className="more-header">
//           <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
//             {/* Agar Settings khuli hai to Back button dikhao */}
//             {showSettings && (
//                 <button className="close-icon-btn" onClick={() => setShowSettings(false)}>
//                     <IoArrowBack size={20} />
//                 </button>
//             )}
//             <h3>{showSettings ? "Settings" : "Menu"}</h3>
//           </div>
          
//           <button className="close-icon-btn" onClick={onClose}>
//             <IoClose size={22} />
//           </button>
//         </div>

//         {/* CONTENT AREA */}
//         <div className="menu-list">
            
//             {/* CONDITION: Agar Settings True hai to Message dikhao, nahi to Menu dikhao */}
//             {showSettings ? (
//                 <div className="wip-container">
//                     <IoConstruct size={50} color="#e91e63" style={{marginBottom: '10px',marginLeft: '40%'}} />
//                     <p style={{color: 'white', fontWeight: 'bold',justifyContent: 'center',textAlign: 'center'}}>Coming Soon!</p>
//                     <p style={{color: '#888', fontSize: '14px', textAlign: 'center'}}>
//                         Now I am working on this feature. <br/> Stay tuned! 
//                     </p>
//                 </div>
//             ) : (
//                 <>
//                     {/* Option 1: Share Profile */}
//                     <div className="menu-item" onClick={() => { onClose(); onOpenShare(); }}>
//                         <div className="icon-circle blue-bg">
//                         <IoShareSocial />
//                         </div>
//                         <span>Share Profile</span>
//                     </div>

//                     {/* Option 2: Settings (CLICK LOGIC ADDED) */}
//                     <div className="menu-item" onClick={() => setShowSettings(true)}>
//                         <div className="icon-circle gray-bg">
//                         <IoSettingsSharp />
//                         </div>
//                         <span>Settings</span>
//                     </div>

//                     <hr className="menu-divider" />

//                     {/* Option 3: LOGOUT */}
//                     <div className="menu-item logout-item" onClick={handleLogout}>
//                         <div className="icon-circle red-bg">
//                         <IoLogOut />
//                         </div>
//                         <span>Log Out</span>
//                     </div>
//                 </>
//             )}

//         </div>

//       </div>
//     </div>
//   );
// };

// export default MoreOptionsModal;




// import React, { useContext, useState } from 'react';
// import { AuthContext } from '../../../context/AuthContext'; 
// // 👇 1. Import EditProfileModal
// import EditProfileModal from "../../Profile/EditProfileModal"; 
// import { IoClose, IoShareSocial, IoLogOut, IoSettingsSharp, IoArrowBack, IoConstruct } from 'react-icons/io5';
// import { useNavigate } from 'react-router-dom';
// import './MoreOptionsModal.css'; 

// const MoreOptionsModal = ({ onClose, onOpenShare }) => {
//   const { logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // 👇 State to toggle between Menu and Settings Message
//   const [showSettings, setShowSettings] = useState(false);
  
//   // 👇 2. Modal Open State
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleLogout = () => {
//       logout();
//       navigate("/login");
//       onClose();
//   };

//   return (
//     <div className="more-overlay" onClick={onClose}>
//       <div className="more-menu-card" onClick={(e) => e.stopPropagation()}>
        
//         {/* Header */}
//         <div className="more-header">
//           <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
//             {showSettings && (
//                 <button className="close-icon-btn" onClick={() => setShowSettings(false)}>
//                     <IoArrowBack size={20} />
//                 </button>
//             )}
//             <h3>{showSettings ? "Settings" : "Menu"}</h3>
//           </div>
          
//           <button className="close-icon-btn" onClick={onClose}>
//             <IoClose size={22} />
//           </button>
//         </div>

//         {/* CONTENT AREA */}
//         <div className="menu-list">
            
//             {showSettings ? (
//                 /* --- SETTINGS VIEW --- */
//                 <div className="wip-container">
//                     {/* 👇 3. Edit Profile Button */}
//                     <button 
//                         className="action-btn primary" 
//                         style={{marginBottom: '20px', width: '100%', padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}} 
//                         onClick={() => setIsModalOpen(true)}
//                     > 
//                         Edit Profile 
//                     </button>

//                     <IoConstruct size={50} color="#e91e63" style={{marginBottom: '10px', marginLeft: 'auto', marginRight: 'auto', display: 'block'}} />
//                     <p style={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>Coming Soon!</p>
//                     <p style={{color: '#888', fontSize: '14px', textAlign: 'center'}}>
//                         Now I am working on this feature. <br/> Stay tuned! 
//                     </p>
//                 </div>
//             ) : (
//                 /* --- MENU VIEW --- */
//                 <>
//                     <div className="menu-item" onClick={() => { onClose(); onOpenShare(); }}>
//                         <div className="icon-circle blue-bg">
//                         <IoShareSocial />
//                         </div>
//                         <span>Share Profile</span>
//                     </div>

//                     <div className="menu-item" onClick={() => setShowSettings(true)}>
//                         <div className="icon-circle gray-bg">
//                         <IoSettingsSharp />
//                         </div>
//                         <span>Settings</span>
//                     </div>

//                     <hr className="menu-divider" />

//                     <div className="menu-item logout-item" onClick={handleLogout}>
//                         <div className="icon-circle red-bg">
//                         <IoLogOut />
//                         </div>
//                         <span>Log Out</span>
//                     </div>
//                 </>
//             )}
//         </div>

//         {/* 👇 4. FIX: Modal ko Condition se BAHAR yahan rakha hai */}
//         {/* Ab ye hamesha render ho sakta hai chahe Settings khuli ho ya Menu */}
//         {isModalOpen && (
//             <EditProfileModal 
//                 onClose={() => setIsModalOpen(false)} 
//             />
//         )}

//       </div>
//     </div>
//   );
// };

// export default MoreOptionsModal;






import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext'; 
import EditProfileModal from "../../Profile/EditProfileModal"; 
// 👇 1. Import New Documentation Modal
import DocumentationModal from "../../Profile/DocumentationModal"; 

import { IoClose, IoShareSocial, IoLogOut, IoSettingsSharp, IoArrowBack, IoConstruct, IoDocumentTextOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import './MoreOptionsModal.css'; 

const MoreOptionsModal = ({ onClose, onOpenShare }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showSettings, setShowSettings] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 👇 2. State for Docs Modal
  const [showDocs, setShowDocs] = useState(false);

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
            
            {showSettings ? (
                /* --- SETTINGS VIEW --- */
                <div className="wip-container">
                    
                    {/* Edit Profile Button */}
                    <button 
                        className="action-btn primary" 
                        style={{marginBottom: '10px', width: '100%', padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}} 
                        onClick={() => setIsModalOpen(true)}
                    > 
                        Edit Profile 
                    </button>

                    {/* 👇 3. NEW BUTTON FOR DOCUMENTATION */}
                    <button 
                        className="action-btn" 
                        style={{
                            marginBottom: '20px', 
                            width: '100%', 
                            padding: '10px', 
                            background: '#27272a', 
                            color: 'white', 
                            border: '1px solid #3f3f46', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }} 
                        onClick={() => setShowDocs(true)}
                    > 
                        <IoDocumentTextOutline size={18} />
                        Terms & Documentation 
                    </button>

                    {/* Coming Soon Area */}
                    <IoConstruct size={40} color="#e91e63" style={{marginBottom: '10px', marginLeft: 'auto', marginRight: 'auto', display: 'block', opacity: 0.5}} />
                    <p style={{color: '#888', fontSize: '13px', textAlign: 'center'}}>
                        More settings coming soon...
                    </p>
                </div>
            ) : (
                /* --- MENU VIEW --- */
                <>
                    <div className="menu-item" onClick={() => { onClose(); onOpenShare(); }}>
                        <div className="icon-circle blue-bg"><IoShareSocial /></div>
                        <span>Share Profile</span>
                    </div>

                    <div className="menu-item" onClick={() => setShowSettings(true)}>
                        <div className="icon-circle gray-bg"><IoSettingsSharp /></div>
                        <span>Settings</span>
                    </div>

                    <hr className="menu-divider" />

                    <div className="menu-item logout-item" onClick={handleLogout}>
                        <div className="icon-circle red-bg"><IoLogOut /></div>
                        <span>Log Out</span>
                    </div>
                </>
            )}
        </div>

        {/* --- MODALS (Outside Loops) --- */}
        
        {isModalOpen && <EditProfileModal onClose={() => setIsModalOpen(false)} />}
        
        {/* 👇 4. Render Documentation Modal */}
        {showDocs && <DocumentationModal onClose={() => setShowDocs(false)} />}

      </div>
    </div>
  );
};

export default MoreOptionsModal;