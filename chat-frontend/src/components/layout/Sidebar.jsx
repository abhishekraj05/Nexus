// components/layout/Sidebar.jsx
import React, { useState, useContext } from "react";
import ChatList from "../Chat/ChatList";
import { useNavigate }  from 'react-router-dom';
import FindUsers from "../FriendSystem/FindUsers";
import PendingRequests from "../FriendSystem/PendingRequests";
import FriendsList from "../FriendSystem/FriendsList";
import ArchivedChatList from "../FriendSystem/ArchivedChatList"; // Import Archived list
import { AuthContext } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = ({ onSelectChat, selectedChat, onlineStatuses }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("chats");
    const { user } = useContext(AuthContext);

    // State keys to force re-fetching in child components
    const [refreshChatListKey, setRefreshChatListKey] = useState(0);
    const [refreshArchivedListKey, setRefreshArchivedListKey] = useState(0);

    // Callback from ArchivedChatList: Refreshes ChatList and switches view
    const handleUnarchiveSuccess = () => {
        setRefreshChatListKey(prev => prev + 1); // Increment key for ChatList
        setActiveTab("chats"); // Switch back to chats view
    };

    // Callback from ChatList: Refreshes ArchivedChatList (for next time it's viewed)
    const handleArchiveSuccess = () => {
        setRefreshArchivedListKey(prev => prev + 1); // Increment key for ArchivedChatList
        // Stay on the ChatList tab after archiving
    };

    // Helper to get avatar URL
    const getAvatarUrl = (userData) => {
        const userName = userData?.name || 'Default';
        const defaultAvatarSeed = "DefaultUser";
        const defaultAvatarUrlPattern = `https://api.dicebear.com/7.x/initials/svg?seed=${defaultAvatarSeed}`;
        const useActualPhoto = userData?.photoURL && userData.photoURL !== defaultAvatarUrlPattern;
        return useActualPhoto
            ? userData.photoURL
            : `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`;
    };

    return (
        <div className="sidebar">
            {/* Header */}
            <div className="sidebar-header">
                <img
                    src={getAvatarUrl(user)}
                    alt="My Avatar"
                    className="avatar"
                    onClick={() => navigate("/profile")}
                    style={{ cursor: 'pointer' }}
                    referrerpolicy="no-referrer"
                />
                {/* Navigation Tabs */}
                <div className="sidebar-nav">
                    <button
                        onClick={() => setActiveTab("chats")}
                        className={activeTab === "chats" ? "active" : ""}
                    >
                        Chats
                    </button>
                    <button
                        onClick={() => setActiveTab("friends")}
                        className={activeTab === "friends" ? "active" : ""}
                    >
                        Friends
                    </button>
                    <button
                        onClick={() => setActiveTab("find")}
                        className={activeTab === "find" ? "active" : ""}
                    >
                        Find Users
                    </button>
                    <button
                        onClick={() => setActiveTab("requests")}
                        className={activeTab === "requests" ? "active" : ""}
                    >
                        Requests
                    </button>
                    {/* Archived Tab Button */}
                    <button
                        onClick={() => setActiveTab("archived")}
                        className={activeTab === "archived" ? "active" : ""}
                    >
                        Archived
                    </button>
                </div>
            </div>

            {/* Content Area - Renders the active tab's component */}
            <div className="sidebar-content">
                {activeTab === "chats" && (
                    <ChatList
                        onSelectChat={onSelectChat}
                        selectedChat={selectedChat}
                        onlineStatuses={onlineStatuses}
                        key={refreshChatListKey} // Use key to force refresh
                        onArchiveSuccess={handleArchiveSuccess} // Pass archive callback down
                    />
                )}
                {activeTab === "friends" && (
                    <FriendsList onlineStatuses={onlineStatuses} />
                )}
                {activeTab === "find" && <FindUsers />}
                {activeTab === "requests" && <PendingRequests />}
                {/* Render Archived Chats */}
                {activeTab === "archived" && (
                    <ArchivedChatList
                        onUnarchiveSuccess={handleUnarchiveSuccess}
                        key={refreshArchivedListKey} // Use key to force refresh
                    />
                )}
            </div>
        </div>
    );
};

export default Sidebar;