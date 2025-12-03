// pages/ChatPage.jsx
import React, { useState, useContext, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api"; // Your Axios instance
import Sidebar from "../components/layout/Sidebar";
import ChatBox from "../components/Chat/ChatBox";
import "./ChatPage.css"; // Ensure you have styles for layout

export default function ChatPage() {
    const { user } = useContext(AuthContext);
    const [activeChat, setActiveChat] = useState(null);
    const socket = useRef(null);

    // --- State for Online Status ---
    // Stores status like: { userId1: true, userId2: "2025-10-24T..." }
    const [onlineStatuses, setOnlineStatuses] = useState({});
    // ---------------------------------

    useEffect(() => {
        // Only connect if the user is logged in
        if (user) {
            // --- Connect to Socket ---
            // Use import.meta.env for Vite environment variables
            const socketEndpoint = import.meta.env.VITE_SOCKET_ENDPOINT || "http://localhost:5000";
            console.log("[ChatPage] Connecting to socket at:", socketEndpoint);
            socket.current = io(socketEndpoint);

            // --- Emit 'setup' event once connected ---
            socket.current.emit("setup", user._id);
            console.log(`[ChatPage] Emitted 'setup' for user: ${user._id}`);

            // --- Fetch Initial Friend Statuses ---
            const fetchInitialStatuses = async () => {
                try {
                    console.log("[ChatPage] Fetching initial friend statuses...");
                    const token = localStorage.getItem("token");
                    // Call the new backend route /api/friends/statuses
                    const res = await API.get("/friends/statuses", {
                         headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log("[ChatPage] Fetched initial friend statuses:", res.data);
                    // Update state with the initial statuses fetched from API
                    setOnlineStatuses(prev => ({ ...prev, ...res.data }));
                } catch (error) {
                    console.error("[ChatPage] Error fetching initial friend statuses:", error);
                }
            };
            fetchInitialStatuses(); // Call immediately after setup emit
            // ------------------------------------

            // --- Listen for Live Status Updates ---
            socket.current.on("user_online", ({ userId }) => {
                console.log(`✅ [ChatPage] Received user_online for: ${userId}`);
                setOnlineStatuses(prev => {
                    if (prev[userId] === true) return prev; // Avoid unnecessary re-renders
                    const newState = { ...prev, [userId]: true };
                    return newState;
                });
            });

            socket.current.on("user_offline", ({ userId, lastSeen }) => {
                console.log(`❎ [ChatPage] Received user_offline for: ${userId}`);
                setOnlineStatuses(prev => {
                    if (prev[userId] === lastSeen) return prev; // Avoid unnecessary re-renders
                    const newState = { ...prev, [userId]: lastSeen };
                    return newState;
                });
            });
            // -------------------------------------------

            // Cleanup function: runs when component unmounts or user changes
            return () => {
                console.log("[ChatPage] Cleaning up socket listeners and disconnecting...");
                if (socket.current) {
                    socket.current.off('user_online');
                    socket.current.off('user_offline');
                    socket.current.disconnect();
                    socket.current = null; // Clear ref on cleanup
                }
            };
        }
        // If user logs out (user becomes null)
        else {
            if (socket.current) {
                console.log("[ChatPage] User logged out, disconnecting socket.");
                socket.current.disconnect();
                socket.current = null;
            }
            setOnlineStatuses({}); // Clear statuses on logout
        }
    }, [user]); // Re-run effect if the user object changes

    return (
        <div className="chat-page-container">

            {/* --- Pass Status to Sidebar --- */}
            <Sidebar
                onSelectChat={setActiveChat}
                selectedChat={activeChat}
                onlineStatuses={onlineStatuses} // Pass state down
            />
            {/* --------------------------------- */}

            {/* --- Conditionally Render ChatBox or Welcome Screen --- */}
            {activeChat ? (
                // --- Pass Status to ChatBox ---
                <ChatBox
                    key={activeChat._id} // Important for re-mounting when chat changes
                    chat={activeChat}
                    socket={socket.current}
                    onlineStatuses={onlineStatuses} // Pass state down
                />
                // ---------------------------------
            ) : (
                <div className="welcome-screen">
                    {/*  */}
                    <p>Select a chat or start a new conversation!</p>
                </div>
            )}
        </div>
    );
}






