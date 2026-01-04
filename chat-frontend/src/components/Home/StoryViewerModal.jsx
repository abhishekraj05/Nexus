// import React, { useEffect, useState, useRef } from 'react';
// import { IoClose, IoTrash, IoPencil, IoEllipsisVertical } from 'react-icons/io5';
// import client from '../../api/api';
// import './Stories.css';

// const StoryViewerModal = ({ story, onClose, onDeleteSuccess }) => {
//     const [updating, setUpdating] = useState(false);
//     const [showMenu, setShowMenu] = useState(false); // Menu toggle ke liye
//     const fileInputRef = useRef(null);

//     // --- USER CHECK ---
//     const storedUser = localStorage.getItem("user");
//     const currentUser = storedUser ? JSON.parse(storedUser) : null;
    
//     // Safe Check: Dono IDs ko string bana kar compare karo
//     const isMine = story.user?._id?.toString() === currentUser?._id?.toString();

//     // Auto-Close Timer
//     useEffect(() => {
//         if (!updating && !showMenu) { // Agar menu khula hai ya update ho raha hai to band mat karo
//             const timer = setTimeout(() => { onClose(); }, 5000);
//             return () => clearTimeout(timer);
//         }
//     }, [story, onClose, updating, showMenu]);

//     // --- DELETE HANDLER ---
//     const handleDelete = async () => {
//         if (!window.confirm("Delete this story?")) return;
//         try {
//             await client.delete(`/stories/${story._id}`);
//             if (onDeleteSuccess) onDeleteSuccess();
//             onClose();
//         } catch (error) { console.error("Delete error", error); }
//     };

//     // --- UPDATE HANDLER ---
//     const handleFileChange = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         setUpdating(true);
//         setShowMenu(false); // Menu band kar do
        
//         const formData = new FormData();
//         formData.append('file', file);

//         try {
//             const res = await client.put(`/stories/${story._id}`, formData);
//             if (res.data.success) {
//                 alert("Story Updated!");
//                 if (onDeleteSuccess) onDeleteSuccess();
//                 onClose();
//             }
//         } catch (error) {
//             console.error("Update error", error);
//             alert("Update failed");
//         } finally {
//             setUpdating(false);
//         }
//     };

//     return (
//         <div className="story-viewer-overlay">
            
//             {/* Close Button (Top Right Fixed) */}
//             <button className="story-close-btn" onClick={onClose}>
//                 <IoClose size={30} />
//             </button>

//             <div className="story-content">
                
//                 {/* --- HEADER SECTION --- */}
//                 <div className="story-header-info">
//                     <div className="user-details-row">

//                         <img src={story.user?.photoURL || "https://via.placeholder.com/40"} alt="user" className="story-header-avatar" />

//                         <span className="story-header-name">{story.user?.name}</span>
//                         <span className="story-time">
//                             {updating ? "Updating..." : new Date(story.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                         </span>
//                     </div>

//                     {/* 👇 THREE DOT MENU (Sirf Meri Story par) */}
//                     {isMine && (
//                         <div className="story-menu-container">
//                             <button className="three-dot-btn" onClick={() => setShowMenu(!showMenu)}>
//                                 <IoEllipsisVertical size={20} />
//                             </button>

//                             {/* Dropdown */}
//                             {showMenu && (
//                                 <div className="story-dropdown">
//                                     <button onClick={() => fileInputRef.current.click()} className="menu-item">
//                                         <IoPencil /> Edit
//                                     </button>
//                                     <button onClick={handleDelete} className="menu-item delete">
//                                         <IoTrash /> Delete
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>

//                 {/* --- MEDIA SECTION --- */}
//                 {story.type === 'video' ? (
//                     <video src={story.mediaUrl} autoPlay className="story-media-full" />
//                 ) : (
//                     <img src={story.mediaUrl} alt="story" className="story-media-full" />
//                 )}

