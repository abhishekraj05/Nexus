// // components/FriendSystem/FindUsers.jsx
// import React, { useState, useEffect } from "react";
// import API from "../../api/api";
// import "./PlaceholderView.css"; 
// // import UserProfileModal from "./UserProfileModal"; 
// import UserProfileModal from "../FriendSystem/UserProfileModal"; 

// const PlaceholderView = () => {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [message, setMessage] = useState("Loading suggestions...");
//   const [selectedProfile, setSelectedProfile] = useState(null); // State for modal

//   // Fetch suggestions on load
//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       setMessage("Loading suggestions..."); // Set loading message
//       try {
//         const token = localStorage.getItem("token");
//         const res = await API.get("/auth/suggestions", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setResults(res.data);
//         setMessage(res.data.length === 0 ? "No users found to suggest." : "");
//       } catch (err) {
//         console.error("Error fetching suggestions:", err);
//         setMessage("Could not load suggestions.");
//       }
//     };
//     fetchSuggestions();
//   }, []); // Empty dependency array means run once on mount

//   // Handle search submission
//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (!query.trim()) { // Check if query is just whitespace
//         setMessage("Please enter a name or email to search.");
//         return;
//     };
//     setMessage("Searching..."); // Set searching message
//     try {
//       const token = localStorage.getItem("token");
//       const res = await API.get(`/auth/search?q=${query}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setResults(res.data);
//       setMessage(res.data.length === 0 ? "No users found for your search." : "");
//     } catch (err) {
//       console.error("Error searching users:", err);
//       setMessage("Error searching users.");
//     }
//   };

//   // Handle sending friend request
//   const handleAddFriend = async (receiverId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await API.post(`/friends/send/${receiverId}`, null, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessage(`Request sent!`);
//       // Update the button state for the specific user
//       setResults((prev) =>
//         prev.map((user) =>
//           user._id === receiverId ? { ...user, requestSent: true } : user
//         )
//       );
//     } catch (err) {
//       console.error("Error sending request:", err);
//       setMessage(err.response?.data?.msg || "Error sending request.");
//     }
//   };

//   // Modal handlers
//   const handleViewProfile = (user) => {
//     setSelectedProfile(user);
//   };
//   const handleCloseModal = () => {
//     setSelectedProfile(null);
//   };

//   // --- Helper Function for Avatar ---
//   const getAvatarUrl = (user) => {
//     const userName = user?.name || 'Unknown'; // Safe fallback for name
//     const defaultAvatarSeed = "DefaultUser";
//     const defaultAvatarUrlPattern = `https://api.dicebear.com/7.x/initials/svg?seed=${defaultAvatarSeed}`;

//     // Check if photoURL exists AND if it's DIFFERENT from the default one
//     const useActualPhoto = user?.photoURL && user.photoURL !== defaultAvatarUrlPattern;

//     return useActualPhoto
//       ? user.photoURL
//       : `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`; // Use name as seed
//   };
//   // ---------------------------------

//   return (
//     <div className="friend-system-container">
//       <h4>Find New Friends</h4>
//       <form onSubmit={handleSearch} className="search-form">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search by name or email..."
//         />
//         <button type="submit">Search</button>
//       </form>

//       {message && <p className="system-message">{message}</p>}

//       <div className="user-list">
//         {results.map((user) => (
//           <div key={user._id} className="user-item">
//             {/* Clickable area */}
//             <div
//               className="user-item-clickable"
//               onClick={() => handleViewProfile(user)}
//             >
//               {/* --- Use the helper function for src --- */}
//               <img
//                 src={getAvatarUrl(user)} // <-- UPDATED HERE
//                 alt={user.name || 'User'} // Safe fallback
//                 className="avatar"
//               />
//               <div className="user-info">
//                 <span className="user-name">{user.name || 'Unknown User'}</span> {/* Safe fallback */}
//                 <span className="user-email">{user.email || 'No Email'}</span> {/* Safe fallback */}
//               </div>
//             </div>

//             {/* "Add Friend" button */}
//             <button
//               onClick={() => handleAddFriend(user._id)}
//               className="add-btn"
//               // Disable if requestSent is true or add any other relevant checks
//               disabled={user.requestSent}
//             >
//               {user.requestSent ? "Sent" : "Add Friend"}
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Modal rendering */}
//       {selectedProfile && (
//         <UserProfileModal user={selectedProfile} onClose={handleCloseModal} />
//       )}
//     </div>
//   );
// };

// export default PlaceholderView;






// components/FriendSystem/FindUsers.jsx
import React, { useState, useEffect } from "react";
import API from "../../api/api";
import "./PlaceholderView.css"; 
import UserProfileModal from "../FriendSystem/UserProfileModal"; 

const PlaceholderView = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("Loading suggestions...");
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setMessage("Loading suggestions...");
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/auth/suggestions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data);
        setMessage(res.data.length === 0 ? "No users found to suggest." : "");
      } catch (err) {
        setMessage("Could not load suggestions.");
      }
    };
    fetchSuggestions();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
        setMessage("Please enter a name or email to search.");
        return;
    };
    setMessage("Searching...");
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/auth/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
      setMessage(res.data.length === 0 ? "No users found for your search." : "");
    } catch (err) {
      setMessage("Error searching users.");
    }
  };

  const handleAddFriend = async (receiverId) => {
    try {
      const token = localStorage.getItem("token");
      await API.post(`/friends/send/${receiverId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(`Request sent!`);
      setResults((prev) =>
        prev.map((user) =>
          user._id === receiverId ? { ...user, requestSent: true } : user
        )
      );
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error sending request.");
    }
  };

  const getAvatarUrl = (user) => {
    const userName = user?.name || 'Unknown';
    if (user?.photoURL && !user.photoURL.includes("DefaultUser")) {
        return user.photoURL;
    }
    return `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`;
  };

  return (
    <div className="friend-system">
      <h4 className="friend-system__title">Find New Friends</h4>
      <form onSubmit={handleSearch} className="friend-system__search">
        <input
          type="text"
          className="friend-system__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email..."
        />
        <button type="submit" className="friend-system__search-btn">Search</button>
      </form>

      {message && <p className="friend-system__message">{message}</p>}

      <div className="friend-system__list">
        {results.map((user) => (
          <div key={user._id} className="friend-system__item">
            <div
              className="friend-system__clickable-area"
              onClick={() => setSelectedProfile(user)}
            >
              <img
                src={getAvatarUrl(user)}
                alt={user.name}
                className="friend-system__avatar"
              />
              <div className="friend-system__info">
                <span className="friend-system__name">{user.name || 'Unknown User'}</span>
                <span className="friend-system__email">{user.email || 'No Email'}</span>
              </div>
            </div>

            <button
              onClick={() => handleAddFriend(user._id)}
              className={`friend-system__add-btn ${user.requestSent ? 'friend-system__add-btn--sent' : ''}`}
              disabled={user.requestSent}
            >
              {user.requestSent ? "Sent" : "Add Friend"}
            </button>
          </div>
        ))}
      </div>

      {selectedProfile && (
        <UserProfileModal user={selectedProfile} onClose={() => setSelectedProfile(null)} />
      )}
    </div>
  );
};

export default PlaceholderView;