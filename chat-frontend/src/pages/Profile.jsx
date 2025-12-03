// import React, { useEffect, useState } from "react";
// import { IoSettingsOutline, IoGrid, IoBookmarkOutline } from "react-icons/io5";
// import API from "../api/api";
// import "./Profile.css"; 
// import EditProfileModal from "../components/Profile/EditProfileModal"; 
// // 👇 Naya Modal Import
// import SinglePostModal from "../components/Profile/SinglePostModal"; 

// const Profile = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isEditOpen, setIsEditOpen] = useState(false);
  
//   // 👇 State for Viewing Single Post
//   const [selectedPost, setSelectedPost] = useState(null);

//   const storedUser = localStorage.getItem("user");
//   const user = storedUser ? JSON.parse(storedUser) : { name: "User", username: "user" };

//   useEffect(() => {
//     fetchMyPosts();
//   }, [isEditOpen]); 

//   const fetchMyPosts = async () => {
//     try {
//       const res = await API.get("/posts/user/me");
//       if (res.data.success) setPosts(res.data.posts);
//     } catch (error) { console.error(error); } 
//     finally { setLoading(false); }
//   };

//   // --- Handlers for Modal ---
//   const handlePostDelete = (deletedPostId) => {
//       // UI se post hata do
//       setPosts(posts.filter(p => p._id !== deletedPostId));
//   };

//   const handlePostUpdate = (updatedPostId, newCaption) => {
//       // UI mein caption update karo
//       setPosts(posts.map(p => p._id === updatedPostId ? {...p, caption: newCaption} : p));
//   };

//   if (loading) return <div className="loading-screen">Loading...</div>;

//   return (
//     <div className="profile-container">
      
//       {/* Header ... (Same as before) */}
//       <div className="profile-header">
//         <div className="profile-pic-wrapper">
//             <img src={user.avatar || user.photoURL || "https://via.placeholder.com/150"} alt="profile" className="profile-pic" />
//         </div>
//         <div className="profile-info">
//             <div className="profile-name-row">
//                 <h2 className="username">{user.name}</h2>
//                 <button className="edit-profile-btn" onClick={() => setIsEditOpen(true)}>Edit Profile</button>
//                 <IoSettingsOutline size={24} className="settings-icon" onClick={() => setIsEditOpen(true)} />
//             </div>
//             <div className="profile-stats">
//                 <span><strong>{posts.length}</strong> posts</span>
//                 <span><strong>120</strong> followers</span>
//                 <span><strong>80</strong> following</span>
//             </div>
//             <div className="profile-bio"><p>{user.bio || "No bio."}</p></div>
//         </div>
//       </div>

//       <div className="profile-tabs">
//         <div className="tab active"><IoGrid /> <span>POSTS</span></div>
//         <div className="tab"><IoBookmarkOutline /> <span>SAVED</span></div>
//       </div>

//       {/* --- GRID (Click Event Added) --- */}
//       <div className="posts-grid">
//         {posts.length === 0 ? (
//             <div className="no-posts"><h3>No Posts Yet 📷</h3></div>
//         ) : (
//             posts.map((post) => (
//                 <div 
//                     key={post._id} 
//                     className="grid-item" 
//                     onClick={() => setSelectedPost(post)} // 👈 Click pe post select karo
//                 >
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

//       {/* --- MODALS --- */}
      
//       {/* 1. Edit Profile Popup */}
//       {isEditOpen && (
//           <EditProfileModal onClose={() => setIsEditOpen(false)} />
//       )}

//       {/* 2. Single Post Popup (Ab ye kaam karega) */}
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


// import React, { useEffect, useState } from "react";
// import { IoSettingsOutline, IoGrid, IoBookmarkOutline } from "react-icons/io5";

// // ✅ API Import
// import API from "../api/api"; 

// // ✅ CSS Import
// import "./Profile.css"; 

// // ✅ Components Import
// import EditProfileModal from "../components/Profile/EditProfileModal"; 
// import SinglePostModal from "../components/Profile/SinglePostModal"; 

// const Profile = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // State 1: Edit Profile Modal ke liye
//   const [isEditOpen, setIsEditOpen] = useState(false);

//   // State 2: Single Post View ke liye
//   const [selectedPost, setSelectedPost] = useState(null);

//   // User Data
//   const storedUser = localStorage.getItem("user");
//   const user = storedUser ? JSON.parse(storedUser) : { name: "User", username: "user" };

//   // --- Fetch Posts ---
//   const fetchMyPosts = async () => {
//     try {
//       const res = await API.get("/posts/user/me");
//       if (res.data.success) setPosts(res.data.posts);
//     } catch (error) { 
//       console.error("Error fetching posts:", error); 
//     } finally { 
//       setLoading(false); 
//     }
//   };

//   useEffect(() => {
//     fetchMyPosts();
//   }, [isEditOpen]); // Profile edit hone par refresh ho

//   // --- Handlers for Single Post Modal ---
  
//   // 1. Delete hone par UI se hatana
//   const handlePostDelete = (deletedPostId) => {
//       setPosts(posts.filter(p => p._id !== deletedPostId));
//   };

//   // 2. Update hone par UI mein change dikhana
//   const handlePostUpdate = (updatedPostId, updatedPostData) => {
//       setPosts(posts.map(p => p._id === updatedPostId ? updatedPostData : p));
//   };

//   if (loading) return <div className="loading-screen">Loading...</div>;

