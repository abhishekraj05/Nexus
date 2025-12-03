

// src/components/Chat/ChatBox.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import API from "../../api/api";
import MessageInput from "./MessageInput";
import * as CryptoJS from "crypto-js";
import { AuthContext } from "../../context/AuthContext";
import UserProfileModal from "../FriendSystem/UserProfileModal";
import MessageTicks from "./MessageTicks";
import MessageReactions from "./MessageReactions";
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import "./ChatBox.css";
import { format, isToday, isYesterday } from 'date-fns';




// --- 1. NEW HELPER COMPONENT (File Message) ---
// (Ise ChatBox component ke *bahar* (upar) rakhein)
// --- Helper Component (File Message Display) ---
// (Ise ChatBox component ke *bahar* (upar) rakhein)

const FileMessage = ({ type, url, text }) => {
    
    // --- 1. DECRYPTION LOGIC (File name ko decrypt karne ke liye) ---
    const decryptMessage = (encryptedText) => {
        // Key aapke MessageInput/ChatBox se match honi chahiye
        const SECRET_KEY = "1234567890123456789347983474985834"; 
        if (!encryptedText) return "file";
        // Agar file ka naam encrypt nahi hua tha (purana text), toh use waise hi return karein
        if (!encryptedText.startsWith("U2FsdGVkX1")) return encryptedText; 
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            return originalText.length > 0 ? originalText : "file";
        } catch (e) { 
            console.error("Decryption failed for file name:", e);
            return "file"; // Error par fallback
        }
    };
    
    // File ka naam decrypt karein (ya plain text lein)
    const fileName = decryptMessage(text);
    // -------------------------------------------------------------

    if (type === 'image') {
        return <img src={url} alt={fileName} className="message-image" />;
    }
    if (type === 'video') {
        return <video controls src={url} className="message-video" />;
    }
    if (type === 'audio') {
        return <audio controls src={url} className="message-audio" />;
    }
    
    // --- 2. PDF/TEXT FILE FIX (Cloudinary URL Modify) ---
    let displayUrl = url;
    // Check karein ki file PDF ya TXT hai (aap aur types add kar sakte hain)
    // if (type === 'file' && (fileName.endsWith('.pdf') || fileName.endsWith('.txt'))) {
        

        if (fileName.endsWith('.pdf') || fileName.endsWith('.txt') || fileName.endsWith('.docx') || fileName.endsWith('.doc')) {

        // Cloudinary URL mein 'upload/' ko 'upload/fl_inline/' se replace karein
        // Yeh browser ko download ki jagah "inline" (tab mein) kholne ko force karega
        displayUrl = url.replace('/upload/', '/upload/fl_inline/');
    }
    // ---------------------------------------------------

    // Default 'file' ya 'document'
    return (
        <a href={displayUrl} target="_blank" rel="noopener noreferrer" className="message-file">
            📄 {fileName} {/* 'text' ko 'fileName' se badla */}
        </a>
    );
};











