// import PendingRequests from "./PendingRequests";
// import FindUsers from "./FindUsers";
// import FriendsList from "./FriendsList";

// export default function FriendSystemView() {
//   return (
//     <div>
//       <h2>Friends</h2>
//       {/* <PendingRequests />
//       <FindUsers />
//       <FriendsList /> */}
//     </div>
//   );
// }





// src/components/FriendSystem/FriendsList.jsx
import React, { useState, useEffect } from "react";
import API from "../../api/api";
import "./FriendSystemView.css"; // Styles for list and modal
import UserProfileModal from "./UserProfileModal"; // Profile popup component

const FriendSystemView = () => {
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState("Loading friends...");
  const [selectedProfile, setSelectedProfile] = useState(null); // State for modal

  // Fetch friends list
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/friends/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(res.data);
        setMessage(res.data.length === 0 ? "You haven't added any friends yet." : "");
      } catch (err) {
        console.error("Error fetching friends:", err);
        setMessage("Could not load friends list.");
      }
    };
    fetchFriends();
  }, []);

  // Remove friend
  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm("Are you sure you want to remove this friend?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/friends/remove/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(prev => prev.filter(friend => friend._id !== friendId));
      setMessage("Friend removed successfully.");
    } catch (err) {
      console.error("Error removing friend:", err);
      setMessage("Failed to remove friend.");
    }
  };

  // Modal handlers
  const handleViewProfile = (friend) => {
    setSelectedProfile(friend);
  };
  const handleCloseModal = () => {
    setSelectedProfile(null);
  };

  // --- Helper Function for Avatar ---
  const getAvatarUrl = (friend) => {
    const userName = friend?.name || 'Unknown'; // Safe fallback for name
    const defaultAvatarSeed = "DefaultUser";
    const defaultAvatarUrlPattern = `https://api.dicebear.com/7.x/initials/svg?seed=${defaultAvatarSeed}`;

    // Check if photoURL exists AND if it's DIFFERENT from the default one
    const useActualPhoto = friend?.photoURL && friend.photoURL !== defaultAvatarUrlPattern;

    return useActualPhoto
      ? friend.photoURL
      : `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`; // Use name as seed
  };
  // ---------------------------------

  return (
    <div className="friend-system-container">
      <h4>Your Friends ({friends.length})</h4>
      {message && <p className="system-message">{message}</p>}
      <div className="user-list">
        {friends.map((friend) => (
          <div key={friend._id} className="user-item">
            {/* Clickable area (profile photo + name) */}
            <div
              className="user-item-clickable"
              onClick={() => handleViewProfile(friend)}
            >
              {/* --- Use the helper function for src --- */}
              <img
                src={getAvatarUrl(friend)} // <-- UPDATED HERE
                alt={friend.name || 'User'} // Safe fallback for alt text
                className="avatar"
              />
              <div className="user-info">
                <span className="user-name">{friend.name || 'Unknown User'}</span> {/* Safe fallback */}
                <span className="user-email">
                  {/* Optional chaining for safety */}
                  {friend?.online ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            {/* Remove button */}
            <button
              onClick={() => handleRemoveFriend(friend._id)}
              className="reject-btn"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      {/* Modal rendering */}
      {selectedProfile && (
        <UserProfileModal
          user={selectedProfile}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default FriendSystemView;