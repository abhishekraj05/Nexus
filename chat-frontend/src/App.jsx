// // src/App.jsx
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // BrowserRouter aur Navigate import karein
// import { useContext } from "react";
// import { AuthContext } from "./context/AuthContext";

// // Components ko import karein
// import Login from "./components/Auth/Login";
// import Register from "./components/Auth/Register";
// import ChatPage from "./pages/ChatPage";
// import Profile from "./pages/Profile"; // Profile page import karein
// import PrivateRoute from "./components/Auth/PrivateRoute"; // Naya PrivateRoute import karein

// function App() {
//   const { user } = useContext(AuthContext);

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public Routes (Login/Register) */}
//         <Route path="/login" element={user ? <Navigate to="/chat" /> : <Login />} />
//         <Route path="/register" element={user ? <Navigate to="/chat" /> : <Register />} />

//         {/* --- Protected Routes --- */}
//         {/* PrivateRoute check karega, agar user hai toh child (ChatPage/Profile) dikhayega */}
//         <Route element={<PrivateRoute />}>
//           <Route path="/chat" element={<ChatPage />} />
//           <Route path="/profile" element={<Profile />} />
//         </Route>
//         {/* ------------------------ */}

//         {/* Default Route */}
//         {/* Agar user '/' par jaaye, toh use /chat (agar logged in hai) ya /login (agar nahi) bhej dein */}
//         <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} replace />} />

//         {/* Koi aur galat URL daale toh login par bhej dein */}
//         <Route path="*" element={<Navigate to="/login" replace />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;





// // src/App.jsx
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useContext } from "react";

// // --- 1. Sabhi Providers aur Components ko import karein ---
// import { AuthContext, AuthProvider } from "./context/AuthContext";
// import { SocketProvider } from "./context/SocketContext";

// import Login from "./components/Auth/Login";
// import Register from "./components/Auth/Register";
// import ChatPage from "./pages/ChatPage";
// import Profile from "./pages/Profile";
// import PrivateRoute from "./components/auth/PrivateRoute";
// // ----------------------------------------------------

// function App() {
//   const { user } = useContext(AuthContext);

//   return (
//     <BrowserRouter>
//       {/* 2. SocketProvider aur CallProvider ko Routes ke bahar rakhein */}
//       <SocketProvider>
//           <Routes>
//             {/* ... (Aapke saare routes waise hi) ... */}
//             <Route path="/login" element={user ? <Navigate to="/chat" /> : <Login />} />
//             <Route path="/register" element={user ? <Navigate to="/chat" /> : <Register />} />
//             <Route element={<PrivateRoute />}>
//               <Route path="/chat" element={<ChatPage />} />
//               <Route path="/profile" element={<Profile />} />
//             </Route>
//             <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} replace />} />
//             <Route path="*" element={<Navigate to="/login" replace />} />
//           </Routes>
//       </SocketProvider>
//     </BrowserRouter>
//   );
// }

// // --- 3. RootApp Component ---
// function RootApp() {
//   return (
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   );
// }

// export default RootApp;



// iske baad main.jsx me changing hai





// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Layouts aur Pages
import MainLayout from './components/Layout/MainContent/MainContent';// <-- Aapka naya layout component
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import NotFound from "./pages/NotFound"; // Ek 404 page (optional)

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Route 1: Login Page */}
      <Route path="/login" 
        element={user ? <Navigate to="/" /> : <Login />} 
      />
      
      {/* Route 2: Register Page */}
      <Route path="/register" 
        element={user ? <Navigate to="/" /> : <Register />} 
      />

      {/* Route 3: Main App (Protected) */}
      {/* Yeh saare routes (/, /friends, /profile) MainLayout ke andar khulenge */}
      <Route path="/*" 
        element={user ? <MainLayout /> : <Navigate to="/login" />} 
      />

      {/* Route 4: Catch-all (Optional) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;









































// import React, { useState } from 'react';

// // --- APNE COMPONENTS KO IMPORT KAREIN ---
// // (Ab zaroorat nahi, neeche dummy components hain)
// // import { AuthContext } from "./context/AuthContext";


// // --- DUMMY COMPONENT: ChatList ---
// // !! YAHAN APNA ASLI ChatList CODE PASTE KAREIN !!
// const ChatList = ({ onSelectChat, selectedChat, onlineStatuses, onArchiveSuccess }) => {
//     return (
//         <div className="chat-list-dummy">
//             <p>Aapka 'ChatList' component yahan aayega.</p>
//             {/* Placeholder Item */}
//             <div 
//                 className="chat-list-item"
//                 onClick={() => onSelectChat({ id: '1', name: 'chat_user_1' })}
//             >
//                 <img src="https://placehold.co/40x40/52525b/fafafa?text=C1" alt="Chat User" />
//                 <div>
//                     <div className="chat-list-item-name">chat_user_1</div>
//                     <div className="chat-list-item-msg">Okay, see you then...</div>
//                 </div>
//             </div>
//             <button onClick={onArchiveSuccess} className="dummy-button"> (Archive Test)</button>
//         </div>
//     );
// };

// // --- DUMMY COMPONENT: ArchivedChatList ---
// // !! YAHAN APNA ASLI ArchivedChatList CODE PASTE KAREIN !!
// const ArchivedChatList = ({ onUnarchiveSuccess }) => {
//     return (
//         <div className="chat-list-dummy">
//             <p>Aapka 'ArchivedChatList' component yahan aayega.</p>
//             {/* Placeholder Item */}
//             <div className="chat-list-item">
//                 <img src="https://placehold.co/40x40/52525b/fafafa?text=A1" alt="Chat User" />
//                 <div>
//                     <div className="chat-list-item-name">archived_user_1</div>
//                     <div className="chat-list-item-msg">Archived message...</div>
//                 </div>
//             </div>
//              <button onClick={onUnarchiveSuccess} className="dummy-button">(Unarchive Test)</button>
//         </div>
//     );
// };

// // --- DUMMY COMPONENT: FriendsList ---
// // !! YAHAN APNA ASLI FriendsList CODE PASTE KAREIN !!
// const FriendsList = ({ onlineStatuses }) => {
//     return (
//         <div className="dummy-tab-content">
//             <h3>My Friends</h3>
//             <p>Aapka 'FriendsList' component yahan aayega.</p>
//             {/* Placeholder Item */}
//             <div className="dummy-list-item">
//                 <img src="https://placehold.co/40x40/52525b/fafafa?text=F1" alt="Friend" />
//                 <span>friend_1</span>
//             </div>
//         </div>
//     );
// };

// // --- DUMMY COMPONENT: FindUsers ---
// // !! YAHAN APNA ASLI FindUsers CODE PASTE KAREIN !!
// const FindUsers = () => {
//     return (
//         <div className="dummy-tab-content">
//             <h3>Find Users</h3>
//             <p>Aapka 'FindUsers' component yahan aayega.</p>
//             {/* Placeholder Search */}
//             <input type="text" placeholder="Search for users..." className="dummy-search-input" />
//         </div>
//     );
// };

// // --- DUMMY COMPONENT: PendingRequests ---
// // !! YAHAN APNA ASLI PendingRequests CODE PASTE KAREIN !!
// const PendingRequests = () => {
//      return (
//         <div className="dummy-tab-content">
//             <h3>Pending Requests</h3>
//             <p>Aapka 'PendingRequests' component yahan aayega.</p>
//             {/* Placeholder Item */}
//             <div className="dummy-request-item">
//                 <div className="dummy-request-info">
//                     <img src="https://placehold.co/40x40/52525b/fafafa?text=R1" alt="Request" />
//                     <span>request_user_1</span>
//                 </div>
//                 <div>
//                     <button className="dummy-button-accept">Accept</button>
//                     <button className="dummy-button-decline">Decline</button>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- Icons (Inline SVGs for simplicity) ---
// // ... (Icons pehle jaise hi hain)
// const HomeIcon = () => (
//     <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
// );
// const SearchIcon = () => (
//     <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
// );
// const ReelsIcon = () => (
//     <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
// );
// const ProfileIcon = () => (
//     <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
// );
// const UsersIcon = () => (
//     <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6m6 3v-1a6 6 0 00-6-6h-1.5m-1.5-6a4 4 0 100 5.292m0 0a3 3 0 01-3 3m0 0a3 3 0 01-3-3m0 0a3 3 0 01-3 3"></path></svg>
// );
// const MoreIcon = () => (
//     <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
// );
// const ChatIcon = () => (
//     <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
// );


