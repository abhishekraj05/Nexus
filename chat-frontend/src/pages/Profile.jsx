// import React, { useEffect, useState } from "react";
// import { IoSettingsOutline, IoGrid, IoBookmarkOutline } from "react-icons/io5";
// import API from "../api/api"; 
// import "./Profile.css"; 
// import EditProfileModal from "../components/Profile/EditProfileModal"; 
// import SinglePostModal from "../components/Profile/SinglePostModal"; 

// const Profile = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // 👇 NEW STATE FOR STATS
//   const [stats, setStats] = useState({ friends: 0, requests: 0 });

//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [selectedPost, setSelectedPost] = useState(null);

//   const storedUser = localStorage.getItem("user");
//   const user = storedUser ? JSON.parse(storedUser) : { name: "User", username: "user" };

//   // Fetch Data (Posts + Stats)
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // 1. Fetch Posts
//         const postsRes = await API.get("/posts/user/me");
//         if (postsRes.data.success) setPosts(postsRes.data.posts);

//         // 👇 2. FETCH STATS (Backend se)
//         // Ensure karo backend route '/api/friends/stats' bana ho
//         const statsRes = await API.get("/friends/stats"); 
//         if (statsRes.data.success) {
//             setStats({ 
//                 friends: statsRes.data.friends, 
//                 requests: statsRes.data.requests 
//             });
//         }

//       } catch (error) { 
//         console.error("Error fetching profile data:", error); 
//       } finally { 
//         setLoading(false); 
//       }
//     };
//     fetchData();
//   }, [isEditOpen]); 

//   const handlePostDelete = (deletedPostId) => {
//       setPosts(posts.filter(p => p._id !== deletedPostId));
//   };

//   const handlePostUpdate = (updatedPostId, updatedPostData) => {
//       setPosts(posts.map(p => p._id === updatedPostId ? updatedPostData : p));
//   };

//   if (loading) return <div className="loading-screen">Loading...</div>;

//   return (
//     <div className="profile-container">
      
//       {/* --- HEADER --- */}
//       <div className="profile-header">
//         <div className="profile-pic-wrapper">
//             <img src={user.avatar || user.photoURL || "https://via.placeholder.com/150"} alt="profile" className="profile-pic" />
//         </div>
        
//         <div className="profile-info">
//             <div className="profile-name-row">
//                 <h2 className="username">{user.name}</h2>
//                 {/* <button className="edit-profile-btn" onClick={() => setIsEditOpen(true)}>Edit Profile</button> */}
//                 <IoSettingsOutline size={24} className="settings-icon" onClick={() => setIsEditOpen(true)} />
//             </div>
            
//             {/* 👇 UPDATED STATS SECTION YAHAN HAI */}
//             <div className="profile-stats">
//                 <span><strong>{posts.length}</strong> posts</span>
                
//                 {/* Friends count stats se aayega */}
//                 <span><strong>{stats.friends}</strong> friends</span>
                
//                 {/* Requests count stats se aayega */}
//                 <span><strong>{stats.requests}</strong> following</span> 
//             </div>
            
//             <div className="profile-bio"><p>{user.bio || "No bio yet."}</p></div>
//         </div>
//       </div>

//       {/* Tabs & Grid same rahenge... */}
//       <div className="profile-tabs">
//         <div className="tab active"><IoGrid /> <span>POSTS</span></div>
//         {/* <div className="tab"><IoBookmarkOutline /> <span>SAVED</span></div> */}
//       </div>

//       <div className="posts-grid">
//         {posts.length === 0 ? (
//             <div className="no-posts"><h3>No Posts Yet 📷</h3></div>
//         ) : (
//             posts.map((post) => (
//                 <div key={post._id} className="grid-item" onClick={() => setSelectedPost(post)}>
//                     {post.mediaUrl && (post.type === 'video' || post.mediaUrl.endsWith('.mp4')) ? (
//                         <video src={post.mediaUrl} className="grid-media" muted />
//                     ) : (
//                         <img src={post.mediaUrl} alt="post" className="grid-media" />
//                     )}
//                     <div className="grid-overlay">
//                         <span>❤️ {post.likes.length}</span>
//                     </div>
//                 </div>
//             ))
//         )}
//       </div>

//       {/* Modals */}
//       {isEditOpen && <EditProfileModal onClose={() => setIsEditOpen(false)} />}
      
//       {selectedPost && (
//           <SinglePostModal 
//               post={selectedPost} 
//               onClose={() => setSelectedPost(null)} 
//               onDeleteSuccess={handlePostDelete}
//               onUpdateSuccess={handlePostUpdate}
//           />
//       )}

//     </div>
//   );
// };

// export default Profile;




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Navigation ke liye
import { IoGrid, IoMenuOutline } from "react-icons/io5"; // Menu Icon
import API from "../api/api"; 
import "./Profile.css"; 