//                 {/* Hidden Input for Update */}
//                 <input 
//                     type="file" 
//                     ref={fileInputRef} 
//                     style={{display:'none'}} 
//                     accept="image/*,video/*"
//                     onChange={handleFileChange}
//                 />
//             </div>
//         </div>
//     );
// };

// export default StoryViewerModal;

















// import React, { useEffect, useState, useRef } from 'react';
// import { IoClose, IoTrash, IoPencil, IoEllipsisVertical, IoEye } from 'react-icons/io5';
// import client from '../../api/api';
// import './StoryViewerModal.css';

// const StoryViewerModal = ({ story, onClose, onDeleteSuccess }) => {
//     const [updating, setUpdating] = useState(false);
//     const [showMenu, setShowMenu] = useState(false);
    
//     // 👇 Sirf List dikhane ka state (Search hata diya)
//     const [showViewersList, setShowViewersList] = useState(false);

//     const fileInputRef = useRef(null);
//     const [viewCount, setViewCount] = useState(story.viewers?.length || 0);

//     // --- USER CHECK ---
//     const storedUser = localStorage.getItem("user");
//     const currentUser = storedUser ? JSON.parse(storedUser) : null;
//     const storyOwnerId = story.user?._id || story.user;
//     const myId = currentUser?._id;
//     const isMine = String(storyOwnerId) === String(myId);

//     // --- API: MARK VIEW ---
//     useEffect(() => {
//         const markAsViewed = async () => {
//             if (isMine) return; 
//             try {
//                 await client.put(`/stories/${story._id}/view`);
//             } catch (error) { console.error(error); }
//         };
//         markAsViewed();
//     }, [story._id, isMine]);

//     // --- AUTO CLOSE TIMER ---
//     useEffect(() => {
//         // Agar list khuli hai to Timer ROK DO
//         if (!updating && !showMenu && !showViewersList) {
//             const timer = setTimeout(() => { onClose(); }, 5000);
//             return () => clearTimeout(timer);
//         }
//     }, [story, onClose, updating, showMenu, showViewersList]);

//     // Handlers
//     const handleDelete = async () => {
//         if (!window.confirm("Delete this story?")) return;
//         try {
//             await client.delete(`/stories/${story._id}`);
//             if (onDeleteSuccess) onDeleteSuccess();
//             onClose();
//         } catch (error) { console.error(error); }
//     };

//     const handleFileChange = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;
//         setUpdating(true);
//         setShowMenu(false);
//         const formData = new FormData();
//         formData.append('file', file);
//         try {
//             const res = await client.put(`/stories/${story._id}`, formData);
//             if (res.data.success) {
//                 alert("Story Updated!");
//                 if (onDeleteSuccess) onDeleteSuccess();
//                 onClose();
//             }
//         } catch (error) { alert("Update failed"); } 
//         finally { setUpdating(false); }
//     };

//     return (
//         <div className="story-viewer-overlay">
            
//             {/* Close Button (List khuli ho to chupao) */}
//             {!showViewersList && (
//                 <button className="story-close-btn" onClick={onClose} style={{zIndex: 10000}}>
//                     <IoClose size={30} />
//                 </button>
//             )}

//             {/* Main Content Area */}
//             <div className="story-content" onClick={() => {
//                 if(showViewersList) setShowViewersList(false);
//             }}>
//                 <div className="story-header-info">
//                     <div className="user-details-row">
//                         <img src={story.user?.photoURL || "https://via.placeholder.com/40"} alt="user" className="story-header-avatar" />
//                         <span className="story-header-name">{story.user?.name}</span>
//                         <span className="story-time">
//                            {updating ? "Updating..." : new Date(story.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                         </span>
//                     </div>

//                     {isMine && !showViewersList && (
//                         <div className="story-menu-container">
//                             <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} style={{background:'none', border:'none', cursor:'pointer'}}>
//                                 <IoEllipsisVertical size={24} color="white" />
//                             </button>
//                             {showMenu && (
//                                 <div className="story-dropdown">
//                                     <button onClick={() => fileInputRef.current.click()}><IoPencil/> Edit</button>
//                                     <button onClick={handleDelete}><IoTrash/> Delete</button>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>