// // --- 1. Left Navigation Sidebar ---
// const LeftSidebar = ({ setActiveView }) => {
//     return (
//         <nav className="left-sidebar">
//             {/* Logo */}
//             <div className="logo-container">
//                 <h1 className="logo-full">MyWebApp</h1>
//                 <div className="logo-icon">M</div>
//             </div>

//             {/* Navigation Links */}
//             <ul className="nav-list">
//                 <NavItem icon={<HomeIcon />} text="Home" onClick={() => setActiveView('home')} />
//                 <NavItem icon={<SearchIcon />} text="Search" onClick={() => setActiveView('search')} />
//                 <NavItem icon={<UsersIcon />} text="Friends" onClick={() => setActiveView('friends')} />
//                 <NavItem icon={<ReelsIcon />} text="Reels" onClick={() => setActiveView('reels')} />
//                 <NavItem icon={<ProfileIcon />} text="Profile" onClick={() => setActiveView('profile')} />
//             </ul>

//             {/* More Options */}
//             <div className="nav-item more-item">
//                 <MoreIcon />
//                 <span className="nav-item-text">More</span>
//             </div>
//         </nav>
//     );
// };

// // Helper component for Nav Items
// const NavItem = ({ icon, text, onClick }) => {
//     return (
//         <li 
//             className="nav-item"
//             onClick={onClick}
//         >
//             {icon}
//             <span className="nav-item-text">{text}</span>
//         </li>
//     );
// };


// // --- 2. Main Content Area ---
// const MainContent = ({ activeView, onlineStatuses }) => {
//     return (
//         <main className="main-content">
//             {/* Content ko activeView ke basis par switch karein */}
//             {activeView === 'home' && <HomeView />}
//             {activeView === 'friends' && <FriendSystemView onlineStatuses={onlineStatuses} />}
//             {activeView === 'search' && <PlaceholderView pageName="Search" />}
//             {activeView === 'reels' && <PlaceholderView pageName="Reels" />}
//             {activeView === 'profile' && <PlaceholderView pageName="Profile" />}
//         </main>
//     );
// };

// // Home View (Feed + Suggestions)
// const HomeView = () => (
//     <div className="content-container home-view-grid">
//         {/* 2a. Center Feed Column */}
//         <div className="home-view-feed">
//             <UserFeedPlaceholder />
//         </div>
//         {/* 2b. Right Suggestions Column */}
//         <div className="home-view-suggestions">
//             <UserSuggestionsPlaceholder />
//         </div>
//     </div>
// );

// // Friend System View (Aapke Sidebar logic ko yahan move kiya gaya hai)
// const FriendSystemView = ({ onlineStatuses }) => {
//     const [activeTab, setActiveTab] = useState('friends');

//     return (
//         <div className="content-container friend-system-view">
//             {/* Tab Navigation */}
//             <div className="friend-system-tabs">
//                 <TabButton name="Friends" activeTab={activeTab} onClick={() => setActiveTab('friends')} />
//                 <TabButton name="Find Users" activeTab={activeTab} onClick={() => setActiveTab('find')} />
//                 <TabButton name="Requests" activeTab={activeTab} onClick={() => setActiveTab('requests')} />
//             </div>

