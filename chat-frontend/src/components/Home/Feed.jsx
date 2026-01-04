// import React from 'react';

// // Dummy Post Data
// const dummyPosts = [
//     { id: 1, user: 'coding_guru', avatar: 'https://placehold.co/40x40/4f46e5/ffffff?text=CG', imageUrl: 'https://placehold.co/600x400/3b82f6/ffffff?text=React+Code', caption: 'Flexbox ki galti ko debug karte hue! Kabhi haar mat maano. #ReactDev', likes: 120, time: '2h ago' },
//     { id: 2, user: 'travel_bug', avatar: 'https://placehold.co/40x40/10b981/ffffff?text=TB', imageUrl: 'https://placehold.co/600x400/009688/ffffff?text=Mountain+View', caption: 'Pahaadon mein ek chhota sa break. Coding se zaroori hai mental health!', likes: 345, time: '1d ago' },
// ];

// const PostCard = ({ post }) => (
//     <div className="post-card">
//         {/* Header */}
//         <div className="post-header">
//             <img src={post.avatar} alt={post.user} className="post-avatar" referrerPolicy="no-referrer" />
//             <span className="post-username">{post.user}</span>
//             <span className="post-time">{post.time}</span>
//         </div>

//         {/* Media */}
//         <img src={post.imageUrl} alt="Post media" className="post-media" referrerPolicy="no-referrer" />

//         {/* Actions/Footer */}
//         <div className="post-footer">
//             <div className="post-actions">
//                 <span className="action-icon">👍</span>
//                 <span className="action-icon">💬</span>
//                 <span className="action-icon">🔗</span>
//             </div>
//             <div className="post-likes">
//                 {post.likes} likes
//             </div>
//             <p className="post-caption">
//                 <span className="post-username-caption">{post.user}</span> {post.caption}
//             </p>
//         </div>
//     </div>
// );

// export default function Feed() {
//     return (
//         <div className="user-feed-container">
//             <h2>Your Feed</h2>
//             <div className="posts-wrapper">
//                 {dummyPosts.map(post => (
//                     <PostCard key={post.id} post={post} />
//                 ))}
//                 <p className="feed-end-message">You have reached the end of the feed.</p>
//             </div>
//         </div>
//     );
// }













// import React, { useEffect, useState } from 'react';
// import { IoHeart, IoHeartOutline, IoChatbubbleOutline, IoShareSocialOutline } from 'react-icons/io5';
// import client from "../../api/api"; 
// import './Feed.css'; 
// // 👇 1. Comment Modal Import kiya
// import CommentModal from './CommentModal'; 

// const Feed = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // 👇 2. State banaya taaki pata chale kis post ka comment box kholna hai
//   const [activePostId, setActivePostId] = useState(null);

//   // --- 1. Posts Fetch Karna ---
//   const fetchPosts = async () => {
//     try {
//       const response = await client.get('/posts/feed');
//       if (response.data.success) {
//         setPosts(response.data.posts);
//       }
//     } catch (error) {
//       console.error("Feed error:", error);
//       // alert("Error: Could not load feed"); // Bar bar alert na aaye isliye comment kar diya
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   // --- 2. Like Function ---
//   const handleLike = async (postId) => {
//     try {
//         const res = await client.post(`/posts/${postId}/like`);
        
//         if (res.data.success) {
//             setPosts(currentPosts => currentPosts.map(post => {
//                 if (post._id === postId) {
//                     const wasLiked = res.data.liked;
//                     const newCount = res.data.likesCount;
                    
//                     return {
//                         ...post,
//                         likes: wasLiked ? [...post.likes, 'me'] : post.likes.slice(0, -1),
//                         likesCount: newCount
//                     };
//                 }
//                 return post;
//             }));
//         }
//     } catch (error) {
//         console.error("Like failed", error);
//     }
//   };

//   // --- Loading State ---
//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//       </div>
//     );
//   }

//   // --- Main Render ---
//   return (
//     <div className="feed-container">
//         {/* Header Title */}
//         <div className="screen-header">
//             <h1 className="screen-title">Codrexa Feed</h1>
//         </div>

//         <div className="posts-list">
//             {posts.length === 0 ? (
//                 <p className="empty-text">No posts found. Follow friends!</p>
//             ) : (
//                 posts.map((item) => {
//                     // Like check logic (abhi simple rakha hai)
//                     // const isLiked = item.likes.includes(CURRENT_USER_ID);
//                     const isLiked = false; 

//                     return (
//                         <div key={item._id} className="post-card">
                            