//                 {story.type === 'video' ? (
//                     <video src={story.mediaUrl} autoPlay loop className="story-media-full" />
//                 ) : (
//                     <img src={story.mediaUrl} alt="story" className="story-media-full" />
//                 )}
//             </div>

//             {/* 🔥 VIEW BUTTON (Bottom: 80px) 🔥 */}
//             {isMine && !showViewersList && (
//                 <div className="story-views-btn"
//                     onClick={(e) => {
//                         e.stopPropagation(); 
//                         setShowViewersList(true); 
//                     }}
//                     style={{
//                         position: 'fixed',
//                         bottom: '80px',            // Safe height
//                         left: '20px',
//                         zIndex: 99999,
//                         backgroundColor: 'rgba(0,0,0,0.6)',
//                         color: 'white',
//                         padding: '10px 15px',
//                         borderRadius: '30px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '8px',
//                         cursor: 'pointer',
//                         backdropFilter: 'blur(5px)',
//                         border: '1px solid rgba(255,255,255,0.3)'
//                     }}
//                 >
//                     <IoEye size={20} color="white" />
//                     <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
//                         {viewCount} Views
//                     </span>
//                 </div>
//             )}

//             {/* 🔥 VIEWERS LIST MODAL (No Search) 🔥 */}
//             {showViewersList && (
//                 <div className="viewers-list-overlay">
                    
//                     {/* Header */}
//                     <div className="viewers-header">
//                         <span>Viewers ({viewCount})</span>
//                         <button onClick={() => setShowViewersList(false)} style={{background:'none', border:'none', cursor:'pointer'}}>
//                             <IoClose size={24} color="white" />
//                         </button>
//                     </div>

//                     {/* Scrollable List */}
//                     <div className="viewers-scroll-area">
//                         {story.viewers && story.viewers.length > 0 ? (
//                             story.viewers.map((viewer, index) => (
//                                 <div key={index} className="viewer-row">
//                                     <img 
//                                         src={viewer.photoURL || "https://via.placeholder.com/40"} 
//                                         alt={viewer.name} 
//                                         className="viewer-img" 
//                                     />
//                                     <span className="viewer-name">{viewer.name}</span>
//                                 </div>
//                             ))
//                         ) : (
//                             <p className="no-views-text">No views yet.</p>
//                         )}
//                     </div>
//                 </div>
//             )}

//             <input type="file" ref={fileInputRef} style={{display:'none'}} onChange={handleFileChange} />
//         </div>
//     );
// };

// export default StoryViewerModal;



import React, { useEffect, useState, useRef } from 'react';
import { IoClose, IoTrash, IoPencil, IoEllipsisVertical, IoEye } from 'react-icons/io5';
import client from '../../api/api';
import './StoryViewerModal.css'; // Make sure file name matches