// Components
import EditProfileModal from "../components/Profile/EditProfileModal"; 
import SinglePostModal from "../components/Profile/SinglePostModal"; 
// 👇 Ye path check kar lena (jahan aapne sidebar wale components rakhe hain)
import MoreOptionsModal from "../components/Layout/LeftSidebar/MoreOptionsModal"; 
import ShareProfileModal from "../components/Layout/LeftSidebar/ShareProfileModal";

const Profile = () => {
  const navigate = useNavigate(); // Hook for navigation

  // States
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ friends: 0, requests: 0 });

  // Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // 👇 New Modal States
  const [showMenu, setShowMenu] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { name: "User", username: "user" };

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsRes = await API.get("/posts/user/me");
        if (postsRes.data.success) setPosts(postsRes.data.posts);

        const statsRes = await API.get("/friends/stats"); 
        if (statsRes.data.success) {
            setStats({ 
                friends: statsRes.data.friends, 
                requests: statsRes.data.requests 
            });
        }
      } catch (error) { 
        console.error("Error fetching data:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, [isEditOpen]); 

  const handlePostDelete = (deletedPostId) => {
      setPosts(posts.filter(p => p._id !== deletedPostId));
  };

  const handlePostUpdate = (updatedPostId, updatedPostData) => {
      setPosts(posts.map(p => p._id === updatedPostId ? updatedPostData : p));
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="profile-container">
      
      {/* --- HEADER --- */}
      <div className="profile-header">
        <div className="profile-pic-wrapper">
            <img src={user.avatar || user.photoURL || "https://via.placeholder.com/150"} alt="profile" className="profile-pic" />
        </div>
        
        <div className="profile-info">
            <div className="profile-name-row">
                <h2 className="username">{user.name}</h2>
                
                {/* 👇 1. MENU ICON (Opens MoreOptionsModal) */}
                <IoMenuOutline 
                    size={30} 
                    className="settings-icon" 
                    onClick={() => setShowMenu(true)} 
                    style={{cursor: 'pointer'}}
                />
            </div>
            
            {/* Stats (Clickable) */}
            <div className="profile-stats">
                <span><strong>{posts.length}</strong> posts</span>
                
                <span onClick={() => navigate('/friends')} style={{cursor: 'pointer'}}>
                    <strong>{stats.friends}</strong> friends
                </span>
                
                <span onClick={() => navigate('/request')} style={{cursor: 'pointer'}}>
                    <strong>{stats.requests}</strong> requests
                </span> 
            </div>
            
            <div className="profile-bio"><p>{user.bio || "No bio yet."}</p></div>

            {/* 👇 2. ACTION BUTTONS ROW (Edit | Friends | Requests)
            <div className="profile-actions">
                <button className="action-btn primary" onClick={() => setIsEditOpen(true)}>
                    Edit Profile
                </button>
                <button className="action-btn" onClick={() => navigate('/friends')}>
                    Friends
                </button>
                <button className="action-btn" onClick={() => navigate('/request')}>
                    Requests
                </button>
            </div> */}

        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <div className="tab active"><IoGrid /> <span>POSTS</span></div>
      </div>

      {/* Posts Grid */}
      <div className="posts-grid">
        {posts.length === 0 ? (
            <div className="no-posts"><h3>No Posts Yet 📷</h3></div>
        ) : (
            posts.map((post) => (
                <div key={post._id} className="grid-item" onClick={() => setSelectedPost(post)}>
                    {post.mediaUrl && (post.type === 'video' || post.mediaUrl.endsWith('.mp4')) ? (
                        <video src={post.mediaUrl} className="grid-media" muted />
                    ) : (
                        <img src={post.mediaUrl} alt="post" className="grid-media" />
                    )}
                    <div className="grid-overlay">
                        <span>❤️ {post.likes.length}</span>
                    </div>
                </div>
            ))
        )}
      </div>

      {/* --- MODALS --- */}
      
      {/* Edit Profile */}
      {isEditOpen && <EditProfileModal onClose={() => setIsEditOpen(false)} />}
      
      {/* Single Post */}
      {selectedPost && (
          <SinglePostModal 
              post={selectedPost} 
              onClose={() => setSelectedPost(null)} 
              onDeleteSuccess={handlePostDelete}
              onUpdateSuccess={handlePostUpdate}
          />
      )}

      {/* 👇 3. MORE OPTIONS MODAL */}
      {showMenu && (
        <MoreOptionsModal 
            onClose={() => setShowMenu(false)} 
            onOpenShare={() => {
                setShowMenu(false);
                setShowShare(true);
            }}
        />
      )}

      {/* 👇 4. SHARE PROFILE MODAL */}
      {showShare && (
        <ShareProfileModal 
            onClose={() => setShowShare(false)} 
        />
      )}

    </div>
  );
};

export default Profile;