// components/FriendSystem/UserProfileModal.jsx
import React from "react";
import "./FriendSystem.css";

const UserProfileModal = ({ user, onClose }) => {
  // Add console log to see exactly what data the modal receives
  console.log("User received by modal:", user);

  // --- SAFE FALLBACKS ---
  const userName = user?.name || 'Unknown User';
  const userEmail = user?.email || 'No email';
  const userBio = user?.bio || "No bio available.";

  // --- UPDATED AVATAR LOGIC ---
  const defaultAvatarSeed = "DefaultUser"; // Define the default seed
  const defaultAvatarUrlPattern = `https://api.dicebear.com/7.x/initials/svg?seed=${defaultAvatarSeed}`;

  // Check if photoURL exists AND if it's DIFFERENT from the default one
  const useActualPhoto = user?.photoURL && user.photoURL !== defaultAvatarUrlPattern;

  // If useActualPhoto is true, use it. Otherwise, generate based on userName.
  const avatarUrl = useActualPhoto
    ? user.photoURL
    : `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`;
  // -----------------------------

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <img
          src={avatarUrl} // Use the updated calculated URL
          alt={userName}
          className="modal-avatar"
          referrerpolicy="no-referrer"
        />
        <h3 className="modal-name">{userName}</h3>
        <p className="modal-email">{userEmail}</p>
        <p className="modal-bio">{userBio}</p>

      </div>
    </div>
  );
};

export default UserProfileModal;