//                             {/* --- Header --- */}
//                             <div className="post-header">
//                                 <img 
//                                     src={item.author?.avatar || 'https://via.placeholder.com/40'} 
//                                     alt="avatar"
//                                     className="post-avatar" 
//                                 />
//                                 <div style={{ flex: 1 }}>
//                                     <span className="post-username">{item.author?.name || "Unknown"}</span>
//                                 </div>
//                                 <span className="post-time">2h ago</span>
//                             </div>

//                             {/* --- Media --- */}
//                             {item.mediaUrl && (
//                                 <img 
//                                     src={item.mediaUrl} 
//                                     alt="Post Media"
//                                     className="post-media" 
//                                 />
//                             )}

//                             {/* --- Footer --- */}
//                             <div className="post-footer">
                                
//                                 {/* Actions Icons */}
//                                 <div className="post-actions">
//                                     <div className="action-btn" onClick={() => handleLike(item._id)}>
//                                         {isLiked ? (
//                                             <IoHeart size={28} color="#ef4444" />
//                                         ) : (
//                                             <IoHeartOutline size={28} color="#a1a1aa" />
//                                         )}
//                                     </div>
                                    
//                                     {/* 👇 3. Comment Icon pe Click Event lagaya */}
//                                     <div className="action-btn" onClick={() => setActivePostId(item._id)}>
//                                         <IoChatbubbleOutline size={26} color="#a1a1aa" />
//                                     </div>
                                    
//                                     <div className="action-btn">
//                                         <IoShareSocialOutline size={26} color="#a1a1aa" />
//                                     </div>
//                                 </div>

//                                 {/* Likes Count */}
//                                 <div className="post-likes">
//                                     {item.likes ? item.likes.length : 0} likes
//                                 </div>

//                                 {/* Caption */}
//                                 <div className="post-caption">
//                                     <span className="post-username-caption">{item.author?.name} </span>
//                                     {item.caption}
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })
//             )}
//         </div>

//         {/* 👇 4. Modal Yahan Render Hoga (Sabse neeche) */}
//         {activePostId && (
//             <CommentModal 
//                 postId={activePostId} 
//                 onClose={() => setActivePostId(null)} // Close karne par state null karo
//             />
//         )}

//     </div>
//   );
// };

// export default Feed;











// import React, { useEffect, useState } from 'react';
// import { IoHeart, IoHeartOutline, IoChatbubbleOutline, IoShareSocialOutline } from 'react-icons/io5';
// import client from "../../api/api";
// import './Feed.css';
// import CommentModal from './CommentModal';
// import ShareModal from './ShareModal';

// const Feed = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activePostId, setActivePostId] = useState(null); // Comment Modal ke liye
// const [sharePost, setSharePost] = useState(null);

//   // 🆔 CURRENT USER ID NIKALO (LocalStorage se)
//   // Ye zaroori hai taaki pata chale humne like kiya hai ya nahi
//   const storedUser = localStorage.getItem("user");
//   const currentUser = storedUser ? JSON.parse(storedUser) : null;
//   const currentUserId = currentUser ? currentUser._id : null;

//   // 1. Fetch Posts
//   const fetchPosts = async () => {
//     try {
//       const response = await client.get('/posts/feed');
//       if (response.data.success) {
//         setPosts(response.data.posts);
//       }
//     } catch (error) {
//       console.error("Feed error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   // 2. ❤️ LIKE FUNCTION (Optimistic UI Update)
//   const handleLike = async (postId) => {
//     // Turant UI update karo (Server response ka wait mat karo)
//     setPosts(currentPosts => currentPosts.map(post => {
//       if (post._id === postId) {
//         const isAlreadyLiked = post.likes.includes(currentUserId);
//         return {
//           ...post,
//           likes: isAlreadyLiked 
//             ? post.likes.filter(id => id !== currentUserId) // Unlike: Remove ID
//             : [...post.likes, currentUserId] // Like: Add ID
//         };
//       }
//       return post;
//     }));

//     // Ab Server ko batao
//     try {
//       await client.post(`/posts/${postId}/like`);
//       // Note: Agar error aaye to wapas revert kar sakte ho, par abhi simple rakhte hain
//     } catch (error) {
//       console.error("Like failed", error);
//     }
//   };

//   // 3. 🚀 SHARE FUNCTION
//   const handleShare = async (post) => {
//     const shareData = {
//       title: 'Codrexa Post',
//       text: `${post.author?.name} shared a post: ${post.caption}`,
//       url: window.location.href // Ya specific post link (e.g. /post/123)
//     };