const ChatWindow = ({ chat, socket, onlineStatuses }) => {
    // --- State ---
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const { user } = useContext(AuthContext);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [typingUserId, setTypingUserId] = useState(null);
    const [typingUserName, setTypingUserName] = useState("");
    const [pickerVisibleFor, setPickerVisibleFor] = useState(null);
    const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
    const pickerRef = useRef(null);
    const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
    const [isInSelectionMode, setIsInSelectionMode] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState(new Set());
    const [contextMenu, setContextMenu] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [canDeleteForEveryone, setCanDeleteForEveryone] = useState(false);
    // --- Refs for listeners ---
    const messageListenerRef = useRef(null);
    const statusUpdateListenerRef = useRef(null);
    const typingListenerRef = useRef(null);
    const stopTypingListenerRef = useRef(null);
    const reactionUpdateListenerRef = useRef(null);
    const deleteListenerRef = useRef(null);
    const chatClearedListenerRef = useRef(null);
    const chatSeenListenerRef = useRef(null);
    const messagesClearedListenerRef = useRef(null);

    
    // --- Modal Handlers ---
    const handleViewProfile = (userProfile) => { setSelectedProfile(userProfile); };
    const handleCloseModal = () => { setSelectedProfile(null); };

    // --- Decryption & User/Chat Details ---
    const SECRET_KEY = "1234567890123456789347983474985834"; // !! Use actual key !!
    const decryptMessage = (encryptedText) => {
        if (!encryptedText) return "";
        if (!encryptedText.startsWith("U2FsdGVkX1")) return encryptedText;
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            return originalText.length > 0 ? originalText : "[Encrypted]";
        } catch (e) { console.error("Decryption failed:", e); return "[Decrypt Error]"; }
    };

    const getOtherUser = () => {
        if (!chat || !user || chat.type === "group") return null;
        return chat.members?.find((m) => m._id !== user._id);
    };
    const otherUserForProfile = getOtherUser();

    const getChatDetails = () => {
        if (!chat || !user) return { name: "Loading...", avatar: "", otherUser: null };
        const isGroup = chat.type === "group";
        if (isGroup) {
            return { name: chat.name || "Group", avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${chat.name || 'Group'}`, otherUser: null };
        } else {
            const name = otherUserForProfile?.name || "Unknown User";
            const defaultAvatarSeed = "DefaultUser";
            const defaultAvatarUrlPattern = `https://api.dicebear.com/7.x/initials/svg?seed=${defaultAvatarSeed}`;
            const useActualPhoto = otherUserForProfile?.photoURL && otherUserForProfile.photoURL !== defaultAvatarUrlPattern;
            const avatar = useActualPhoto ? otherUserForProfile.photoURL : `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
            return { name: name, avatar: avatar, otherUser: otherUserForProfile };
        }
    };
    const chatDetails = getChatDetails() || { name: "Loading...", avatar: "", otherUser: null };
    const { name: chatName, avatar: chatAvatar } = chatDetails;

    // --- Status & Formatting ---
    const otherUserId = otherUserForProfile?._id;
    const status = otherUserId && onlineStatuses ? onlineStatuses[otherUserId] : undefined;
    const formatLastSeen = (lastSeenDateString) => {
        if (!lastSeenDateString || typeof lastSeenDateString !== 'string' || status === true) { return "Offline"; }
        try {
            const lastSeenDate = new Date(lastSeenDateString);
            if (isNaN(lastSeenDate.getTime())) { return "Offline"; }
            if (isToday(lastSeenDate)) { return `last seen today at ${format(lastSeenDate, 'p')}`; }
            if (isYesterday(lastSeenDate)) { return `last seen yesterday at ${format(lastSeenDate, 'p')}`; }
            return `last seen on ${format(lastSeenDate, 'MMM d')}`;
        } catch (e) { return "Offline"; }
    };
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    };

    // --- Reaction Handlers ---
    const handleReact = async (messageId, chosenEmoji) => {
        if (!user?._id) return;
        const messageIndex = messages.findIndex(msg => msg._id === messageId);
        if (messageIndex === -1) return;
        const currentMessage = messages[messageIndex];
        const currentReactions = new Map(currentMessage.reactions || []);
        const myCurrentReaction = currentReactions.get(user._id);
        let newEmojiValue = chosenEmoji;
        if (myCurrentReaction === chosenEmoji) {
            currentReactions.delete(user._id);
            newEmojiValue = null;
        } else {
            currentReactions.set(user._id, chosenEmoji);
        }
        const updatedMessages = [...messages];
        updatedMessages[messageIndex] = { ...currentMessage, reactions: new Map(currentReactions) };
        setMessages(updatedMessages);
        setPickerVisibleFor(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            await API.post(`/message/${messageId}/react`, { emoji: newEmojiValue }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (error) { console.error("CLIENT: Error sending reaction:", error); alert("Failed to save reaction change."); }
    };

    const handleDoubleTap = (event, messageId) => {
        event.preventDefault();
        const bubble = event.currentTarget;
        const rect = bubble.getBoundingClientRect();
        let top = window.scrollY + rect.bottom + 5; // 5px below
        let left = window.scrollX + rect.left;
        const pickerHeight = 350;
        const pickerWidth = 300;
        if (top + pickerHeight > window.innerHeight) { top = window.scrollY + rect.top - pickerHeight - 5; } // Position above
        if (left + pickerWidth > window.innerWidth) { left = window.innerWidth - pickerWidth - 10; }
        if (left < 10) { left = 10; }
        
        // --- YEH LINES ADDED HAIN ---
        setPickerPosition({ top: top, left: left });
        setPickerVisibleFor(messageId);
        // ------------------------------
    };
    
    const onEmojiClick = (emojiData, messageId) => { handleReact(messageId, emojiData.emoji); };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerVisibleFor && pickerRef.current && !pickerRef.current.contains(event.target) && !event.target.closest('.message-bubble')) {
                setPickerVisibleFor(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, [pickerVisibleFor]);

    // --- Context Menu Handlers ---
    const handleContextMenu = (event, message) => {
        event.preventDefault();
        setContextMenu({ message: message, top: event.clientY, left: event.clientX });
    };
    const closeContextMenu = () => { setContextMenu(null); };
    const handleDeleteMessage = async (messageId) => {
        closeContextMenu();
        try {
            const token = localStorage.getItem("token");
            await API.delete(`/message/${messageId}`, { headers: { Authorization: `Bearer ${token}` } });
        } catch (error) { console.error("CLIENT: Error deleting single message:", error); alert("Failed to delete message."); }
    };

    // --- Selection Mode Handlers ---
    const handleEnterSelectionMode = () => {
        setHeaderMenuOpen(false);
        setIsInSelectionMode(true);
        setSelectedMessages(new Set());
    };
    const handleCancelSelection = () => {
        setIsInSelectionMode(false);
        setSelectedMessages(new Set());
    };
    const handleToggleMessageSelection = (messageId) => {
        const newSelection = new Set(selectedMessages);
        if (newSelection.has(messageId)) { newSelection.delete(messageId); }
        else { newSelection.add(messageId); }
        setSelectedMessages(newSelection);
    };
    
    const handleDeleteSelectedMessages = () => {
        if (selectedMessages.size === 0) return;
        let allAreSender = true;
        for (const msgId of selectedMessages) {
            const msg = messages.find(m => m._id === msgId);
            if (!msg || (msg.senderId?._id !== user?._id && msg.senderId !== user?._id)) {
                allAreSender = false;
                break;
            }
        }
        setCanDeleteForEveryone(allAreSender);
        setShowDeleteModal(true);
        setHeaderMenuOpen(false);
    };
    
    const handleDeleteForMe = async () => {
        setShowDeleteModal(false);
        try {
            const token = localStorage.getItem("token");
            await API.post("/message/delete-multiple-for-me", { messageIds: Array.from(selectedMessages) }, { headers: { Authorization: `Bearer ${token}` } });
            setMessages(prev => prev.filter(msg => !selectedMessages.has(msg._id)));
            handleCancelSelection();
        } catch (error) { console.error("Error deleting for me:", error); alert("Failed to delete messages for you."); }
    };

    const handleDeleteForEveryone = async () => {
        setShowDeleteModal(false);
        try {
            const token = localStorage.getItem("token");
            await API.post("/message/delete-multiple-for-everyone", { messageIds: Array.from(selectedMessages) }, { headers: { Authorization: `Bearer ${token}` } });
            handleCancelSelection();
        } catch (error) { console.error("Error deleting for everyone:", error); alert("Failed to delete messages for everyone."); }
    };

    const handleClearChat = async () => {
        setHeaderMenuOpen(false);
        if (window.confirm("Are you sure you want to clear all messages in this chat?")) {
            try {
                const token = localStorage.getItem("token");
                await API.delete(`/message/clear/${chat._id}`, { headers: { Authorization: `Bearer ${token}` } });
                setMessages([]); 
            } catch (error) { console.error("Error clearing chat:", error); alert("Failed to clear chat."); }
        }
    };
    // ------------------------------------

    // --- Main useEffect ---
    useEffect(() => {
        if (!chat?._id || !socket) { setMessages([]); return; };
        let isMounted = true;
        
        setIsInSelectionMode(false);
        setSelectedMessages(new Set());
        setHeaderMenuOpen(false);
        setContextMenu(null);


    // --- YEH POORA 'markAsSeen' BLOCK ADD KAREIN ---
    const markAsSeen = async () => {
        try {
            const token = localStorage.getItem("token");
            await API.post(`/message/${chat._id}/mark-seen`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (isMounted) {
                setMessages(prev => prev.map(msg => 
                    (msg.senderId !== user?._id && msg.status !== 'seen') 
                    ? { ...msg, status: 'seen' } 
                    : msg
                ));
            }
        } catch (error) { console.error("Error marking chat as seen:", error); }
    };
    markAsSeen(); // Chat khulte hi call karein
    // ----------------------------------------
        
        const fetchMessages = async () => {
             try {
                 const token = localStorage.getItem("token");
                 const res = await API.get(`/message/${chat._id}`, { headers: { Authorization: `Bearer ${token}` } });
                 if (isMounted) {
                     const initialMessages = res.data.map(msg => ({ ...msg, reactions: new Map(Object.entries(msg.reactions || {})), status: msg.status || 'sent' }));
                     setMessages(initialMessages);
                 }
             } catch (error) { console.error("Error fetching messages:", error); if(isMounted) setMessages([]) }
        };
        fetchMessages();


        socket.emit("joinChat", chat._id);

        // --- Define Listeners (FIXED) ---
        // messageListenerRef.current = (message) => {
        //      if (!isMounted) return;
        //      const messageChatId = message.chatId || message.chat?._id || message.chat;
        //      if (String(messageChatId) === String(chat._id)) {
        //          setMessages((prev) => prev.some(m => m._id === message._id) ? prev : [...prev, { ...message, reactions: new Map(Object.entries(message.reactions || {})), status: message.status || 'sent' }]);
        //          socket.emit("message_delivered", { messageId: message._id });
        //      }
        // };




// --- Naya message receive karna ---
        messageListenerRef.current = (message) => {
             if (!isMounted) return;
             const messageChatId = message.chatId || message.chat?._id || message.chat;
             if (String(messageChatId) === String(chat._id)) {
                 setMessages((prev) => prev.some(m => m._id === message._id) ? prev : [...prev, { ...message, reactions: new Map(Object.entries(message.reactions || {})), status: message.status || 'sent' }]);
                 
                 // --- YEH RAHA FIX ---
                 // Kyunki yeh chat component active hai (khula hai),
                 // iska matlab user ne message 'seen' kar liya hai.
                 console.log(`CLIENT (Receiver): Message received while chat is open. Emitting "message_seen_realtime" for ${message._id}`);
                 socket.emit("message_seen_realtime", { messageId: message._id }); 
                 
                 // Hum 'message_delivered' nahi bhejenge, kyunki 'seen' 'delivered' se bada status hai.
                //  socket.emit("message_delivered", { messageId: message._id }); // <-- Is line ko hata dein (ya comment rehne dein)
             }
        };



        // statusUpdateListenerRef.current = ({ messageId, chatId: eventChatId, status, deliveredTo }) => {
        //      if (!isMounted) return;
        //      if (eventChatId === chat._id) {
        //          setMessages(prev => prev.map(msg => msg._id === messageId ? { ...msg, status: status, deliveredTo: deliveredTo || msg.deliveredTo } : msg));
        //      }
        // };
        
 



        // --- YEH BHI UPDATE KAREIN ---
      
      
        // (statusUpdateListenerRef ko 'seenBy' bhi handle karna chahiye)
        statusUpdateListenerRef.current = ({ messageId, chatId: eventChatId, status, deliveredTo, seenBy }) => {
             if (!isMounted) return;
             if (eventChatId === chat._id) {
                 console.log(`CLIENT (Sender): Received "update_message_status" for ${messageId}. New status: ${status}`);
                 setMessages(prev => prev.map(msg => 
                    (msg._id === messageId) 
                    ? { ...msg, status: status, deliveredTo: deliveredTo || msg.deliveredTo, seenBy: seenBy || msg.seenBy } 
                    : msg
                 ));
             }
        };
        
        reactionUpdateListenerRef.current = ({ messageId, chatId: eventChatId, reactions: updatedReactionsObj }) => {
             if (!isMounted) return;
             if (eventChatId === chat._id) {
                 const updatedReactionsMap = new Map(Object.entries(updatedReactionsObj || {}));
                 setMessages(prev => prev.map(msg => msg._id === messageId ? { ...msg, reactions: updatedReactionsMap } : msg));
             }
        };
       
            typingListenerRef.current = ({ chatId: eventChatId, userId }) => {
        if (!isMounted) return;
        if (eventChatId === chat._id && userId !== user?._id) {
            setTypingUserId(userId);
            const typingUser = chat.members?.find(m => m._id === userId);
            setTypingUserName(typingUser?.name || "Someone");
        }
    };

    // --- FIX: Corrected stop_typing logic ---
    stopTypingListenerRef.current = ({ chatId: eventChatId, userId }) => {
        if (!isMounted) return;
        // Use functional update to get the *previous* ID reliably
        setTypingUserId(prevTypingId => {
            // Check if the user stopping is the one we are currently displaying
            if (eventChatId === chat._id && userId === prevTypingId) {
                setTypingUserName(""); // Clear the name
                return null; // Clear the ID
            }
            return prevTypingId; // No change
        });
    };


        deleteListenerRef.current = ({ messageIds, messageId }) => { // Handle both
            if (!isMounted) return;
            if (messageIds) { // Multiple
                setMessages(prev => prev.map(msg => 
                   messageIds.includes(msg._id) ? { ...msg, deleted: true, text: "This message was deleted", type: 'text', reactions: new Map() } : msg
                ));
            } else if (messageId) { // Single
                 setMessages(prev => prev.map(msg => 
                    msg._id === messageId ? { ...msg, deleted: true, text: "This message was deleted", type: 'text', reactions: new Map() } : msg
                ));
            }
        };
        chatClearedListenerRef.current = ({ chatId: eventChatId }) => {
            if (!isMounted) return;
            if (eventChatId === chat._id) { setMessages([]); }
        };
        messagesClearedListenerRef.current = ({ messageIds, chatId: eventChatId }) => { // "Delete for me"
             if (!isMounted) return;
             if (eventChatId === chat._id) {
                setMessages(prev => prev.filter(msg => !messageIds.includes(msg._id)));
             }
        };




        // --- YEH LISTENER DEFINITION ADD KAREIN ---
       chatSeenListenerRef.current = ({ chatId: eventChatId, seenByUserId }) => {
        if (!isMounted) return;
        if (eventChatId === chat._id) {
            console.log(`CLIENT (Sender): Received "chat_seen" event from ${seenByUserId}`);
            setMessages(prevMessages => 
                prevMessages.map(msg => 
                    (msg.senderId?._id === user?._id || msg.senderId === user?._id)
                    ? { ...msg, status: 'seen' } 
                    : msg
                )
            );
        }
    };
        // ---------------------------------------

        // --- Attach Listeners ---
        socket.on("newMessage", messageListenerRef.current);
        socket.on("update_message_status", statusUpdateListenerRef.current);
        socket.on("message_reaction_update", reactionUpdateListenerRef.current);
        socket.on("user_typing", typingListenerRef.current);
        socket.on("user_stopped_typing", stopTypingListenerRef.current);
        socket.on("messages_deleted", deleteListenerRef.current); 
        socket.on("chat_cleared", chatClearedListenerRef.current);
        socket.on("messages_cleared_for_me", messagesClearedListenerRef.current);
        socket.on("chat_seen", chatSeenListenerRef.current);

        // --- Cleanup ---
        return () => {
            isMounted = false;
            if (socket) {
                socket.off("newMessage", messageListenerRef.current);
                socket.off("update_message_status", statusUpdateListenerRef.current);
                socket.off("message_reaction_update", reactionUpdateListenerRef.current);
                socket.off("user_typing", typingListenerRef.current);
                socket.off("user_stopped_typing", stopTypingListenerRef.current);
                socket.off("messages_deleted", deleteListenerRef.current);
                socket.off("chat_cleared", chatClearedListenerRef.current);
                socket.off("messages_cleared_for_me", messagesClearedListenerRef.current);
                socket.off("chat_seen", chatSeenListenerRef.current);
            }
            setTypingUserId(null); setTypingUserName("");
        };
    }, [chat?._id, socket, user?._id, chat?.members ]); // typingUserId yahaan rehna zaroori hai

    // --- Auto-scroll ---
    useEffect(() => { if(messages.length > 0) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    if (!chat?._id) { return <div className="chat-box-container"><div className="loading-placeholder">Select a chat</div></div>; }

    return (
        <div className="chat-box-container">
            {/* --- UPDATED HEADER (Handles Selection Mode) --- */}
            <div className="chat-header">
                {isInSelectionMode ? (
                    <div className="selection-header">
                        <button onClick={handleCancelSelection} className="header-btn">Cancel</button>
                        <span className="selection-count">{selectedMessages.size} selected</span>
                        <button onClick={handleDeleteSelectedMessages} className="header-btn delete-btn" disabled={selectedMessages.size === 0}>
                            🗑️ Delete
                        </button>
                    </div>
                ) : (
                    <>
                        <img src={chatAvatar || ''} alt="avatar" className="avatar" onClick={() => { if (chat.type !== "group" && otherUserForProfile) handleViewProfile(otherUserForProfile); }} style={{ cursor: chat.type !== "group" && otherUserForProfile ? 'pointer' : 'default' }} referrerPolicy="no-referrer"/>
                        <div className="chat-header-info" onClick={() => { if (chat.type !== "group" && otherUserForProfile) handleViewProfile(otherUserForProfile); }} style={{ cursor: chat.type !== "group" && otherUserForProfile ? 'pointer' : 'default' }}>
                            <span className="chat-name">{chatName || 'Chat'}</span>
                            <span className="chat-status">
                              {typingUserId ? <span className="typing-indicator">{`${typingUserName || 'Someone'} is typing...`}</span> : (status === true ? "Online" : formatLastSeen(status))}
                            </span>
                        </div>
                         <div className="chat-header-icons"> 
                            <span>📞</span> 
                            <span onClick={() => setHeaderMenuOpen(prev => !prev)}>⋮</span>
                            {headerMenuOpen && (
                                <div className="header-menu" onMouseLeave={() => setHeaderMenuOpen(false)}>
                                    <div className="menu-option" onClick={handleClearChat}>Clear Chat</div>
                                    <div className="menu-option" onClick={handleEnterSelectionMode}>Select Messages</div>
                                </div>
                            )}
                         </div>
                    </>
                )}
            </div>
            {/* --------------------------- */}

           {/* Message Area */}
            <div className="message-area">
                {messages.length === 0 ? ( <p className="no-messages-placeholder">No messages yet...</p> ) : (
                    messages.map((msg) => {
                        if (!msg || !msg.senderId || !msg._id) return null;
                        const senderId = msg.senderId?._id || msg.senderId;
                        const isSender = user?._id ? String(senderId) === String(user._id) : false;
                        const isSelected = selectedMessages.has(msg._id);
                        const isDeleted = msg.deleted;

                        return (
                            <div 
                                key={msg._id} 
                                className={`message-wrapper ${isSender ? "sender" : "receiver"} ${isInSelectionMode ? 'selection-mode' : ''}`}
                                // --- FIX 1: '!isDeleted' yahaan se hata diya ---
                                // Ab aap deleted messages ko bhi select kar sakte hain
                                onClick={() => isInSelectionMode && handleToggleMessageSelection(msg._id)}
                            >
                                {/* --- FIX 2: '!isDeleted' yahaan se bhi hata diya --- */}
                                {/* Ab deleted messages ke paas bhi checkbox dikhega */}
                                {isInSelectionMode && (
                                    <div className={`message-selection-overlay ${isSelected ? 'selected' : ''} ${isSender ? 'sender' : 'receiver'}`}>
                                        {isSelected ? '' : ''}
                                    </div>
                                )}
                                <div
                                    className={`message-bubble ${isDeleted ? 'deleted' : ''} ${isSelected ? 'selected-bubble' : ''}`}
                                    // Double tap aur context menu abhi bhi deleted messages par disabled rahenge (jo sahi hai)
                                    onDoubleClick={(e) => !isInSelectionMode && !isDeleted && handleDoubleTap(e, msg._id)}
                                    onContextMenu={(e) => !isInSelectionMode && !isDeleted && isSender && handleContextMenu(e, msg)}
                                >
                                    {!isSender && chat.type === "group" && !isDeleted && ( <strong className="sender-name">{msg.senderId?.name || "User"}</strong> )}
                                    
                                    {/* Text display (yeh pehle se hi deleted text handle kar raha hai) */}
                                    
                                    
                                    {/* <span className={isDeleted ? 'deleted-text' : ''}>
                                        {msg.type === "text" ? decryptMessage(msg.text) : msg.text}
                                    </span> */}


                                    {/* --- 2. UPDATED RENDER LOGIC --- */}
                                    {msg.type === 'text' ? (
                                        <span className={isDeleted ? 'deleted-text' : ''}>
                                            {decryptMessage(msg.text)}
                                        </span>
                                    ) : (
                                      
                                        <FileMessage 
                                            type={msg.type}
                                            url={msg.mediaUrl} 
                                            text={decryptMessage(msg.text)} 
                                        />
                                    )}



                                        {/* <FilePreview
                                        fileType={msg.fileType}
                                        mediaUrl={msg.mediaUrl}
                                        fileName={msg.text}
                                        /> */}





                                    {/* Meta/Reactions (Yeh pehle se hi deleted messages ke liye hide ho rahe hain) */}
                                    {!isDeleted && (
                                        <>
                                            <div className="message-meta">
                                                <span className="timestamp">{formatTime(msg.createdAt)}</span>
                                                {isSender && <MessageTicks status={msg.status} />}
                                            </div>
                                            <MessageReactions reactionsMap={msg.reactions} />
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>
           
           
            {/* Render Context Menu */}
            {contextMenu && (
                <MessageContextMenu
                    message={contextMenu.message}
                    top={contextMenu.top}
                    left={contextMenu.left}
                    onClose={closeContextMenu}
                    onDelete={handleDeleteMessage}
                />
            )}
            
             {/* Emoji Picker */}
             {pickerVisibleFor && (
                <div ref={pickerRef} className="emoji-picker-container" style={{ top: `${pickerPosition.top}px`, left: `${pickerPosition.left}px` }}>
                    <EmojiPicker onEmojiClick={(emojiData) => onEmojiClick(emojiData, pickerVisibleFor)} autoFocusSearch={false} emojiStyle={EmojiStyle.NATIVE} height={350} width={300}/>
                 </div>
             )}
             
            {/* --- RENDER DELETE MODAL --- */}
            {showDeleteModal && (
                <DeleteMessageModal
                    onClose={() => setShowDeleteModal(false)}
                    onDeleteForMe={handleDeleteForMe}
                    onDeleteForEveryone={handleDeleteForEveryone}
                    canDeleteForEveryone={canDeleteForEveryone}
                    count={selectedMessages.size}
                />
            )}
            {/* ----------------------------- */}

            {/* Message Input (Disabled in selection mode) */}
            { !isInSelectionMode && (
                <MessageInput
                    chatId={chat?._id}
                    onMessageSent={(newMessage) => { setMessages((prev) => prev.some(m=>m._id===newMessage._id)?prev:[...prev, { ...newMessage, status: 'sent', reactions: new Map() }]); }}
                    socket={socket}
                />
            )}

            {/* Profile Modal */}
            {selectedProfile && ( <UserProfileModal user={selectedProfile} onClose={handleCloseModal} /> )}
        </div>
    );
};

// --- Context Menu Component (Helper) ---
const MessageContextMenu = ({ message, top, left, onClose, onDelete }) => {
    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, [onClose]);

    const handleDelete = () => {
        onDelete(message._id);
        onClose();
    };

    return (
        <div ref={menuRef} className="context-menu" style={{ position: 'fixed', top: `${top}px`, left: `${left}px`, zIndex: 1200 }}>
            <div className="menu-option">Reply</div>
            <div className="menu-option delete-option" onClick={handleDelete}>
                Delete Message
            </div>
        </div>
    );
};

// --- NEW HELPER COMPONENT (Modal) ---
const DeleteMessageModal = ({ onClose, onDeleteForMe, onDeleteForEveryone, canDeleteForEveryone, count }) => {
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
                <h4>Delete {count} message(s)?</h4>
                
                {canDeleteForEveryone && (
                    <button className="delete-modal-btn delete-everyone" onClick={onDeleteForEveryone}>
                        Delete for Everyone
                    </button>
                )}
                
                <button className="delete-modal-btn" onClick={onDeleteForMe}>
                    Delete for Me
                </button>

                <button className="delete-modal-btn cancel" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};
// ----------------------------------------

export default ChatWindow;





