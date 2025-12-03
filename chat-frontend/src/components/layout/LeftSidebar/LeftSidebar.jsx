// // src/components/Layout/LeftSidebar/LeftSidebar.jsx
// import React from 'react';
// import { Link, useLocation } from 'react-router-dom'; // <-- Link import karein
// import {
//     HomeIcon,
//     SearchIcon,
//     UsersIcon,
//     ReelsIcon,
//     ProfileIcon,
//     MoreIcon
// } from '../../UI/Icons';
// import { IoAddCircleOutline } from 'react-icons/io5';


// // NavItem ko update karein
// const NavItem = ({ icon, text, to }) => {
//   const location = useLocation();
//   const isActive = location.pathname === to;
//   //  if (to !== '/') {
//   //     // Check if current path starts with the link's path (e.g., /friends/profile -> /friends ko activate karega)
//   //     isActive = location.pathname.startsWith(to);
//   // }


//   return (
//     <li>
//       {/* 'onClick' ki jagah 'Link' component ka istemaal karein */}
//       <Link 
//         to={to} 
//         // Active class style ke liye (optional)
//         className={`nav-item ${isActive ? 'nav-item-active' : ''}`} 
//       >
//         {icon}
//         <span className="nav-item-text">{text}</span>
//       </Link>
//     </li>
//   );
// };

// // Main Sidebar Component
// // Isko ab 'setActiveView' prop ki zaroorat nahi hai
// export default function LeftSidebar() {
//     return (
//         <nav className="left-sidebar">
//             <div className="logo-container">
//                 <h1 className="logo-full">MyWebApp</h1>
//                 <div className="logo-icon">M</div>
//             </div>

//             <ul className="nav-list">
//                 {/* 'onClick' ki jagah 'to' prop pass karein */}
//                 <NavItem icon={<HomeIcon />} text="Home" to="/" />
//                 <NavItem icon={<SearchIcon />} text="Search" to="/search" />
//                 <NavItem icon={<UsersIcon />} text="Friends" to="/friends" />
//                 <NavItem icon={<UsersIcon />} text="Request" to="/request" />
//                 <NavItem icon={<ReelsIcon />} text="Reels" to="/reels" />
//                 <NavItem icon={<IoAddCircleOutline />} text="Create" to="/post" />
//                 <NavItem icon={<ProfileIcon />} text="Profile" to="/profile" />

//             </ul>

//             <div className="nav-item more-item">
//                 <MoreIcon />
//                 <span className="nav-item-text">More</span>
//             </div>
//         </nav>
//     );
// };



// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import {
//     HomeIcon,
//     SearchIcon,
//     UsersIcon,
//     ReelsIcon,
//     ProfileIcon,
//     MoreIcon
// } from '../../UI/Icons';
// import { IoAddCircleOutline } from 'react-icons/io5';
// import ShareProfileModal from './ShareProfileModal';

// // --- NavItem Component (Updated) ---
// const NavItem = ({ icon, text, to, onClick }) => {
//   const location = useLocation();
  
//   // Agar 'to' prop hai tabhi active check karo
//   const isActive = to ? location.pathname === to : false;

//   return (
//     <li>
//       {/* Agar onClick hai (Create button), toh div/button banao */}
//       {onClick ? (
//           <div 
//             className="nav-item" 
//             onClick={onClick} 
//             style={{ cursor: 'pointer' }}
//           >
//             {icon}
//             <span className="nav-item-text">{text}</span>
//           </div>
//       ) : (
//           // Agar 'to' hai, toh Link banao
//           <Link 
//             to={to} 
//             className={`nav-item ${isActive ? 'nav-item-active' : ''}`} 
//           >
//             {icon}
//             <span className="nav-item-text">{text}</span>
//           </Link>
//       )}
//     </li>
//   );
// };

// // --- Main Sidebar Component ---
// // Ab ye Parent se 'onCreateClick' prop lega
// export default function LeftSidebar({ onCreateClick }) {
//     return (
//         <nav className="left-sidebar">
//             <div className="logo-container">
//                 <h1 className="logo-full">MyWebApp</h1>
//                 <div className="logo-icon">M</div>
//             </div>

//             <ul className="nav-list">
//                 <NavItem icon={<HomeIcon />} text="Home" to="/" />
//                 <NavItem icon={<SearchIcon />} text="Search" to="/search" />
//                 <NavItem icon={<UsersIcon />} text="Friends" to="/friends" />
//                 <NavItem icon={<UsersIcon />} text="Request" to="/request" />
//                 <NavItem icon={<ReelsIcon />} text="Reels" to="/reels" />
                