//     try {
//       // Mobile/Supported Browsers mein Native Share khulega
//       if (navigator.share) {
//         await navigator.share(shareData);
//       } else {
//         // PC/Desktop par Link Copy hoga
//         await navigator.clipboard.writeText(shareData.url);
//         alert("Link copied to clipboard! 📋");
//       }
//     } catch (error) {
//       console.error("Error sharing:", error);
//     }
//   };

//   if (loading) {
//     return <div className="loading-container"><div className="spinner"></div></div>;
//   }

//   return (
//     <div className="feed-container">
//         <div className="screen-header">
//             <h1 className="screen-title">Codrexa Feed</h1>
//         </div>

//         <div className="posts-list">
//             {posts.length === 0 ? (
//                 <p className="empty-text">No posts found. Follow friends!</p>
//             ) : (
//                 posts.map((item) => {
//                     // ✅ Check: Kya Maine Like kiya hai?
//                     const isLiked = item.likes.includes(currentUserId);

//                     return (
//                         <div key={item._id} className="post-card">
//                             {/* Header */}
//                             <div className="post-header">
//                                 <img 
//                                     src={item.author?.avatar || 'https://via.placeholder.com/40'} 
//                                     alt="avatar" className="post-avatar" 
//                                 />
//                                 <div style={{ flex: 1 }}>
//                                     <span className="post-username">{item.author?.name || "Unknown"}</span>
//                                 </div>
//                                 <span className="post-time">Recently</span>
//                             </div>

//                             {/* Media */}
//                             {item.mediaUrl && (
//                                 <img src={item.mediaUrl} alt="Post" className="post-media" />
//                             )}

//                             {/* Footer Actions */}
//                             <div className="post-footer">
//                                 <div className="post-actions">
                                    
//                                     {/* ❤️ LIKE BUTTON */}
//                                     <div className="action-btn" onClick={() => handleLike(item._id)}>
//                                         {isLiked ? (
//                                             // Agar Liked hai: RED & FILLED Icon + Animation Class
//                                             <IoHeart size={28} color="#ef4444" className="heart-anim" />
//                                         ) : (
//                                             // Agar Nahi hai: OUTLINE Icon
//                                             <IoHeartOutline size={28} color="#a1a1aa" />
//                                         )}
//                                     </div>
                                    
//                                     {/* 💬 COMMENT BUTTON */}
//                                     <div className="action-btn" onClick={() => setActivePostId(item._id)}>
//                                         <IoChatbubbleOutline size={26} color="#a1a1aa" />
//                                     </div>
                                    
//                                     {/* 🚀 SHARE BUTTON */}
//                                     {/* <div className="action-btn" onClick={() => handleShare(item)}>
//                                         <IoShareSocialOutline size={26} color="#a1a1aa" />
//                                     </div> */}

//                                     <div className="action-btn" onClick={() => setSharePost(item)}>
//                                         <IoShareSocialOutline size={26} color="#a1a1aa" />
//                                     </div>
//                                 </div>

//                                 <div className="post-likes">
//                                     {item.likes ? item.likes.length : 0} likes
//                                 </div>

//                                 <div className="post-caption">
//                                     <span className="post-username-caption">{item.author?.name} </span>
//                                     {item.caption}
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })
//             )}
//         </div>

//         {activePostId && (
//             <CommentModal postId={activePostId} onClose={() => setActivePostId(null)} />
//         )}

//         {sharePost && (
//             <ShareModal 
//                 post={sharePost} 
//                 onClose={() => setSharePost(null)} // Close karne par null kar do
//             />
//         )}
//     </div>
//   );
// };

// export default Feed;





import React, { useEffect, useState } from 'react';
import { IoHeart, IoHeartOutline, IoChatbubbleOutline, IoShareSocialOutline } from 'react-icons/io5';
import client from "../../api/api";
import './Feed.css';
import CommentModal from './CommentModal';
import ShareModal from './ShareModal';

// 👇 Stories Bar Import Karo
import StoriesBar from './StoriesBar';

