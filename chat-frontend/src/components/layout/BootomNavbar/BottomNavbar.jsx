// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { 
//     HomeIcon, 
//     SearchIcon, 
//     ReelsIcon, 
//     UsersIcon, 
//     ProfileIcon 
// } from '../../UI/Icons'; // Apne icons ka path confirm kar lena

// // 👇 FIX: Square wala icon hata kar Circle wala lagaya jo error nahi dega
// import { IoAddCircleOutline } from 'react-icons/io5'; 

// import './BottomNavbar.css';

// const BottomNavbar = ({ onOpenCreate }) => {
    
//     // User data for Profile Icon
//     const storedUser = localStorage.getItem("user");
//     const user = storedUser ? JSON.parse(storedUser) : null;

//     // Helper for active class
//     const activeStyle = ({ isActive }) => isActive ? "mobile-nav-item active" : "mobile-nav-item";

//     return (
//         <div className="bottom-navbar">
//             {/* 1. HOME */}
//             <NavLink to="/" className={activeStyle}>
//                 <HomeIcon size={24} />
//             </NavLink>

//             {/* 2. FRIENDS */}
//             <NavLink to="/friends" className={activeStyle}>
//                 <UsersIcon size={24} />
//             </NavLink>

//             {/* 3. CREATE (Action Button) */}
//             {/* 👇 FIX: Yahan naya icon use kiya aur size thoda bada rakha (32) */}
//             <div className="mobile-nav-item create-btn" onClick={onOpenCreate}>
//                 <IoAddCircleOutline size={32} />
//             </div>

//             {/* 4. REELS */}
//             <NavLink to="/reels" className={activeStyle}>
//                 <ReelsIcon size={24} />
//             </NavLink>

//             {/* 5. PROFILE */}
//             <NavLink to="/profile" className={activeStyle}>
//                 {user?.avatar || user?.photoURL ? (
//                      <img 
//                      src={user.avatar || user.photoURL} 
//                      alt="profile" 
//                      className="mobile-nav-avatar"
//                  />
//                 ) : (
//                     <ProfileIcon size={24} />
//                 )}
//             </NavLink>
//         </div>
//     );
// };

// export default BottomNavbar;




import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    HomeIcon, 
    SearchIcon, 
    ReelsIcon, 
    // UsersIcon, 
    ProfileIcon 
} from '../../UI/Icons'; 
import { IoAddCircleOutline } from 'react-icons/io5'; 
import './BottomNavbar.css';

const BottomNavbar = ({ onOpenCreate }) => {
    
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const activeStyle = ({ isActive }) => isActive ? "mobile-nav-item active" : "mobile-nav-item";

    return (
        <div className="bottom-navbar">
            <NavLink to="/" className={activeStyle}>
                <HomeIcon size={24} />
            </NavLink>

            <NavLink to="/search" className={activeStyle}>
                <SearchIcon size={24} />
            </NavLink>

            <div className="mobile-nav-item create-btn" onClick={onOpenCreate}>
                <IoAddCircleOutline size={32} />
            </div>

            <NavLink to="/reels" className={activeStyle}>
                <ReelsIcon size={24} />
            </NavLink>

            <NavLink to="/profile" className={activeStyle}>
                {user?.avatar || user?.photoURL ? (
                     <img 
                     src={user.avatar || user.photoURL} 
                     alt="profile" 
                     className="mobile-nav-avatar"
                 />
                ) : (
                    <ProfileIcon size={24} />
                )}
            </NavLink>
        </div>
    );
};

export default BottomNavbar;