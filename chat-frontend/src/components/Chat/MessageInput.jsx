// // components/Chat/MessageInput.jsx
// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios"; // Make sure axios is imported
// import API from "../../api/api"; // Assuming you use API instance for base URL
// import "./ChatBox.css"; // Ensure CSS is imported

// const MessageInput = ({ chatId, onMessageSent, socket }) => {
//   const [text, setText] = useState("");
//   // --- Typing Indicator State & Ref ---
//   const [isTyping, setIsTyping] = useState(false);
//   const typingTimeoutRef = useRef(null);
//   // ------------------------------------

//   // --- Send Message Logic (Combined) ---
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!text.trim() || !socket) return; // Check text and socket

//     // --- Stop Typing on Send ---
//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }
//     if (isTyping) {
//       socket.emit("stop_typing", { chatId });
//       setIsTyping(false);
//     }
//     // ---------------------------

//     const token = localStorage.getItem("token");
//     if (!token) {
//         console.error("CLIENT: No token found for sending message");
//         return; // Don't proceed without token
//     };

//     try {
//       // Use logic from Version 2: Post to backend
//       const res = await API.post( // Use API instance if preferred
//         "/message", // Path relative to API base URL
//         { chatId: chatId, text: text, type: "text" }, // Correct data payload
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Use logic from Version 2: Update parent state
//       onMessageSent(res.data);

//       // Use logic from Version 2: Emit via socket
//       socket.emit("sendMessage", res.data);

//       setText(""); // Clear input field

//     } catch (error) {
//       // Use error handling from Version 2
//       console.error(
//         "CLIENT: Error sending message:",
//         error.response?.data?.msg || error.message || error // More detailed error logging
//       );
//       // Optionally show an error message to the user
//     }
//   };

//   // --- Typing Indicator Input Handler ---
//   const handleInputChange = (e) => {
//     setText(e.target.value);

//     if (!socket) return; // Check socket

//     if (!isTyping) {
//       socket.emit("typing", { chatId });
//       setIsTyping(true);
//     }

//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }

//     typingTimeoutRef.current = setTimeout(() => {
//       socket.emit("stop_typing", { chatId });
//       setIsTyping(false);
//     }, 2000); // 2 seconds delay
//   };

//   // --- Cleanup Typing Timeout ---
//   useEffect(() => {
//     // This runs when the component unmounts
//     return () => {
//       if (typingTimeoutRef.current) {
//         clearTimeout(typingTimeoutRef.current);
//         // Optional: Emit stop_typing if component unmounts while typing
//         // if (isTyping && socket) {
//         //   socket.emit("stop_typing", { chatId });
//         // }
//       }
//     };
//   }, [socket, chatId, isTyping]); // Added dependencies
//   // -----------------------------

//   return (
//     // Use JSX structure from Version 2
//     <div className="message-input-container">
//       <form onSubmit={sendMessage} className="message-input-form">
//         <div className="input-wrapper">
//           <span>{/* Emoji icon placeholder */}</span>
//           <input
//             type="text"
//             placeholder="Type a message..."
//             value={text}
//             // Use the typing handler from Version 1
//             onChange={handleInputChange}
//             className="message-input"
//             autoComplete="off" // Prevent browser suggestions overlapping
//           />
//           <span>{/* Attach icon placeholder */}</span>
//         </div>
//         <button type="submit" className="send-button" aria-label="Send message">
//           {/* SVG Icon from Version 2 */}
//           <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
//             <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
//           </svg>
//         </button>
//       </form>
//     </div>
//   );
// };

// export default MessageInput;


import React, { useState, useRef, useContext, useEffect } from 'react'; // <-- FIX YAHAN HAI
import API from '../../api/api';
import { AuthContext } from '../../context/AuthContext';
import * as CryptoJS from "crypto-js";
import "./ChatBox.css"; // CSS import ko add kiya

// Encryption key (same as backend)
const CHAT_KEY = import.meta.env.VITE_CHAT_KEY || "1234567890123456";