const Feed = ({ refreshSignal }) => { // refreshSignal prop add kiya agar aapne parent se pass kiya ho
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePostId, setActivePostId] = useState(null);
  const [sharePost, setSharePost] = useState(null);

  // 🆔 CURRENT USER ID NIKALO
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = currentUser ? currentUser._id : null;


  // 👇 1. HELPER FUNCTION: Time Ago Calculation
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Just now";
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    
    // Agar 7 din se zyada purana hai to date dikhao
    return date.toLocaleDateString();
  };

  // 1. Fetch Posts
  const fetchPosts = async () => {
    try {
      const response = await client.get('/posts/feed');
      console.log("🔥 FEED DATA CHECK:", response.data.posts);
      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error("Feed error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshSignal]); // Refresh signal aate hi reload karega

  // 2. ❤️ LIKE FUNCTION
  const handleLike = async (postId) => {
    setPosts(currentPosts => currentPosts.map(post => {
      if (post._id === postId) {
        const isAlreadyLiked = post.likes.includes(currentUserId);
        return {
          ...post,
          likes: isAlreadyLiked 
            ? post.likes.filter(id => id !== currentUserId)
            : [...post.likes, currentUserId]
        };
      }
      return post;
    }));

    try {
      await client.post(`/posts/${postId}/like`);
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }


  return (
    <div className="feed-container">
        <div className="screen-header">
            {/* <h1 style={{marginLeft:"30%"}} className="screen-title">𝓑𝓾𝓫𝓫𝓵𝔂</h1> */}
        {/* 👇 STORIES BAR YAHAN ADD KIYA */}
        <div className="stories-section">
            <StoriesBar />
        </div>
        </div>


        <div className="posts-list">
            {posts.length === 0 ? (
                <p className="empty-text">No posts found. Follow friends!</p>
            ) : (
                posts.map((item) => {
                    const isLiked = item.likes.includes(currentUserId);

                    return (
                        <div key={item._id} className="post-card">
                            {/* Header */}
                            <div className="post-header">
                                <img 
                                    src={item.author?.photoURL || 'https://via.placeholder.com/40'} 
                                    alt="avatar" className="post-avatar" 
                                />
                                {/* 👇 YAHAN CHANGE KIYA HAI (Name + Username) */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '10px', justifyContent: 'center' }}>
                                    
                                    {/* Name */}
                                    <span className="post-username" style={{ lineHeight: '1.2' }}>
                                        {item.author?.name || "Unknown"}
                                    </span>
                                    
                                    {/* Username */}
                                    <span style={{ fontSize: '12px', color: '#888' }}>
                                        @{item.author?.username || "user"}
                                    </span>

                                </div>
                                {/* <span className="post-time">Recently</span> */}
                                <span className="post-time">{timeAgo(item.createdAt)}</span>
                            </div>

                            {/* 🎥 MEDIA SECTION (VIDEO FIX HERE) */}
                            {item.mediaUrl && (
                                <div className="media-container">
                                    {/* Check karein ki type 'video' hai ya extension mp4/mov hai */}
                                    {item.type === 'video' || item.mediaUrl.endsWith('.mp4') || item.mediaUrl.endsWith('.mov') ? (
                                        <video 
                                            src={item.mediaUrl} 
                                            className="post-media" 
                                           onClick={(e) => {
                                            const video = e.target;
                                            if (video.paused) {
                                                video.play();
                                            } else {
                                                video.pause();
                                            }
                                        }}
                                        />
                                    ) : (
                                        <img src={item.mediaUrl} alt="Post" className="post-media" />
                                    )}
                                </div>
                            )}

                            {/* Footer Actions */}
                            <div className="post-footer">
                                <div className="post-actions">
                                    
                                    {/* LIKE */}
                                    <div className="action-btn" onClick={() => handleLike(item._id)}>
                                        {isLiked ? (
                                            <IoHeart size={28} color="#ef4444" className="heart-anim" />
                                        ) : (
                                            <IoHeartOutline size={28} color="#a1a1aa" />
                                        )}
                                    </div>
                                    
                                    {/* COMMENT */}
                                    <div className="action-btn" onClick={() => setActivePostId(item._id)}>
                                        <IoChatbubbleOutline size={26} color="#a1a1aa" />
                                    </div>
                                    
                                    {/* SHARE */}
                                    <div className="action-btn" onClick={() => setSharePost(item)}>
                                        <IoShareSocialOutline size={26} color="#a1a1aa" />
                                    </div>
                                </div>

                                <div className="post-likes">
                                    {item.likes ? item.likes.length : 0} likes
                                </div>

                                <div className="post-caption">
                                    <span className="post-username-caption">{item.author?.name} </span>
                                    {item.caption}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>

        {/* Modals */}
        {activePostId && (
            <CommentModal postId={activePostId} onClose={() => setActivePostId(null)} />
        )}

        {sharePost && (
            <ShareModal 
                post={sharePost} 
                onClose={() => setSharePost(null)} 
            />
        )}
    </div>
  );
};

export default Feed;