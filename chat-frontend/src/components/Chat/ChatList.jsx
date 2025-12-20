// // src/components/Chat/ChatList.jsx
// import React, { useEffect, useState } from "react";
// import API from "../../api/api";
// import "./ChatList.css"; 
// import CryptoJS from "crypto-js"; // <-- 1. Crypto-js ko import karein

// const ChatList = ({ onSelectChat, selectedChat }) => {
//   const [chats, setChats] = useState([]);

//   // --- 2. DECRYPTION KEY AUR FUNCTION ADD KAREIN ---
//   // 
//   // !!! IMPORTANT !!!
//   // Yahaan wahi key daalein jo aapne 'ChatBox.jsx' mein daali thi
//   // (Jo aapke backend ke .env file mein 'CHAT_KEY' hai)
//   const SECRET_KEY = "1234567890123456789347983474985834"; 

//   const decryptMessage = (text) => {
//     // Yeh function plain text ("Hello") aur encrypted text ("U2Fsd...")
//     // dono ko handle karega.
//     if (!text) return "";
    
//     // Check karein ki text encrypted lag raha hai ya nahi
//     if (text.startsWith("U2FsdGVkX1")) {
//       try {
//         const bytes = CryptoJS.AES.decrypt(text, SECRET_KEY);
//         const originalText = bytes.toString(CryptoJS.enc.Utf8);
        
//         if (originalText.length > 0) {
//           return originalText;
//         } else {
//           return "[Encrypted]"; // Agar key galat hai
//         }
//       } catch (e) {
//         return "[Decrypt Error]"; // Agar data corrupt hai
//       }
//     }
    
//     // Agar text plain hai (jaise "Hello"), toh use waisa hi return kar do
//     return text;
//   };
//   // ----------------------------------------------------

//   // User ID nikaalna
//   let currentUserId = null;
//   try {
//     const userString = localStorage.getItem("user");
//     if (userString) {
//       currentUserId = JSON.parse(userString)?._id;
//     }
//   } catch (e) {
//     console.error("Failed to parse user from localStorage", e);
//   }

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.error("No token found, user not logged in");
//           return;
//         }

//         const res = await API.get("/chat", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setChats(res.data);
//       } catch (error) {
//         console.error(
//           "Error fetching chats:",
//           error.response?.data?.msg || error.message
//         );
//       }
//     };
//     fetchChats();
//   }, []);

//   return (
//     <div className="chat-list">
//       <div className="search-container">
//         <input type="text" placeholder="Search or start new chat" />
//       </div>

//       <div className="chat-items-container">
//         {chats.length === 0 ? (
//           <p className="no-chats">No chats yet</p>
//         ) : (
//           chats.map((chat) => {
//             const isGroup = chat.type === "group";
//             const chatName = isGroup
//               ? chat.name
//               : chat.members.find((m) => m._id !== currentUserId)?.name ||
//                 "Unknown User";

//             const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${chatName}`;
            
//             // --- 3. LAST MESSAGE KO DECRYPT KAREIN ---
//             const lastMessage = chat.lastMessage?.text
//               ? decryptMessage(chat.lastMessage.text) // <-- Yahaan function apply kiya
//               : "No messages yet...";
            
//             const timestamp = chat.lastMessage?.timestamp || ""; 

//             return (
//               <div
//                 key={chat._id}
//                 onClick={() => onSelectChat(chat)}
//                 className={`chat-item ${
//                   selectedChat?._id === chat._id ? "selected" : ""
//                 }`}
//               >
//                 <img src={avatarUrl} alt="avatar" className="avatar" />
                
//                 <div className="chat-info">
//                   <span className="chat-name">{chatName}</span>
//                   {/* Decrypted message yahaan dikhega */}
//                   <span className="last-message">{lastMessage}</span>
//                 </div>

//                 <div className="chat-meta">
//                   <span className="timestamp">
//                     {timestamp ? new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : ""}
//                   </span>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatList;