//             {/* Content Area */}
//             <div className="friend-system-content">
//                 {activeTab === 'friends' && <FriendsList onlineStatuses={onlineStatuses} />}
//                 {activeTab === 'find' && <FindUsers />}
//                 {activeTab === 'requests' && <PendingRequests />}
//             </div>
//         </div>
//     );
// };

// // Helper component for Friend System Tabs
// const TabButton = ({ name, activeTab, onClick }) => (
//     <button
//         onClick={onClick}
//         className={`friend-system-tab ${activeTab === name.toLowerCase().replace(' ', '') ? 'active' : ''}`}
//     >
//         {name}
//     </button>
// );


// // Placeholder for other views
// const PlaceholderView = ({ pageName }) => (
//     <div className="content-container">
//         <h1>{pageName}</h1>
//         <p className="placeholder-subtitle">Yahan {pageName} ka content aayega.</p>
//     </div>
// );


// // Placeholder jahan aap apna feed component daalenge
// const UserFeedPlaceholder = () => (
//     <div>
//         <h2>Feed</h2>
//         {/* Placeholder Item 1 */}
//         <div className="placeholder-card">
//             <div className="placeholder-card-header">
//                 <img src="https://placehold.co/40x40/3f3f46/fafafa?text=User" alt="User" />
//                 <span>username</span>
//             </div>
//             <img src="https://placehold.co/600x400/3f3f46/fafafa?text=Post+Content" className="placeholder-card-image" alt="Post" />
//             <p>Aapka feed component yahan aayega...</p>
//         </div>
//     </div>
// );

// // Placeholder jahan aap apna suggestions component daalenge
// const UserSuggestionsPlaceholder = () => (
//     <div className="suggestions-container">
//         <h2>Suggested for you</h2>
//         <ul>
//             <li className="suggestion-item">
//                 <div className="suggestion-item-info">
//                     <img src="https://placehold.co/40x40/3f3f46/fafafa?text=S1" alt="Suggestion" />
//                     <span>suggested_user1</span>
//                 </div>
//                 <button>Follow</button>
//             </li>
//              <li className="suggestion-item">
//                 <div className="suggestion-item-info">
//                     <img src="https://placehold.co/40x40/3f3f46/fafafa?text=S2" alt="Suggestion" />
//                     <span>suggested_user2</span>
//                 </div>
//                 <button>Follow</button>
//             </li>
//         </ul>
//     </div>
// );


// // --- 4. Chat Panel (AAPKE CODE KE SAATH UPDATED) ---
// const ChatPanel = ({ onSelectChat, selectedChat, onlineStatuses }) => {
//     const [activeTab, setActiveTab] = useState("chats");
    
//     // Aapke Sidebar.jsx se archive/unarchive logic
//     const [refreshChatListKey, setRefreshChatListKey] = useState(0);
//     const [refreshArchivedListKey, setRefreshArchivedListKey] = useState(0);

//     const handleUnarchiveSuccess = () => {
//         setRefreshChatListKey(prev => prev + 1); 
//         setActiveTab("chats");
//     };

//     const handleArchiveSuccess = () => {
//         setRefreshArchivedListKey(prev => prev + 1);
//     };

//     return (
//         <div className="chat-panel">
//             {/* Chat Header */}
//             <div className="chat-panel-header">
//                 <h3>Messages</h3>
//             </div>
            
//             {/* Tab Navigation (Aapke Sidebar se inspired) */}
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
            
//             {/* Content Area - Renders the active tab's component */}
//             <div className="chat-panel-content">
//                 {activeTab === "chats" && (
//                     <ChatList
//                         onSelectChat={onSelectChat}
//                         selectedChat={selectedChat}
//                         onlineStatuses={onlineStatuses}
//                         key={refreshChatListKey} // Force refresh
//                         onArchiveSuccess={handleArchiveSuccess} // Pass archive callback
//                     />
//                 )}
//                 {activeTab === "archived" && (
//                     <ArchivedChatList
//                         onUnarchiveSuccess={handleUnarchiveSuccess}
//                         key={refreshArchivedListKey} // Force refresh
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };


// // --- Main App Component ---
// export default function App() {
//     // State to manage chat panel visibility
//     const [isChatOpen, setIsChatOpen] = useState(false);
    
//     // State for managing chat functionality
//     const [selectedChat, setSelectedChat] = useState(null);
//     const [onlineStatuses, setOnlineStatuses] = useState({}); // Placeholder

//     // State for managing the main content view
//     const [activeView, setActiveView] = useState('home'); // 'home', 'friends', 'search', etc.

//     const handleSelectChat = (chat) => {
//         setSelectedChat(chat);
//         setIsChatOpen(true); 
//     };

//     return (
//         <div className="app-container">
//             {/* YEH <style> TAG SAARI STYLING KO HANDLE KARTA HAI */}
//             <style>
//                 {`
//                     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    
//                     /* Basic Reset */
//                     * {
//                         box-sizing: border-box;
//                         margin: 0;
//                         padding: 0;
//                     }

//                     body, .app-container {
//                         font-family: 'Inter', sans-serif;
//                         background-color: #18181b; /* zinc-900 */
//                         color: white;
//                     }
                    
//                     h1 { font-size: 1.875rem; font-weight: 700; }
//                     h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; }
//                     h3 { font-size: 1.125rem; font-weight: 600; }

//                     .app-container {
//                         display: flex;
//                         height: 100vh;
//                     }
                    
//                     /* Scrollbar */
//                     ::-webkit-scrollbar {
//                         width: 5px;
//                         height: 5px;
//                     }
//                     ::-webkit-scrollbar-track {
//                         background: #27272a; /* zinc-800 */
//                     }
//                     ::-webkit-scrollbar-thumb {
//                         background: #52525b; /* zinc-600 */
//                         border-radius: 10px;
//                     }
//                     ::-webkit-scrollbar-thumb:hover {
//                         background: #71717a; /* zinc-500 */
//                     }

//                     /* --- Left Sidebar --- */
//                     .left-sidebar {
//                         width: 5rem; /* w-20 */
//                         position: fixed;
//                         top: 0;
//                         left: 0;
//                         height: 100%;
//                         background-color: #000;
//                         border-right: 1px solid #3f3f46; /* zinc-700 */
//                         padding: 1rem; /* p-4 */
//                         display: flex;
//                         flex-direction: column;
//                         align-items: center;
//                         z-index: 20;
//                     }
//                     .logo-container {
//                         width: 100%;
//                         margin-bottom: 2.5rem; /* mb-10 */
//                     }
//                     .logo-full { 
//                         display: none; 
//                         font-size: 1.5rem; 
//                         font-weight: 700; 
//                     }
//                     .logo-icon { 
//                         display: block; 
//                         font-size: 1.875rem; 
//                         font-weight: 700; 
//                         text-align: center;
//                     }
//                     .nav-list {
//                         list-style: none;
//                         display: flex;
//                         flex-direction: column;
//                         gap: 1rem; /* space-y-4 */
//                         width: 100%;
//                     }
//                     .nav-item {
//                         display: flex;
//                         align-items: center;
//                         gap: 1rem; /* space-x-4 */
//                         padding: 0.5rem; /* p-2 */
//                         border-radius: 0.5rem; /* rounded-lg */
//                         cursor: pointer;
//                         width: 100%;
//                     }
//                     .nav-item:hover {
//                         background-color: #27272a; /* zinc-800 */
//                     }
//                     .icon-svg {
//                         width: 1.5rem; /* w-6 */
//                         height: 1.5rem; /* h-6 */
//                         flex-shrink: 0;
//                     }
//                     .nav-item-text {
//                         display: none;
//                         font-size: 1.125rem; /* text-lg */
//                     }
//                     .more-item {
//                         margin-top: auto;
//                     }

