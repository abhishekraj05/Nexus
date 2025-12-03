// // src/components/FriendSystem/FriendsList.jsx
// import React, { useState, useEffect } from "react";
// import API from "../../api/api";
// import "./FriendSystem.css"; // Iske styles aur Modal ke styles isme hain
// import UserProfileModal from "./UserProfileModal"; // Profile popup component

// const FriendsList = () => {
//   const [friends, setFriends] = useState([]);
//   const [message, setMessage] = useState("Loading friends...");
  
//   // State yeh track karega ki kiska profile kholna hai
//   const [selectedProfile, setSelectedProfile] = useState(null);

//   // 1. Doston ki list fetch karna
//   useEffect(() => {
//     const fetchFriends = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         // '/friends/list' (Aapka API instance '/api' ko handle kar lega)
//         const res = await API.get("/friends/list", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
        
//         setFriends(res.data);
//         if (res.data.length === 0) {
//           setMessage("You haven't added any friends yet.");
//         } else {
//           setMessage("");
//         }
//       } catch (err) {
//         console.error("Error fetching friends:", err);
//         setMessage("Could not load friends list.");
//       }
//     };

//     fetchFriends();
//   }, []);

//   // 2. Dost ko remove karna
//   const handleRemoveFriend = async (friendId) => {
//     if (!window.confirm("Are you sure you want to remove this friend?")) {
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       // '/friends/remove/...' (Aapka API instance '/api' ko handle kar lega)
//       await API.delete(`/friends/remove/${friendId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Frontend list se turant hata dena
//       setFriends(prev => prev.filter(friend => friend._id !== friendId));
//       setMessage("Friend removed successfully.");

//     } catch (err) {
//       console.error("Error removing friend:", err);
//       setMessage("Failed to remove friend.");
//     }
//   };
  
//   // 3. Profile dekhne ke liye state set karna
//   const handleViewProfile = (friend) => {
//     setSelectedProfile(friend);
//   };

//   // 4. Modal band karne ke liye
//   const handleCloseModal = () => {
//     setSelectedProfile(null);
//   };

//   return (
//     <div className="friend-system-container">
//       <h4>Your Friends ({friends.length})</h4>
      
//       {message && <p className="system-message">{message}</p>}

//       <div className="user-list">
//         {friends.map((friend) => (
//           <div key={friend._id} className="user-item">
            
//             {/* Clickable area (profile photo + name) */}
//             <div 
//               className="user-item-clickable" 
//               onClick={() => handleViewProfile(friend)}
//             >
//               <img 
//                 src={friend.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${friend.name}`} 
//                 alt={friend.name} 
//                 className="avatar"
//               />
//               <div className="user-info">
//                 <span className="user-name">{friend.name}</span>
//                 <span className="user-email">
//                   {friend.online ? "Online" : "Offline"}
//                 </span>
//               </div>
//             </div>
            
//             {/* Remove button (alag se) */}
//             <button 
//               onClick={() => handleRemoveFriend(friend._id)} 
//               className="reject-btn" // Laal (remove) button
//             >
//               Remove
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Jab 'selectedProfile' set hoga, tab yeh Modal dikhega */}
//       {selectedProfile && (
//         <UserProfileModal 
//           user={selectedProfile} 
//           onClose={handleCloseModal} 
//         />
//       )}
//     </div>
//   );
// };

// export default FriendsList;







// src/components/FriendSystem/FriendsList.jsx
import React, { useState, useEffect } from "react";
import API from "../../api/api";
import "./FriendSystem.css"; // Styles for list and modal
import UserProfileModal from "./UserProfileModal"; // Profile popup component

const FriendsList = () => {
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

export default FriendsList;