// src/components/Chat/ChatList.jsx
import React, { useEffect, useState, useRef } from "react";
import API from "../../api/api";
import "./ChatList.css";
import CryptoJS from "crypto-js";
// Note: UserProfileModal import is needed if you want to keep the avatar click feature.

// --- Accept the new onArchiveSuccess prop ---
const ChatList = ({ onSelectChat, selectedChat, onlineStatuses, onArchiveSuccess }) => {
    const [chats, setChats] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [menuVisibleFor, setMenuVisibleFor] = useState(null); // Tracks which chat's menu is open

    // --- Decryption Key aur Function ---
    const SECRET_KEY = "1234567890123456789347983474985834"; // !! Use your actual key !!
    const decryptMessage = (text) => {
        if (!text) return "";
        if (!text.startsWith("U2FsdGVkX1")) return text;
        try {
            const bytes = CryptoJS.AES.decrypt(text, SECRET_KEY);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            return originalText.length > 0 ? originalText : "[Encrypted]";
        } catch (e) {
            console.error("Decryption failed in ChatList:", e);
            return "[Decrypt Error]";
        }
    };
    // ----------------------------------------------------

    // User ID nikaalna
    let currentUserId = null;
    try {
        const userString = localStorage.getItem("user");
        if (userString) {
            currentUserId = JSON.parse(userString)?._id;
        }
    } catch (e) { console.error("Failed to parse user from localStorage", e); }

    // Fetch chats
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                // Backend should filter out archived chats
                const res = await API.get("/chat", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setChats(res.data);
            } catch (error) { console.error("Error fetching chats:", error.response?.data?.msg || error.message); }
        };
        fetchChats();
        // Use a dependency that changes when the list needs refresh (e.g., passed key from Sidebar)
    }, [selectedChat]); // Or use the key prop if passed from Sidebar

    // Search Handler
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // --- Handle Delete Chat ---
    const handleDeleteChat = async (e, chatId) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem("token");
            await API.delete(`/chat/${chatId}`, { headers: { Authorization: `Bearer ${token}` } });
            setChats(prevChats => prevChats.filter(chat => chat._id !== chatId));
            setMenuVisibleFor(null);
            if (selectedChat?._id === chatId) {
                onSelectChat(null);
            }
        } catch (error) {
            console.error("Error deleting chat:", error.response?.data?.msg || error.message);
            alert("Failed to delete chat: " + (error.response?.data?.msg || "Server Error"));
        }
    };

    // --- Handle Mute Chat ---
    const handleMuteChat = async (e, chatId, isCurrentlyMuted) => {
        e.stopPropagation();
        setMenuVisibleFor(null);
        try {
            const token = localStorage.getItem("token");
            await API.put(`/chat/mute/${chatId}`, null, { headers: { Authorization: `Bearer ${token}` } });

            // Toggle frontend state
            setChats(prevChats => prevChats.map(chat =>
                chat._id === chatId
                    ? { ...chat, isMutedBy: isCurrentlyMuted
                        ? chat.isMutedBy?.filter(id => id !== currentUserId) // Use optional chaining
                        : [...(chat.isMutedBy || []), currentUserId]
                    }
                    : chat
            ));
            console.log(`Chat ${chatId} status toggled: ${isCurrentlyMuted ? 'Unmuted' : 'Muted'}`);
        } catch (error) {
            console.error("Error muting chat:", error.response?.data?.msg || error.message);
            alert("Failed to change mute status.");
        }
    };

    // --- Handle Archive Chat (with callback) ---
    const handleArchiveChat = async (e, chatId) => {
        e.stopPropagation();
        setMenuVisibleFor(null);
        try {
            const token = localStorage.getItem("token");
            await API.put(`/chat/archive/${chatId}`, null, { headers: { Authorization: `Bearer ${token}` } });

            // Remove from local state
            setChats(prevChats => prevChats.filter(chat => chat._id !== chatId));
            if (selectedChat?._id === chatId) onSelectChat(null);

            // --- CALL THE CALLBACK ---
            if (onArchiveSuccess) {
                onArchiveSuccess(); // Notify Sidebar to refresh ArchivedList
            }
            // -------------------------

            console.log(`Chat ${chatId} archived.`);
        } catch (error) {
            console.error("Error archiving chat:", error.response?.data?.msg || error.message);
            alert("Failed to archive chat. Check backend API.");
        }
    };
    // ---------------------------------

    // --- Menu Toggle Logic ---
    const toggleMenu = (e, chatId) => {
        e.stopPropagation();
        setMenuVisibleFor(menuVisibleFor === chatId ? null : chatId);
    };

    // --- Global Click Listener (Menu close) ---
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (menuVisibleFor && e.target.closest('.chat-menu') === null && e.target.closest('.menu-icon') === null) {
                setMenuVisibleFor(null);
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => { document.removeEventListener('click', handleOutsideClick); };
    }, [menuVisibleFor]);

    // --- Filter Chats for Search & Archive ---
    const filteredChats = chats.filter((chat) => {
        // Safety check: Filter out chats that might still be in state but are archived
        const isArchivedByMe = chat.archivedBy?.includes(currentUserId);
        if (isArchivedByMe) return false;

        // Search logic
        const isGroup = chat.type === "group";
        // Safety check for members array before find
        const chatName = isGroup ? chat.name : chat.members?.find((m) => m._id !== currentUserId)?.name || "Unknown User";
        return chatName.toLowerCase().includes(searchQuery.toLowerCase());
    });


    return (
        <div className="chat-list">
            {/* Search container */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search or start new chat"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="chat-items-container top">
                {filteredChats.length === 0 ? (
                    <p className="no-chats">{searchQuery ? "No matching chats found" : "No chats yet"}</p>
                ) : (
                    filteredChats.map((chat) => {

                         // Safety check for chat members
                    if (!chat.members) {
                        console.warn("Chat item missing members array:", chat);
                        return null; // Skip rendering this item
                    }
                    
                    const isGroup = chat.type === "group";
                    
                    // 1. Other User dhoondo (Jo main nahi hoon)
                    const otherUser = isGroup ? null : chat.members.find((m) => m._id !== currentUserId);
                    
                    // 2. Chat Name fix
                    const chatName = isGroup ? (chat.name || "Group") : (otherUser?.name || "Unknown User");
                    
                    // 3. AVATAR LOGIC FIX: Agar photoURL hai toh wahi dikhao, varna Dicebear use karo
                    const avatarUrl = (!isGroup && otherUser?.photoURL) 
                        ? otherUser.photoURL 
                        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(chatName)}`;

                    const lastMessage = chat.lastMessage?.text ? decryptMessage(chat.lastMessage.text) : "No messages yet...";
                    const timestamp = chat.lastMessage?.timestamp || "";

                    // Check mute status
                    const isMuted = chat.isMutedBy?.includes(currentUserId);


                        return (
                            <div
                                key={chat._id}
                                onClick={() => onSelectChat(chat)}
                                className={`chat-item ${selectedChat?._id === chat._id ? "selected" : ""}`}
                            >
                                <img src={avatarUrl} alt="avatar" className="avatar" />

                                <div className="chat-info">
                                    <span className="chat-name">
                                        {chatName}
                                        {/* MUTE ICON DISPLAY */}
                                        {isMuted && <span className="mute-icon">🔇</span>}
                                    </span>
                                    <span className="last-message">{lastMessage}</span>
                                </div>

                                <div className="chat-meta">
                                    <span className="timestamp">
                                        {timestamp ? new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : ""}
                                    </span>
                                    {/* --- THREE-DOT MENU ICON --- */}
                                    <span
                                        className="menu-icon"
                                        onClick={(e) => toggleMenu(e, chat._id)}
                                    >
                                        ⋮
                                    </span>

                                    {/* --- DROPDOWN MENU --- */}
                                    {menuVisibleFor === chat._id && (
                                        <div className="chat-menu">
                                            <div
                                                className="menu-option"
                                                onClick={(e) => handleMuteChat(e, chat._id, isMuted)}
                                            >
                                                {isMuted ? "Unmute Chat" : "Mute Chat"}
                                            </div>
                                            <div
                                                className="menu-option"
                                                onClick={(e) => handleArchiveChat(e, chat._id)}
                                            >
                                                Archive Chat
                                            </div>
                                            <div
                                                className="menu-option delete-option"
                                                onClick={(e) => handleDeleteChat(e, chat._id)}
                                            >
                                                Delete Chat (Instant)
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );

//     return (
//     <div className="chat-list">
//         {/* Search container */}
//         <div className="search-container">
//             <input
//                 type="text"
//                 placeholder="Search or start new chat"
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//             />
//         </div>

//         <div className="chat-items-container">
//             {filteredChats.length === 0 ? (
//                 <p className="no-chats">{searchQuery ? "No matching chats found" : "No chats yet"}</p>
//             ) : (
//                 filteredChats.map((chat) => {
//                     // Safety check for chat members
//                     if (!chat.members) {
//                         console.warn("Chat item missing members array:", chat);
//                         return null; // Skip rendering this item
//                     }
                    
//                     const isGroup = chat.type === "group";
                    
//                     // 1. Other User dhoondo (Jo main nahi hoon)
//                     const otherUser = isGroup ? null : chat.members.find((m) => m._id !== currentUserId);
                    
//                     // 2. Chat Name fix
//                     const chatName = isGroup ? (chat.name || "Group") : (otherUser?.name || "Unknown User");
                    
//                     // 3. AVATAR LOGIC FIX: Agar photoURL hai toh wahi dikhao, varna Dicebear use karo
//                     const avatarUrl = (!isGroup && otherUser?.photoURL) 
//                         ? otherUser.photoURL 
//                         : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(chatName)}`;

//                     const lastMessage = chat.lastMessage?.text ? decryptMessage(chat.lastMessage.text) : "No messages yet...";
//                     const timestamp = chat.lastMessage?.timestamp || "";

//                     // Check mute status
//                     const isMuted = chat.isMutedBy?.includes(currentUserId);

//                     return (
//                         <div
//                             key={chat._id}
//                             onClick={() => onSelectChat(chat)}
//                             className={`chat-item ${selectedChat?._id === chat._id ? "selected" : ""}`}
//                         >
//                             <img src={avatarUrl} alt="avatar" className="avatar" />

//                             <div className="chat-info">
//                                 <span className="chat-name">
//                                     {chatName}
//                                     {/* MUTE ICON DISPLAY */}
//                                     {isMuted && <span className="mute-icon">🔇</span>}
//                                 </span>
//                                 <span className="last-message">{lastMessage}</span>
//                             </div>

//                             <div className="chat-meta">
//                                 <span className="timestamp">
//                                     {timestamp ? new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : ""}
//                                 </span>
//                                 {/* --- THREE-DOT MENU ICON --- */}
//                                 <span
//                                     className="menu-icon"
//                                     onClick={(e) => toggleMenu(e, chat._id)}
//                                 >
//                                     ⋮
//                                 </span>

//                                 {/* --- DROPDOWN MENU --- */}
//                                 {menuVisibleFor === chat._id && (
//                                     <div className="chat-menu">
//                                         <div
//                                             className="menu-option"
//                                             onClick={(e) => handleMuteChat(e, chat._id, isMuted)}
//                                         >
//                                             {isMuted ? "Unmute Chat" : "Mute Chat"}
//                                         </div>
//                                         <div
//                                             className="menu-option"
//                                             onClick={(e) => handleArchiveChat(e, chat._id)}
//                                         >
//                                             Archive Chat
//                                         </div>
//                                         <div
//                                             className="menu-option delete-option"
//                                             onClick={(e) => handleDeleteChat(e, chat._id)}
//                                         >
//                                             Delete Chat (Instant)
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     );
//                 })
//             )}
//         </div>
//     </div>
// );


};

export default ChatList;