//                     /* --- Main Content --- */
//                     .main-content {
//                         flex: 1;
//                         margin-left: 5rem; /* ml-20 */
//                         height: 100vh;
//                         overflow-y: auto;
//                     }
//                     .content-container {
//                         margin: 0 auto;
//                         padding: 2rem; /* p-8 */
//                     }
//                     .home-view-grid {
//                         max-width: 56rem; /* max-w-4xl */
//                         display: grid;
//                         grid-template-columns: 1fr;
//                         gap: 3rem; /* gap-12 */
//                     }
//                     .home-view-feed {
//                         /* takes full width on mobile */
//                     }
//                     .home-view-suggestions {
//                         display: none; /* hidden */
//                     }
                    
//                     /* --- Friend System View --- */
//                     .friend-system-view {
//                         max-width: 42rem; /* max-w-2xl */
//                     }
//                     .friend-system-tabs {
//                         display: flex;
//                         gap: 0.5rem; /* space-x-2 */
//                         border-bottom: 1px solid #3f3f46; /* zinc-700 */
//                         margin-bottom: 1rem; /* mb-4 */
//                     }
//                     .friend-system-tab {
//                         padding: 0.5rem 1rem; /* py-2 px-4 */
//                         font-weight: 500;
//                         color: #a1a1aa; /* text-zinc-400 */
//                         cursor: pointer;
//                         background: none;
//                         border: none;
//                     }
//                     .friend-system-tab:hover {
//                         color: white;
//                     }
//                     .friend-system-tab.active {
//                         border-bottom: 2px solid white;
//                         color: white;
//                     }
//                     .friend-system-content {
//                         background-color: #000;
//                         border: 1px solid #3f3f46; /* zinc-700 */
//                         border-radius: 0.5rem; /* rounded-lg */
//                     }

//                     /* --- Placeholders --- */
//                     .placeholder-subtitle {
//                         color: #a1a1aa; /* zinc-400 */
//                         margin-top: 0.5rem;
//                     }
//                     .placeholder-card {
//                         background-color: #000;
//                         border: 1px solid #3f3f46; /* zinc-700 */
//                         border-radius: 0.5rem; /* rounded-lg */
//                         padding: 1rem; /* p-4 */
//                     }
//                     .placeholder-card-header {
//                         display: flex;
//                         align-items: center;
//                         gap: 0.75rem; /* space-x-3 */
//                         margin-bottom: 0.75rem; /* mb-3 */
//                     }
//                     .placeholder-card-header img {
//                         width: 2.5rem;
//                         height: 2.5rem;
//                         border-radius: 9999px;
//                     }
//                     .placeholder-card-header span {
//                         font-weight: 600;
//                     }
//                     .placeholder-card-image {
//                         width: 100%;
//                         border-radius: 0.5rem; /* rounded-lg */
//                     }
//                     .placeholder-card p {
//                         margin-top: 0.75rem; /* mt-3 */
//                     }

//                     .suggestions-container h2 {
//                         color: #a1a1aa; /* zinc-400 */
//                     }
//                     .suggestions-container ul {
//                         list-style: none;
//                         display: flex;
//                         flex-direction: column;
//                         gap: 0.75rem; /* space-y-3 */
//                     }
//                     .suggestion-item {
//                         display: flex;
//                         align-items: center;
//                         justify-content: space-between;
//                     }
//                     .suggestion-item-info {
//                         display: flex;
//                         align-items: center;
//                         gap: 0.75rem; /* space-x-3 */
//                     }
//                     .suggestion-item-info img {
//                         width: 2.5rem;
//                         height: 2.5rem;
//                         border-radius: 9999px;
//                     }
//                     .suggestion-item button {
//                         color: #3b82f6; /* text-blue-500 */
//                         font-weight: 600;
//                         font-size: 0.875rem;
//                         background: none;
//                         border: none;
//                         cursor: pointer;
//                     }