//                 {/* 👇 LINK HATA DIYA, Button bana diya */}
//                 <NavItem 
//                     icon={<IoAddCircleOutline size={24} />} 
//                     text="Create" 
//                     onClick={onCreateClick} 
//                 />
                
//                 <NavItem icon={<ProfileIcon />} text="Profile" to="/profile" />
//             </ul>

//             <div className="nav-item more-item">
//                 <MoreIcon />
//                 <span className="nav-item-text">More</span>
//             </div>

//         {/* <div className="nav-item more-item" onClick={() => setShowShare(true)}>
//             <MoreIcon />
//          <span className="nav-item-text">Share Profile</span>
//       </div> */}

      
//       {/* {showShare && <ShareProfileModal onClose={() => setShowShare(false)} />} */}
//         </nav>
//     );
// };









import React, { useState } from 'react'; // ✅ useState add kiya
import { Link, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    SearchIcon,
    UsersIcon,
    ReelsIcon,
    ProfileIcon,
    MoreIcon
} from '../../UI/Icons';
import { IoAddCircleOutline } from 'react-icons/io5';

// 👇 Ye dono components import karna mat bhulna (Path check karlena)
import ShareProfileModal from './ShareProfileModal';
import MoreOptionsModal from './MoreOptionsModal'; 

// --- NavItem Component (Updated) ---
const NavItem = ({ icon, text, to, onClick }) => {
  const location = useLocation();
  
  // Agar 'to' prop hai tabhi active check karo
  const isActive = to ? location.pathname === to : false;

  return (
    <li>
      {/* Agar onClick hai (Create button), toh div/button banao */}
      {onClick ? (
          <div 
            className="nav-item" 
            onClick={onClick} 
            style={{ cursor: 'pointer' }}
          >
            {icon}
            <span className="nav-item-text">{text}</span>
          </div>
      ) : (
          // Agar 'to' hai, toh Link banao
          <Link 
            to={to} 
            className={`nav-item ${isActive ? 'nav-item-active' : ''}`} 
          >
            {icon}
            <span className="nav-item-text">{text}</span>
          </Link>
      )}
    </li>
  );
};

// --- Main Sidebar Component ---
export default function LeftSidebar({ onCreateClick }) {
    // ✅ 1. State banayi Menu aur Share Modal ke liye
    const [showMenu, setShowMenu] = useState(false);
    const [showShare, setShowShare] = useState(false);

    return (
        <nav className="left-sidebar">
            <div className="logo-container">
                <h1 className="logo-full">MyWebApp</h1>
                <div className="logo-icon">M</div>
            </div>

            <ul className="nav-list">
                <NavItem icon={<HomeIcon />} text="Home" to="/" />
                <NavItem icon={<SearchIcon />} text="Search" to="/search" />
                <NavItem icon={<UsersIcon />} text="Friends" to="/friends" />
                <NavItem icon={<UsersIcon />} text="Request" to="/request" />
                <NavItem icon={<ReelsIcon />} text="Reels" to="/reels" />
                
                <NavItem 
                    icon={<IoAddCircleOutline size={24} />} 
                    text="Create" 
                    onClick={onCreateClick} 
                />
                
                <NavItem icon={<ProfileIcon />} text="Profile" to="/profile" />
            </ul>

            {/* ✅ 2. More Button Update Kiya */}
            <div 
                className="nav-item more-item" 
                onClick={() => setShowMenu(true)} // Click karne par Menu khulega
                style={{ cursor: 'pointer' }}
            >
                <MoreIcon />
                <span className="nav-item-text">More</span>
            </div>

            {/* ✅ 3. Modals Render Kiye */}
            
            {/* A. Menu Modal (Logout wala) */}
            {showMenu && (
                <MoreOptionsModal 
                    onClose={() => setShowMenu(false)} 
                    onOpenShare={() => {
                        setShowMenu(false); // Menu band karo
                        setShowShare(true); // Share modal kholo
                    }}
                />
            )}

            {/* B. Share Profile Modal (QR Code wala) */}
            {showShare && (
                <ShareProfileModal 
                    onClose={() => setShowShare(false)} 
                />
            )}

        </nav>
    );
};