const MessageInput = ({ chatId, onMessageSent, socket }) => {
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false); // File upload ke liye loading state
    const { user } = useContext(AuthContext);
    
    // --- Typing Indicator Logic (Aapke purane code se) ---
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    // ------------------------------------
    
    const fileInputRef = useRef(null); // File input ke liye ref

    // --- 1. FILE UPLOAD HANDLER (Naya feature) ---
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log("File details as JSON:", {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified
        });


        setIsLoading(true); // Loading shuru
        
        const formData = new FormData();
        formData.append('media', file); // 'media' naam backend route se match hona chahiye

        const token = localStorage.getItem("token");

        try {
            // Step 1: File ko backend par upload karein
            const uploadRes = await API.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            const { url, fileType } = uploadRes.data;
            let messageType = 'file'; // Default
            
            if (fileType.startsWith('image/')) {
                messageType = 'image';
            } else if (fileType.startsWith('video/')) {
                messageType = 'video';
            } else if (fileType.startsWith('audio/')) {
                messageType = 'audio';
            }
            
            // Step 2: File upload hone ke baad, message bhejein
            const messageData = {
                chatId: chatId,
                type: messageType,
                mediaUrl: url, // Cloudinary URL
                text: file.name, // File ka naam text ki jagah
            };
            
            // Step 3: Message ko API route se save karein
            const res = await API.post("/message", messageData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Step 4: UI update karein (onMessageSent se)
            onMessageSent(res.data);
            
            // Step 5: Socket event bhejein (taaki receiver ko real-time mile)
            socket.emit("sendMessage", res.data);

        } catch (error) {
            console.error("File upload or message send failed:", error);
            alert("Failed to send file.");
        } finally {
            setIsLoading(false); // Loading khatam
        }
    };

    // --- 2. SEND TEXT MESSAGE HANDLER (Merged) ---
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setIsLoading(true);

        // --- Stop Typing on Send (Aapke purane code se) ---
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        if (isTyping) {
            socket.emit("stop_typing", { chatId });
            setIsTyping(false);
        }
        // ----------------------------------------------

        const token = localStorage.getItem("token");
        
        try {
            // Backend par text message bhejein
            const messageData = {
                chatId: chatId,
                text: text, // Plain text (backend encrypt karega)
                type: "text"
            };

            const res = await API.post("/message", messageData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            onMessageSent(res.data); // Optimistic UI
            socket.emit("sendMessage", res.data); // Real-time
            setText("");
        } catch (error) {
            console.error("CLIENT: Error sending message:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- 3. TYPING HANDLER (Aapke purane code se) ---
    const handleTyping = (e) => {
        setText(e.target.value);

        if (!socket) return; // Check socket

        if (!isTyping) {
            socket.emit("typing", { chatId });
            setIsTyping(true);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stop_typing", { chatId });
            setIsTyping(false);
        }, 2000); // 2 seconds delay
    };

    // --- 4. Cleanup Typing Timeout (Aapke purane code se) ---
    useEffect(() => {
        // Yeh component unmount hone par chalta hai
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []); // Empty array ka matlab hai yeh sirf unmount par chalega

    // --- 5. FINAL JSX (Dono features ke saath) ---
    return (
        <div className="message-input-container">
            <form className="message-input-form" onSubmit={sendMessage}>
                
                {/* Attach Button (Naya feature) */}
                <div className="attach-btn" onClick={() => fileInputRef.current.click()}>
                    📎
                </div>
                {/* Hidden file input */}
                {/* <input   type="file"    ref={fileInputRef}   style={{ display: 'none' }}  onChange={handleFileChange}/> */}


                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,video/*,audio/*,.doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.txt"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    />

                {/* ----------------------- */}
                
                <div className="input-wrapper">
                    <input
                        type="text"
                        className="message-input"
                        placeholder={isLoading ? "Uploading file..." : "Type a message..."}
                        value={text}
                        onChange={handleTyping} // Typing handler yahaan use karein
                        disabled={isLoading} // Uploading ke time disable
                    />
                </div>
                
                <button type="submit" className="send-button" disabled={isLoading}>
                    {/* Send icon (ya loading) */}
                    {isLoading ? '...' : '➤'}
                </button>
            </form>
        </div>
    );
};

export default MessageInput;