//                     /* --- Chat Toggle Button --- */
//                     .chat-toggle-button {
//                         position: fixed;
//                         bottom: 1.5rem; /* bottom-6 */
//                         right: 1.5rem; /* right-6 */
//                         background-color: #2563eb; /* bg-blue-600 */
//                         color: white;
//                         padding: 1rem; /* p-4 */
//                         border-radius: 9999px; /* rounded-full */
//                         box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); /* shadow-lg */
//                         z-index: 30;
//                         cursor: pointer;
//                         transition: all 0.3s;
//                         border: none;
//                     }
//                     .chat-toggle-button:hover {
//                         background-color: #1d4ed8; /* hover:bg-blue-700 */
//                     }

//                     /* --- Chat Panel --- */
//                     .chat-panel {
//                         position: fixed;
//                         bottom: 6rem; /* bottom-24 */
//                         right: 1.5rem; /* right-6 */
//                         width: 20rem; /* w-80 */
//                         height: 450px;
//                         background-color: #27272a; /* zinc-800 */
//                         border: 1px solid #3f3f46; /* zinc-700 */
//                         border-radius: 0.75rem; /* rounded-xl */
//                         box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); /* shadow-xl */
//                         display: flex;
//                         flex-direction: column;
//                         z-index: 30;
//                     }
//                     .chat-panel-header {
//                         padding: 1rem; /* p-4 */
//                         border-bottom: 1px solid #3f3f46; /* zinc-700 */
//                     }
//                     .chat-panel-header h3 {
//                         font-size: 1.125rem; /* text-lg */
//                         font-weight: 600;
//                         text-align: center;
//                     }
//                     .chat-panel-tabs {
//                         display: flex;
//                         padding: 0.25rem; /* p-1 */
//                         background-color: #18181b; /* zinc-900 */
//                     }
//                     .chat-panel-tab {
//                         flex: 1;
//                         padding: 0.5rem; /* p-2 */
//                         font-size: 0.875rem; /* text-sm */
//                         font-weight: 500;
//                         border-radius: 0.25rem; /* rounded */
//                         color: #a1a1aa; /* text-zinc-400 */
//                         cursor: pointer;
//                         background: none;
//                         border: none;
//                     }
//                     .chat-panel-tab:hover {
//                         background-color: #27272a; /* hover:bg-zinc-800 */
//                     }
//                     .chat-panel-tab.active {
//                         background-color: #3f3f46; /* bg-zinc-700 */
//                         color: white;
//                     }
//                     .chat-panel-content {
//                         flex: 1;
//                         overflow-y: auto;
//                         scrollbar-width: thin;
//                     }

//                     /* --- Dummy Component Styles --- */
//                     .chat-list-dummy {
//                         padding: 0.5rem;
//                         display: flex;
//                         flex-direction: column;
//                         gap: 0.5rem;
//                     }
//                     .chat-list-dummy p {
//                         color: #a1a1aa;
//                         font-size: 0.875rem;
//                         padding: 1rem;
//                         text-align: center;
//                     }
//                     .chat-list-item {
//                         display: flex;
//                         align-items: center;
//                         gap: 0.75rem;
//                         padding: 0.5rem;
//                         border-radius: 0.5rem;
//                         cursor: pointer;
//                     }
//                     .chat-list-item:hover {
//                         background-color: #3f3f46; /* zinc-700 */
//                     }
//                     .chat-list-item img {
//                         width: 2.5rem;
//                         height: 2.5rem;
//                         border-radius: 9999px;
//                     }
//                     .chat-list-item-name {
//                         font-weight: 600;
//                     }
//                     .chat-list-item-msg {
//                         font-size: 0.875rem;
//                         color: #a1a1aa;
//                     }
//                     .dummy-button {
//                         font-size: 0.75rem;
//                         color: #60a5fa; /* blue-400 */
//                         padding: 0.5rem;
//                         background: none;
//                         border: none;
//                         cursor: pointer;
//                         text-align: left;
//                     }

