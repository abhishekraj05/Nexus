// import React, { useState, useContext, useEffect } from 'react'; // useRef hata diya
// import { Routes, Route } from 'react-router-dom';
// import { io } from "socket.io-client"; 
// import API from "../../../api/api"; 

// // Context
// import { AuthContext } from "../../../context/AuthContext";

// // Components
// import LeftSidebar from '../LeftSidebar/LeftSidebar';
// import ChatPanel from '../../Chat/ChatPanel';
// import { ChatIcon } from '../../UI/Icons';

// // Pages
// import HomeView from '../../Home/HomeView';
// import FriendSystemView from '../../FriendSystem/FriendSystemView';
// import PendingRequests from '../../FriendSystem/PendingRequests';

// import PlaceholderView from '../../UI/PlaceholderView';
// import Profile from '../../../pages/Profile';
// import CreatePostModal from '../../Home/CreatePostModal';

// export default function MainLayout() {
//   const { user } = useContext(AuthContext);

//   // --- States ---
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [onlineStatuses, setOnlineStatuses] = useState({});
  
//   // --- !! CHANGE: Socket ko State mein rakha !! ---
//   // Taaki jab connect ho, toh poora layout refresh ho aur ChatPanel ko socket mile
//   const [socket, setSocket] = useState(null);

//   // --- SOCKET & API LOGIC (Aapke purane code se copy kiya hai) ---
//   useEffect(() => {
//     if (user) {
//         const socketEndpoint = import.meta.env.VITE_SOCKET_ENDPOINT || "http://localhost:5000";
//         console.log("[MainLayout] Connecting to socket at:", socketEndpoint);
        
//         // 1. Socket Connect
//         const newSocket = io(socketEndpoint);
        
//         // 2. State set karein (Yeh sabse zaroori line hai)
//         setSocket(newSocket);

//         // 3. Setup Emit
//         newSocket.emit("setup", user._id);
//         console.log(`[MainLayout] Emitted 'setup' for user: ${user._id}`);

//         // 4. Initial Status Fetch
//         const fetchInitialStatuses = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 const res = await API.get("/friends/statuses", {
//                      headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setOnlineStatuses(prev => ({ ...prev, ...res.data }));
//             } catch (error) {
//                 console.error("[MainLayout] Error fetching statuses:", error);
//             }
//         };
//         fetchInitialStatuses();

//         // 5. Listeners
//         newSocket.on("user_online", ({ userId }) => {
//             setOnlineStatuses(prev => ({ ...prev, [userId]: true }));
//         });

//         newSocket.on("user_offline", ({ userId, lastSeen }) => {
//             setOnlineStatuses(prev => ({ ...prev, [userId]: lastSeen }));
//         });

//         // Cleanup
//         return () => {
//             newSocket.disconnect();
//         };
//     }
//   }, [user]);

//   const handleSelectChat = (chat) => {
//     setSelectedChat(chat);
//     setIsChatOpen(true); 
//   };

//   return (
//     <div className="app-container">
//       <LeftSidebar /> 

//       <main className="main-content">
//         <Routes>
//           <Route path="/" element={<HomeView />} />
//           <Route path="/friends" element={<FriendSystemView onlineStatuses={onlineStatuses} />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/request" element={<PendingRequests />} />
//           <Route path="/search" element={<PlaceholderView pageName="Search" />} />
//           <Route path="/reels" element={<PlaceholderView pageName="Reels" />} />
//           <Route path="/post" element={<CreatePostModal pageName="post" />} />
//           <Route index element={<HomeView />} />
//         </Routes>
//       </main>

//       <button 
//         id="chat-toggle" 
//         className="chat-toggle-button"
//         onClick={() => setIsChatOpen(!isChatOpen)}
//       >
//         <ChatIcon />
//       </button>

//       {/* --- PASS SOCKET TO CHAT PANEL --- */}
//       {/* Ab socket 'null' nahi hoga connect hone ke baad */}
//       {isChatOpen && (
//         <ChatPanel 
//           onSelectChat={handleSelectChat}
//           selectedChat={selectedChat}
//           onlineStatuses={onlineStatuses}
//           socket={socket} // <-- Yahan pass kiya
//         />
//       )}
//     </div>
//   );
// }



