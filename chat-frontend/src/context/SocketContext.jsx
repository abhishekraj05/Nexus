import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

// 1. Context ko export karein (Yeh crash fix karega)
export const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    
    // --- 2. ONLINE USERS STATE (Yahaan Add Karein) ---
    // Ek Map rakhein jo (userId -> socketId) store karega
    const [onlineUsers, setOnlineUsers] = useState(new Map());
    // ---------------------------------------------

    useEffect(() => {
        if (user) {
            const socketEndpoint = import.meta.env.VITE_SOCKET_ENDPOINT || "http://localhost:5000";
            const newSocket = io(socketEndpoint);
            setSocket(newSocket);

            // --- 3. 'setup' aur STATUS LISTENERS YAHIN ADD KAREIN ---
            
            // Connect hote hi 'setup' event bhejein
            newSocket.emit("setup", user._id);
            console.log(`[SocketContext] Emitted 'setup' for user: ${user._id}`);
            
            // (Initial friend statuses fetch yahaan bhi kar sakte hain, ya ChatPage mein)
            // (Abhi ke liye ChatPage mein rehne dein)

            // Online status sunein
            newSocket.on("user_online", ({ userId }) => {
                console.log(`✅ [SocketContext] Received user_online for: ${userId}`);
                setOnlineUsers(prevMap => new Map(prevMap).set(userId, true));
            });

            // Offline status sunein
            newSocket.on("user_offline", ({ userId, lastSeen }) => {
                console.log(`❎ [SocketContext] Received user_offline for: ${userId}`);
                setOnlineUsers(prevMap => new Map(prevMap).set(userId, lastSeen));
            });
            // ----------------------------------------------------

            return () => {
                console.log("[SocketContext] Cleaning up socket.");
                newSocket.off('user_online');
                newSocket.off('user_offline');
                newSocket.disconnect();
                setSocket(null);
            };
        } else {
            // Agar user logout ho jaaye
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            setOnlineUsers(new Map()); // Online list clear karein
        }
    }, [user]); // Yeh effect sirf 'user' par depend karta hai

    return (
        // 4. 'socket' aur 'onlineUsers' dono ko value mein pass karein
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};