//                     .dummy-tab-content {
//                         padding: 1rem;
//                     }
//                     .dummy-tab-content h3 {
//                         margin-bottom: 0.75rem;
//                     }
//                     .dummy-tab-content p {
//                         color: #a1a1aa;
//                         font-size: 0.875rem;
//                         margin-bottom: 1rem;
//                     }
//                     .dummy-list-item {
//                         display: flex;
//                         align-items: center;
//                         gap: 0.75rem;
//                         padding: 0.5rem;
//                         border-radius: 0.5rem;
//                     }
//                     .dummy-list-item:hover {
//                         background-color: #27272a;
//                     }
//                     .dummy-list-item img {
//                         width: 2.5rem;
//                         height: 2.5rem;
//                         border-radius: 9999px;
//                     }
//                     .dummy-search-input {
//                         width: 100%;
//                         padding: 0.5rem;
//                         border-radius: 0.25rem;
//                         background-color: #3f3f46;
//                         border: 1px solid #52525b;
//                         color: white;
//                     }
//                     .dummy-request-item {
//                         display: flex;
//                         align-items: center;
//                         justify-content: space-between;
//                         padding: 0.5rem;
//                         border-radius: 0.5rem;
//                     }
//                     .dummy-request-item:hover {
//                          background-color: #27272a;
//                     }
//                     .dummy-request-info {
//                         display: flex;
//                         align-items: center;
//                         gap: 0.75rem;
//                     }
//                     .dummy-request-info img {
//                         width: 2.5rem;
//                         height: 2.5rem;
//                         border-radius: 9999px;
//                     }
//                     .dummy-button-accept {
//                         font-size: 0.75rem;
//                         background-color: #2563eb;
//                         color: white;
//                         padding: 0.25rem 0.5rem;
//                         border: none;
//                         border-radius: 0.25rem;
//                         cursor: pointer;
//                     }
//                     .dummy-button-decline {
//                         font-size: 0.75rem;
//                         background-color: #52525b;
//                         color: white;
//                         padding: 0.25rem 0.5rem;
//                         border: none;
//                         border-radius: 0.25rem;
//                         cursor: pointer;
//                         margin-left: 0.5rem;
//                     }


//                     /* Responsive (Desktop) */
//                     @media (min-width: 1024px) { /* lg: */
//                         .left-sidebar {
//                             width: 16rem; /* w-64 */
//                             padding: 1.5rem; /* p-6 */
//                             align-items: flex-start;
//                         }
//                         .logo-full { display: block; }
//                         .logo-icon { display: none; }
//                         .nav-item-text { display: block; }

//                         .main-content {
//                             margin-left: 16rem; /* ml-64 */
//                         }

//                         .home-view-grid {
//                             grid-template-columns: repeat(3, 1fr);
//                         }
//                         .home-view-feed { 
//                             grid-column: span 2 / span 2; 
//                         }
//                         .home-view-suggestions { 
//                             display: block; 
//                             grid-column: span 1 / span 1; 
//                         }
//                     }
//                 `}
//             </style>
            
//             {/* 1. Left Sidebar */}
//             <LeftSidebar setActiveView={setActiveView} />

//             {/* 2. Main Content (Ab activeView par depend karta hai) */}
//             <MainContent activeView={activeView} onlineStatuses={onlineStatuses} />

//             {/* 3. Chat Toggle Button */}
//             <button 
//                 id="chat-toggle" 
//                 className="chat-toggle-button"
//                 onClick={() => setIsChatOpen(!isChatOpen)}
//             >
//                 <ChatIcon />
//             </button>

//             {/* 4. Chat Panel (Conditionally rendered with props) */}
//             {isChatOpen && (
//                 <ChatPanel 
//                     onSelectChat={handleSelectChat}
//                     selectedChat={selectedChat}
//                     onlineStatuses={onlineStatuses}
//                 />
//             )}

//         </div>
//     );
// }