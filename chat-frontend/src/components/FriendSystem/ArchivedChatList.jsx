// src/components/FriendSystem/ArchivedChatList.jsx
import React, { useState, useEffect } from "react";
import API from "../../api/api";
import "../Chat/ChatList.css"; // Reuse ChatList styles

const ArchivedChatList = ({ onUnarchiveSuccess }) => {
    const [archivedChats, setArchivedChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(""); // For loading/empty messages

    // Get current user ID (needed for calculating chat names)
    let currentUserId = null;
    try {
        const userString = localStorage.getItem("user");
        if (userString) {
            currentUserId = JSON.parse(userString)?._id;
        }
    } catch (e) { console.error("Failed to parse user from localStorage in ArchivedChatList", e); }


    // --- UPDATED Fetch Function ---
    // Fetch ONLY archived chats using the dedicated endpoint
    const fetchArchivedChats = async () => {
        setLoading(true);
        setMessage("Loading archived chats..."); // Set initial message
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                 setMessage("Authentication error.");
                 setLoading(false);
                 return;
            }
            // --- CALL THE NEW DEDICATED ROUTE ---
            const res = await API.get("/chat/archived", { // Changed endpoint
                headers: { Authorization: `Bearer ${token}` },
            });
            setArchivedChats(res.data);
            setMessage(res.data.length === 0 ? "No chats are archived." : ""); // Set message based on result
        } catch (error) {
            console.error("Error fetching archived chats:", error);
            setMessage("Could not load archived chats."); // Error message
        } finally {
            setLoading(false);
        }
    };

    // Fetch on component mount (and optionally when key changes)
    useEffect(() => {
        fetchArchivedChats();
    }, []); // Runs once on mount


    // Unarchive Handler (remains the same)
    const handleUnarchive = async (e, chatId) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem("token");
            // API Call: PUT /api/chat/unarchive/:chatId
            await API.put(`/chat/unarchive/${chatId}`, null, { headers: { Authorization: `Bearer ${token}` } });

            // Remove from local state
            setArchivedChats(prev => prev.filter(chat => chat._id !== chatId));

            // Notify Sidebar to refresh ChatList
            onUnarchiveSuccess();

        } catch (error) {
            console.error("Error unarchiving chat:", error);
            alert("Failed to unarchive chat.");
        }
    };

    return (
        <div className="chat-list archived-list"> {/* Added archived-list class for potential specific styling */}
            <h4 style={{ textAlign: 'center', padding: '15px', borderBottom: '1px solid #ccc', margin: 0 }}>Archived Chats</h4>

            {loading ? (
                <p className="no-chats">{message}</p> // Show loading message
            ) : archivedChats.length === 0 ? (
                <p className="no-chats">{message}</p> // Show empty message
            ) : (
                <div className="chat-items-container">
                    {archivedChats.map((chat) => {
                        // --- FIX: Calculate chatName and avatarUrl with photoURL support ---
                    const isGroup = chat.type === "group";
                    
                    // 1. Other user dhundo
                    const otherUser = isGroup ? null : chat.members?.find((m) => m._id !== currentUserId);
                    
                    // 2. Chat name set karo
                    const chatName = isGroup ? (chat.name || "Group") : (otherUser?.name || "Unknown User");
                    
                    // 3. AVATAR LOGIC: Check photoURL first, then fallback to Dicebear
                    const avatarUrl = (!isGroup && otherUser?.photoURL) 
                        ? otherUser.photoURL 
                        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(chatName)}`;
                    // ------------------------------------------------------------------

                        return (
                            <div key={chat._id} className="chat-item">
                                <img src={avatarUrl} alt="avatar" className="avatar" />
                                <div className="chat-info">
                                    <span className="chat-name">{chatName}</span>
                                    {/* You could show the last message here if needed */}
                                    <span className="last-message" style={{ fontStyle: 'italic', color: '#888' }}>Archived</span>
                                </div>
                                {/* Unarchive Button */}
                                <button
                                    className="add-btn unarchive-btn" // Added specific class
                                    onClick={(e) => handleUnarchive(e, chat._id)}
                                    title="Unarchive this chat" // Tooltip
                                >
                                    {/* Replace text with an icon maybe? */}
                                    Unarchive
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ArchivedChatList;