//   return (
//     <div className="profile-container">
      
//       {/* --- HEADER --- */}
//       <div className="profile-header">
//         <div className="profile-pic-wrapper">
//             <img 
//                 src={user.avatar || user.photoURL || "https://via.placeholder.com/150"} 
//                 alt="profile" 
//                 className="profile-pic" 
//             />
//         </div>
        
//         <div className="profile-info">
//             <div className="profile-name-row">
//                 <h2 className="username">{user.name}</h2>
                
//                 {/* Edit Profile Button */}
//                 <button className="edit-profile-btn" onClick={() => setIsEditOpen(true)}>
//                     Edit Profile
//                 </button>
                
//                 {/* Settings Icon */}
//                 <IoSettingsOutline 
//                     size={24} 
//                     className="settings-icon" 
//                     onClick={() => setIsEditOpen(true)}
//                 />
//             </div>
            
//             <div className="profile-stats">
//                 <span><strong>{posts.length}</strong> posts</span>
//                 <span><strong>120</strong> followers</span>
//                 <span><strong>80</strong> following</span>
//             </div>
            
//             <div className="profile-bio">
//                 <p>{user.bio || "No bio yet."}</p>
//             </div>
//         </div>
//       </div>

//       {/* --- TABS --- */}
//       <div className="profile-tabs">
//         <div className="tab active"><IoGrid /> <span>POSTS</span></div>
//         <div className="tab"><IoBookmarkOutline /> <span>SAVED</span></div>
//       </div>

//       {/* --- GRID SECTION --- */}
//       <div className="posts-grid">
//         {posts.length === 0 ? (
//             <div className="no-posts"><h3>No Posts Yet 📷</h3></div>
//         ) : (
//             posts.map((post) => (
//                 <div 
//                     key={post._id} 
//                     className="grid-item"
//                     // 👇 CLICK HANDLER: Isse Single Post Modal khulega
//                     onClick={() => setSelectedPost(post)} 
//                 >
//                     {/* Media Check (Video vs Image) */}
//                     {post.mediaUrl && (post.type === 'video' || post.mediaUrl.endsWith('.mp4') || post.mediaUrl.endsWith('.mov')) ? (
//                         <video src={post.mediaUrl} className="grid-media" muted />
//                     ) : (
//                         <img src={post.mediaUrl} alt="post" className="grid-media" />
//                     )}
                    
//                     {/* Hover Overlay */}
//                     <div className="grid-overlay">
//                         <span>❤️ {post.likes.length}</span>
//                         <span>💬 {post.commentsCount || 0}</span>
//                     </div>
//                 </div>
//             ))
//         )}
//       </div>

//       {/* --- MODALS (POPUPS) --- */}

//       {/* 1. Edit Profile Modal */}
//       {isEditOpen && (
//           <EditProfileModal onClose={() => setIsEditOpen(false)} />
//       )}

//       {/* 2. Single Post View Modal (View/Edit/Delete) */}
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
import { IoSettingsOutline, IoGrid, IoBookmarkOutline } from "react-icons/io5";
import API from "../api/api"; 
import "./Profile.css"; 
import EditProfileModal from "../components/Profile/EditProfileModal"; 
import SinglePostModal from "../components/Profile/SinglePostModal"; 

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 👇 NEW STATE FOR STATS
  const [stats, setStats] = useState({ friends: 0, requests: 0 });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { name: "User", username: "user" };

  // Fetch Data (Posts + Stats)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Posts
        const postsRes = await API.get("/posts/user/me");
        if (postsRes.data.success) setPosts(postsRes.data.posts);

        // 👇 2. FETCH STATS (Backend se)
        // Ensure karo backend route '/api/friends/stats' bana ho
        const statsRes = await API.get("/friends/stats"); 
        if (statsRes.data.success) {
            setStats({ 
                friends: statsRes.data.friends, 
                requests: statsRes.data.requests 
            });
        }

      } catch (error) { 
        console.error("Error fetching profile data:", error); 
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
                <button className="edit-profile-btn" onClick={() => setIsEditOpen(true)}>Edit Profile</button>
                <IoSettingsOutline size={24} className="settings-icon" onClick={() => setIsEditOpen(true)} />
            </div>
            
            {/* 👇 UPDATED STATS SECTION YAHAN HAI */}
            <div className="profile-stats">
                <span><strong>{posts.length}</strong> posts</span>
                
                {/* Friends count stats se aayega */}
                <span><strong>{stats.friends}</strong> friends</span>
                
                {/* Requests count stats se aayega */}
                <span><strong>{stats.requests}</strong> following</span> 
            </div>
            
            <div className="profile-bio"><p>{user.bio || "No bio yet."}</p></div>
        </div>
      </div>

      {/* Tabs & Grid same rahenge... */}
      <div className="profile-tabs">
        <div className="tab active"><IoGrid /> <span>POSTS</span></div>
        <div className="tab"><IoBookmarkOutline /> <span>SAVED</span></div>
      </div>

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

      {/* Modals */}
      {isEditOpen && <EditProfileModal onClose={() => setIsEditOpen(false)} />}
      
      {selectedPost && (
          <SinglePostModal 
              post={selectedPost} 
              onClose={() => setSelectedPost(null)} 
              onDeleteSuccess={handlePostDelete}
              onUpdateSuccess={handlePostUpdate}
          />
      )}

    </div>
  );
};

export default Profile;