import React, { useState, useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { io } from "socket.io-client"; 
import API from "../../../api/api"; 

// Context
import { AuthContext } from "../../../context/AuthContext";

// Components
import LeftSidebar from '../LeftSidebar/LeftSidebar';
import ChatPanel from '../../Chat/ChatPanel';
import { ChatIcon } from '../../UI/Icons';
import CreatePostModal from '../../Home/CreatePostModal'; // Modal Import

// Pages
import HomeView from '../../Home/HomeView';
import FriendSystemView from '../../FriendSystem/FriendSystemView';
import PendingRequests from '../../FriendSystem/PendingRequests';
import PlaceholderView from '../../UI/PlaceholderView';
import Profile from '../../../pages/Profile';
import Reels from '../../Reels/ReelsPage';

export default function MainLayout() {
  const { user } = useContext(AuthContext);

  // --- States ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [onlineStatuses, setOnlineStatuses] = useState({});
  const [socket, setSocket] = useState(null);

  // 👇 New States for Post Creation
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [refreshFeedTrigger, setRefreshFeedTrigger] = useState(0); // Feed refresh counter

  // --- SOCKET LOGIC (Same as before) ---
  useEffect(() => {
    if (user) {
        const socketEndpoint = import.meta.env.VITE_SOCKET_ENDPOINT || "http://localhost:5000";
        const newSocket = io(socketEndpoint);
        setSocket(newSocket);
        newSocket.emit("setup", user._id);

        const fetchInitialStatuses = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await API.get("/friends/statuses", {
                      headers: { Authorization: `Bearer ${token}` }
                });
                setOnlineStatuses(prev => ({ ...prev, ...res.data }));
            } catch (error) { console.error(error); }
        };
        fetchInitialStatuses();

        newSocket.on("user_online", ({ userId }) => setOnlineStatuses(prev => ({ ...prev, [userId]: true })));
        newSocket.on("user_offline", ({ userId, lastSeen }) => setOnlineStatuses(prev => ({ ...prev, [userId]: lastSeen })));

        return () => { newSocket.disconnect(); };
    }
  }, [user]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setIsChatOpen(true); 
  };

  // 👇 Jab Post success ho jaye
  const handlePostSuccess = () => {
      setCreateModalOpen(false); // Modal band
      setRefreshFeedTrigger(prev => prev + 1); // Feed ko signal bhejo
  };

  return (
    <div className="app-container">
      
      {/* LeftSidebar ko function pass kiya taaki wo modal khol sake */}
      <LeftSidebar onCreateClick={() => setCreateModalOpen(true)} /> 

      <main className="main-content">
        <Routes>
          {/* 👇 HomeView ko refreshSignal pass kiya */}
          <Route path="/" element={<HomeView refreshSignal={refreshFeedTrigger} />} />
          
          <Route path="/friends" element={<FriendSystemView onlineStatuses={onlineStatuses} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/request" element={<PendingRequests />} />
          <Route path="/search" element={<PlaceholderView pageName="Search" />} />
          <Route path="/reels" element={<Reels pageName="Reels" />} />
          
          {/* <Route path="/post" ... /> <-- ISKO HATA DO, AB MODAL USE HOGA */}
          
          <Route index element={<HomeView refreshSignal={refreshFeedTrigger} />} />
        </Routes>
      </main>

      {/* --- CHAT BUTTON & PANEL --- */}
      <button id="chat-toggle" className="chat-toggle-button" onClick={() => setIsChatOpen(!isChatOpen)}>
        <ChatIcon />
      </button>

      {isChatOpen && (
        <ChatPanel 
          onSelectChat={handleSelectChat}
          selectedChat={selectedChat}
          onlineStatuses={onlineStatuses}
          socket={socket}
        />
      )}

      {/* 👇 CREATE POST MODAL (Global Overlay) */}
      {isCreateModalOpen && (
          <CreatePostModal 
              onClose={() => setCreateModalOpen(false)}
              onPostSuccess={handlePostSuccess}
          />
      )}
    </div>
  );
}