const StoryViewerModal = ({ story, onClose, onDeleteSuccess }) => {
    const [updating, setUpdating] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    
    // 👇 Sirf List dikhane ka state
    const [showViewersList, setShowViewersList] = useState(false);

    const fileInputRef = useRef(null);
    const [viewCount, setViewCount] = useState(story.viewers?.length || 0);

    // --- USER CHECK ---
    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const storyOwnerId = story.user?._id || story.user;
    const myId = currentUser?._id;
    const isMine = String(storyOwnerId) === String(myId);

    // --- API: MARK VIEW ---
    useEffect(() => {
        const markAsViewed = async () => {
            if (isMine) return; 
            try {
                await client.put(`/stories/${story._id}/view`);
            } catch (error) { console.error(error); }
        };
        markAsViewed();
    }, [story._id, isMine]);

    // --- AUTO CLOSE TIMER ---
    useEffect(() => {
        // Agar list khuli hai to Timer ROK DO
        if (!updating && !showMenu && !showViewersList) {
            const timer = setTimeout(() => { onClose(); }, 5000);
            return () => clearTimeout(timer);
        }
    }, [story, onClose, updating, showMenu, showViewersList]);

    // Handlers
    const handleDelete = async () => {
        if (!window.confirm("Delete this story?")) return;
        try {
            await client.delete(`/stories/${story._id}`);
            if (onDeleteSuccess) onDeleteSuccess();
            onClose();
        } catch (error) { console.error(error); }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUpdating(true);
        setShowMenu(false);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await client.put(`/stories/${story._id}`, formData);
            if (res.data.success) {
                alert("Story Updated!");
                if (onDeleteSuccess) onDeleteSuccess();
                onClose();
            }
        } catch (error) { alert("Update failed"); } 
        finally { setUpdating(false); }
    };

    return (
        <div className="story-viewer-overlay">
            
            {/* Close Button (List khuli ho to chupao) */}
            {!showViewersList && (
                <button className="story-close-btn" onClick={onClose} style={{zIndex: 10000}}>
                    <IoClose size={30} />
                </button>
            )}

            {/* Main Content Area */}
            {/* 👇 IMPORTANT: position: 'relative' yahan hona hi chahiye */}
            <div 
                className="story-content" 
                style={{ position: 'relative' }} 
                onClick={() => {
                    if(showViewersList) setShowViewersList(false);
                }}
            >
                {/* Header Info */}
                <div className="story-header-info">
                    <div className="user-details-row">
                        <img src={story.user?.photoURL || "https://via.placeholder.com/40"} alt="user" className="story-header-avatar" />
                        <span className="story-header-name">{story.user?.name}</span>
                        <span className="story-time">
                           {updating ? "Updating..." : new Date(story.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>

                    {isMine && !showViewersList && (
                        <div className="story-menu-container">
                            <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} style={{background:'none', border:'none', cursor:'pointer'}}>
                                <IoEllipsisVertical size={24} color="white" />
                            </button>
                            {showMenu && (
                                <div className="story-dropdown">
                                    <button onClick={() => fileInputRef.current.click()}><IoPencil/> Edit</button>
                                    <button onClick={handleDelete}><IoTrash/> Delete</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Media Display */}
                {story.type === 'video' ? (
                    <video src={story.mediaUrl} autoPlay loop className="story-media-full" />
                ) : (
                    <img src={story.mediaUrl} alt="story" className="story-media-full" />
                )}

                {/* 🔥 VIEW BUTTON (Fix for Desktop & Mobile) 🔥 */}
                {/* Fixed style hata diya, ab CSS class use hogi */}
                {isMine && !showViewersList && (
                    <div 
                        className="story-views-btn" 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            setShowViewersList(true); 
                        }}
                    >
                        <IoEye size={20} color="white" />
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                            {viewCount} Views
                        </span>
                    </div>
                )}
            </div>

            {/* 🔥 VIEWERS LIST MODAL (No Search) 🔥 */}
            {showViewersList && (
                <div className="viewers-list-overlay">
                    
                    {/* Header */}
                    <div className="viewers-header">
                        <span>Viewers ({viewCount})</span>
                        <button onClick={() => setShowViewersList(false)} style={{background:'none', border:'none', cursor:'pointer'}}>
                            <IoClose size={24} color="white" />
                        </button>
                    </div>

                    {/* Scrollable List */}
                    <div className="viewers-scroll-area">
                        {story.viewers && story.viewers.length > 0 ? (
                            story.viewers.map((viewer, index) => (
                                <div key={index} className="viewer-row">
                                    <img 
                                        src={viewer.photoURL || "https://via.placeholder.com/40"} 
                                        alt={viewer.name} 
                                        className="viewer-img" 
                                    />
                                    <span className="viewer-name">{viewer.name}</span>
                                </div>
                            ))
                        ) : (
                            <p className="no-views-text">No views yet.</p>
                        )}
                    </div>
                </div>
            )}

            <input type="file" ref={fileInputRef} style={{display:'none'}} onChange={handleFileChange} />
        </div>
    );
};

export default StoryViewerModal;