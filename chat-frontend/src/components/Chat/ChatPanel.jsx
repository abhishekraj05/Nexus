// // src/components/Chat/ChatPanel.jsx
// import React, { useState } from 'react';
// import ChatList from './ChatList';
// // Sahi import path ka istemaal karein (ArchivedChatList aapke Chat folder mein hona chahiye)
// import ArchivedChatList from '../FriendSystem/ArchivedChatList';

// // --- !! APNA CHAT WINDOW COMPONENT IMPORT KAREIN !! ---
// // Yeh maan raha hoon ki aapke paas Chat/ChatWindow.jsx hai
// import ChatWindow from './ChatWindow'; 

// // "Back" button ke liye ek simple icon
// const BackIcon = () => (
//   <svg fill="currentColor" viewBox="0 0 20 20" style={{width: '1.25rem', height: '1.25rem', color: 'white'}}>
//     <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
//   </svg>
// );


// export default function ChatPanel({ onSelectChat, selectedChat, onlineStatuses }) {
    
//     // --- 1. Chat List Logic (Yeh pehle jaisa hi hai) ---
//     const [activeTab, setActiveTab] = useState("chats");
//     const [refreshChatListKey, setRefreshChatListKey] = useState(0);
//     const [refreshArchivedListKey, setRefreshArchivedListKey] = useState(0);
    
//     const handleUnarchiveSuccess = () => { 
//         setRefreshChatListKey(prev => prev + 1);
//         setActiveTab("chats");
//     };
//     const handleArchiveSuccess = () => { 
//         setRefreshArchivedListKey(prev => prev + 1);
//     };

//     // --- 2. NAYA LOGIC: Chat Window Dikhane Ke Liye ---
//     // Agar 'selectedChat' (MainLayout se) null nahi hai, toh ChatWindow dikhayein
//     if (selectedChat) {
//         return (
//             <div className="chat-panel">
//                 {/* Chat Window ka Header */}
//                 <div className="chat-panel-header chat-window-header">
//                     {/* Yeh Back Button 'selectedChat' ko wapas null kar dega */}
//                     <button onClick={() => onSelectChat(null)} className="chat-back-button">
//                         <BackIcon />
//                     </button>
//                     <h3>{selectedChat.name || 'Chat'}</h3>
//                 </div>

//                 {/* Chat Window ka Content */}
//                 <div className="chat-panel-content no-padding">
//                     <ChatWindow
//                         chat={selectedChat}
//                         onlineStatus={onlineStatuses[selectedChat.id]}
//                         // Aapko ChatWindow.jsx ko adjust karna pad sakta hai
//                     />
//                 </div>
//             </div>
//         );
//     }

//     // --- 3. PURAANA LOGIC: Chat List Dikhane Ke Liye ---
//     // Agar 'selectedChat' null hai, toh list dikhayein
//     return (
//         <div className="chat-panel">
//             {/* List Header */}
//             <div className="chat-panel-header">
//                 <h3>Messages</h3>
//             </div>
            
//             {/* Tabs */}
//             <div className="chat-panel-tabs">
//                 <button
//                     onClick={() => setActiveTab("chats")}
//                     className={`chat-panel-tab ${activeTab === "chats" ? "active" : ""}`}
//                 >
//                     Chats
//                 </button>
//                 <button
//                     onClick={() => setActiveTab("archived")}
//                     className={`chat-panel-tab ${activeTab === "archived" ? "active" : ""}`}
//                 >
//                     Archived
//                 </button>
//             </div>
            
//             {/* List Content */}
//             <div className="chat-panel-content">
//                 {activeTab === "chats" && (
//                     <ChatList
//                         onSelectChat={onSelectChat} // Yeh handleSelectChat ko call karega
//                         selectedChat={selectedChat}
//                         onlineStatuses={onlineStatuses}
//                         key={refreshChatListKey}
//                         onArchiveSuccess={handleArchiveSuccess}
//                     />
//                 )}
//                 {activeTab === "archived" && (
//                     <ArchivedChatList
//                         onUnarchiveSuccess={handleUnarchiveSuccess}
//                         key={refreshArchivedListKey}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// }














// src/components/Chat/ChatPanel.jsx
import React, { useState } from 'react';
import ChatList from './ChatList';
import ArchivedChatList from '../FriendSystem/ArchivedChatList'; // Path check karlena agar error aaye
// import ArchivedChatList from './ArchivedChatList'; 

// !! IMPORTANT: Aapki file ka naam ChatBox.jsx hai
import ChatBox from './ChatBox'; 

// 'socket' prop receive karein
export default function ChatPanel({ onSelectChat, selectedChat, onlineStatuses, socket }) {
    
    const [activeTab, setActiveTab] = useState("chats");
    const [refreshChatListKey, setRefreshChatListKey] = useState(0);
    const [refreshArchivedListKey, setRefreshArchivedListKey] = useState(0);

    const handleUnarchiveSuccess = () => { 
        setRefreshChatListKey(prev => prev + 1); 
        setActiveTab("chats");
    };

    const handleArchiveSuccess = () => { 
        setRefreshArchivedListKey(prev => prev + 1);
    };

    const panelClass = selectedChat ? "chat-panel expanded" : "chat-panel";

    // --- CHAT OPEN LOGIC ---
    if (selectedChat) {
        return (
            <div className={panelClass}>
                <div className="chat-panel-header chat-window-header">
                    {/* Back Button */}
                    <button 
                        onClick={() => onSelectChat(null)} 
                        style={{background:'none', border:'none', color:'white', cursor:'pointer', fontSize:'1.2rem', marginRight:'10px'}}
                    >
                        ←
                    </button>
                    <h3>{selectedChat.name || 'Chat'}</h3>
                </div>

                <div className="chat-panel-content no-padding"    style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    
                    {/* --- PASS SOCKET TO CHATBOX --- */}
                    <ChatBox
                        key={selectedChat._id} // Key zaroori hai taaki chat change hone par refresh ho
                        chat={selectedChat}
                        socket={socket} // <-- Socket yahaan pass ho raha hai
                        onlineStatuses={onlineStatuses} 
                    />

                </div>
            </div>
        );
    }

    // --- LIST LOGIC ---
    return (
        <div className={panelClass}>
            <div className="chat-panel-header">
                <h3>Messages</h3>
            </div>
            
            <div className="chat-panel-tabs">
                <button onClick={() => setActiveTab("chats")} className={`chat-panel-tab ${activeTab === "chats" ? "active" : ""}`}>Chats</button>
                <button onClick={() => setActiveTab("archived")} className={`chat-panel-tab ${activeTab === "archived" ? "active" : ""}`}>Archived</button>
            </div>
            
            <div className="chat-panel-content">
                {activeTab === "chats" && (
                    <ChatList
                        onSelectChat={onSelectChat}
                        selectedChat={selectedChat}
                        onlineStatuses={onlineStatuses}
                        key={refreshChatListKey}
                        onArchiveSuccess={handleArchiveSuccess}
                    />
                )}
                {activeTab === "archived" && (
                    <ArchivedChatList
                        onUnarchiveSuccess={handleUnarchiveSuccess}
                        key={refreshArchivedListKey}
                    />
                )}
            </div>
        </div>
    );
}