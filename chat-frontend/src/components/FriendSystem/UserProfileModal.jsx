// // components/FriendSystem/UserProfileModal.jsx
// import React from "react";
// import "./UserProfileModal.css";

// const UserProfileModal = ({ user, onClose }) => {
//   // Add console log to see exactly what data the modal receives
//   console.log("User received by modal:", user);

//   // --- SAFE FALLBACKS ---
//   const userName = user?.name || 'Unknown User';
//   const userEmail = user?.email || 'No email';
//   const userBio = user?.bio || "No bio available.";
//   const username = user?.username || "No username available.";

//   // --- UPDATED AVATAR LOGIC ---
//   const defaultAvatarSeed = "DefaultUser"; // Define the default seed
//   const defaultAvatarUrlPattern = `https://api.dicebear.com/7.x/initials/svg?seed=${defaultAvatarSeed}`;

//   // Check if photoURL exists AND if it's DIFFERENT from the default one
//   const useActualPhoto = user?.photoURL && user.photoURL !== defaultAvatarUrlPattern;

//   // If useActualPhoto is true, use it. Otherwise, generate based on userName.
//   const avatarUrl = useActualPhoto
//     ? user.photoURL
//     : `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`;
//   // -----------------------------

//   return (
//     <div className="modal-backdrop" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <button className="modal-close-btn" onClick={onClose}>
//           &times;
//         </button>

//         <img
//           src={avatarUrl} // Use the updated calculated URL
//           alt={userName}
//           className="modal-avatar"
//           referrerpolicy="no-referrer"
//         />
//         <h3 className="modal-name">{userName}</h3>
//         <p className="modal-username">{username}</p>
//         <p className="modal-email">{userEmail}</p>
//         <p className="modal-bio">{userBio}</p>

//       </div>
//     </div>
//   );
// };

// export default UserProfileModal;



// components/FriendSystem/UserProfileModal.jsx
import React, { useEffect } from "react";
import "./UserProfileModal.css";

const UserProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  const userName = user?.name || 'Unknown User';
  const userEmail = user?.email || 'No email';
  const userBio = user?.bio || "No bio available.";
  const username = user?.username || "No username";

  // Avatar Logic
  const defaultAvatarSeed = "DefaultUser";
  const defaultAvatarUrlPattern = `https://api.dicebear.com/7.x/initials/svg?seed=${defaultAvatarSeed}`;
  const useActualPhoto = user?.photoURL && user.photoURL !== defaultAvatarUrlPattern;
  const avatarUrl = useActualPhoto
    ? user.photoURL
    : `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`;

  // Close on Escape
  useEffect(() => {
    const handleEsc = (event) => {
       if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose}>&times;</button>

        {/* 1. HEADER: Sirf Photo aur Name */}
        <div className="modal-header">
            {/* Wrapper hata diya, direct Image */}
            <img
                src={avatarUrl}
                alt={userName}
                className="modal-avatar"
                referrerPolicy="no-referrer"
            />
            <h3 className="modal-name">{userName}</h3>
        </div>

        {/* 2. BODY: Bio -> Username -> Email */}
        <div className="modal-body">
            
            {/* Bio Section */}
            <div className="info-item bio-section">
                <span className="info-label">About</span>
                <p className="modal-bio">{userBio}</p>
            </div>
            
            {/* Contact Section (Username + Email) */}
            <div className="info-item contact-section">
                <span className="info-label">User Details</span>
                
                {/* Username yahan aa gaya */}
                <div className="detail-row">
                    <span className="detail-icon">@</span>
                    <p className="modal-text">{username}</p>
                </div>

                {/* Email uske niche */}
                <div className="detail-row">
                    <span className="detail-icon">✉</span>
                    <p className="modal-text">{userEmail}</p>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default UserProfileModal;