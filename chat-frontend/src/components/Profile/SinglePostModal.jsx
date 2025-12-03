// import React, { useState } from 'react';
// import { IoClose, IoEllipsisVertical, IoTrash, IoPencil, IoCheckmark } from 'react-icons/io5';
// import client from '../../api/api';
// import './SinglePostModal.css'; // Iska CSS niche hai

// const SinglePostModal = ({ post, onClose, onDeleteSuccess, onUpdateSuccess }) => {
//     const [showMenu, setShowMenu] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [caption, setCaption] = useState(post.caption || "");
//     const [loading, setLoading] = useState(false);

//     // --- 1. DELETE POST ---
//     const handleDelete = async () => {
//         if (!window.confirm("Are you sure you want to delete this post?")) return;
        
//         try {
//             await client.delete(`/posts/${post._id}`);
//             onDeleteSuccess(post._id); // Parent ko batao remove karne ko
//             onClose(); // Modal band
//         } catch (error) {
//             console.error("Delete failed", error);
//             alert("Failed to delete post");
//         }
//     };

//     // --- 2. UPDATE POST ---
//     const handleUpdate = async () => {
//         setLoading(true);
//         try {
//             const res = await client.put(`/posts/${post._id}`, { caption });
//             if (res.data.success) {
//                 onUpdateSuccess(post._id, caption); // Parent update karega
//                 setIsEditing(false);
//             }
//         } catch (error) {
//             console.error("Update failed", error);
//             alert("Failed to update caption");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="modal-overlay" onClick={onClose}>
//             {/* stopPropagation: Taki card pe click karne se modal band na ho */}
//             <div className="single-post-card" onClick={(e) => e.stopPropagation()}>
                
//                 {/* --- LEFT: MEDIA --- */}
//                 <div className="post-media-section">
//                     {post.mediaUrl && (post.type === 'video' || post.mediaUrl.endsWith('.mp4')) ? (
//                         <video src={post.mediaUrl} controls className="full-media" />
//                     ) : (
//                         <img src={post.mediaUrl} alt="Post" className="full-media" />
//                     )}
//                 </div>

//                 {/* --- RIGHT: DETAILS --- */}
//                 <div className="post-details-section">
                    
//                     {/* Header: User Info + Menu */}
//                     <div className="post-card-header">
//                         <div className="user-info">
//                             <img src={post.author?.avatar || "https://via.placeholder.com/40"} className="header-avatar" alt="user" />
//                             <span className="header-username">{post.author?.name}</span>
//                         </div>

//                         {/* Three Dots Menu */}
//                         <div className="menu-wrapper">
//                             <button className="menu-btn" onClick={() => setShowMenu(!showMenu)}>
//                                 <IoEllipsisVertical size={20} />
//                             </button>

//                             {showMenu && (
//                                 <div className="post-options-dropdown">
//                                     <button onClick={() => { setIsEditing(true); setShowMenu(false); }}>
//                                         <IoPencil /> Edit
//                                     </button>
//                                     <button className="delete-option" onClick={handleDelete}>
//                                         <IoTrash /> Delete
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Caption Area */}
//                     <div className="post-caption-area">
//                         {isEditing ? (
//                             <div className="edit-box">
//                                 <textarea 
//                                     value={caption} 
//                                     onChange={(e) => setCaption(e.target.value)}
//                                     rows={4}
//                                 />
//                                 <div className="edit-actions">
//                                     <button onClick={handleUpdate} disabled={loading} className="save-btn">
//                                         {loading ? "Saving..." : "Save"}
//                                     </button>
//                                     <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <p className="caption-text">
//                                 <span className="bold-name">{post.author?.name}</span> {caption}
//                             </p>
//                         )}
//                     </div>

//                     {/* Likes / Date Footer */}
//                     <div className="post-card-footer">
//                         <p>{post.likes.length} likes</p>
//                         <span className="post-date">{new Date(post.createdAt).toDateString()}</span>
//                     </div>

//                 </div>

//                 {/* Close Button (Absolute) */}
//                 <button className="absolute-close-btn" onClick={onClose}>
//                     <IoClose size={30} color="#fff" />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default SinglePostModal;



import React, { useState, useRef, useEffect } from 'react';
import { IoClose, IoEllipsisVertical, IoTrash, IoPencil, IoCloudUpload } from 'react-icons/io5';
import client from '../../api/api';
import './SinglePostModal.css';

const SinglePostModal = ({ post, onClose, onDeleteSuccess, onUpdateSuccess }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [caption, setCaption] = useState(post.caption || "");
    const [loading, setLoading] = useState(false);

    // New Media States
    const [newMediaFile, setNewMediaFile] = useState(null);
    const [newMediaPreview, setNewMediaPreview] = useState(null);
    
    const fileInputRef = useRef(null);

    // Cleanup Preview URL
    useEffect(() => {
        return () => {
            if (newMediaPreview) URL.revokeObjectURL(newMediaPreview);
        };
    }, [newMediaPreview]);

    // File Change Handler
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewMediaFile(file);
            setNewMediaPreview(URL.createObjectURL(file));
        }
    };

    // Delete Handler
    const handleDelete = async () => {
        if (!window.confirm("Delete this post?")) return;
        try {
            await client.delete(`/posts/${post._id}`);
            onDeleteSuccess(post._id);
            onClose();
        } catch (error) { console.error(error); }
    };

    // Update Handler
    const handleUpdate = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('caption', caption);
            if (newMediaFile) formData.append('file', newMediaFile);

            const res = await client.put(`/posts/${post._id}`, formData);
            if (res.data.success) {
                onUpdateSuccess(post._id, res.data.post);
                setIsEditing(false);
                setNewMediaFile(null);
                setNewMediaPreview(null);
            }
        } catch (error) {
            console.error(error);
            alert("Update failed.");
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIC TO SHOW MEDIA ---
    // 1. Kaunsa source dikhana hai? (Naya preview ya purana URL)
    const sourceUrl = newMediaPreview || post.mediaUrl;

    // 2. Kya ye video hai?
    // Agar nayi file hai -> uska type check karo.
    // Agar purani file hai -> post ka type check karo ya extension.
    const isVideo = newMediaFile 
        ? newMediaFile.type.startsWith('video/') 
        : (post.type === 'video' || post.mediaUrl?.endsWith('.mp4') || post.mediaUrl?.endsWith('.mov'));

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="single-post-card" onClick={(e) => e.stopPropagation()}>
                
                {/* --- LEFT: MEDIA SECTION --- */}
                <div className="post-media-section">
                    {sourceUrl && isVideo ? (
                        <video src={sourceUrl} controls className="full-media" />
                    ) : sourceUrl ? (
                        <img src={sourceUrl} alt="Post" className="full-media" />
                    ) : (
                        <div style={{color:'white'}}>No Media</div>
                    )}

                    {/* Edit Mode Overlay */}
                    {isEditing && (
                        <div className="edit-media-overlay">
                            <button onClick={() => fileInputRef.current.click()} className="change-media-btn">
                                <IoCloudUpload size={24} /> Change Media
                            </button>
                            
                            {/* Reset Button (Only if new file selected) */}
                            {newMediaPreview && (
                                <button 
                                    onClick={() => {
                                        setNewMediaFile(null);
                                        setNewMediaPreview(null);
                                        // Reset karte waqt hidden input ko bhi clear karo
                                        if(fileInputRef.current) fileInputRef.current.value = "";
                                    }} 
                                    className="reset-media-btn"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    )}

                    {/* Hidden Input - Isko loop se bahar rakha hai */}
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        style={{ display: 'none' }} 
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                    />
                </div>

                {/* --- RIGHT: DETAILS SECTION --- */}
                <div className="post-details-section">
                    <div className="post-card-header">
                        <div className="user-info">
                            <img src={post.author?.photoURL || "https://via.placeholder.com/40"} className="header-avatar" alt="user" />
                            <span className="header-username">{post.author?.name}</span>
                        </div>
                        <div className="menu-wrapper">
                            <button className="menu-btn" onClick={() => setShowMenu(!showMenu)}>
                                <IoEllipsisVertical size={20} />
                            </button>
                            {showMenu && (
                                <div className="post-options-dropdown">
                                    <button onClick={() => { setIsEditing(true); setShowMenu(false); }}>
                                        <IoPencil /> Edit
                                    </button>
                                    <button className="delete-option" onClick={handleDelete}>
                                        <IoTrash /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="post-caption-area">
                        {isEditing ? (
                            <div className="edit-box">
                                <textarea 
                                    value={caption} 
                                    onChange={(e) => setCaption(e.target.value)}
                                    rows={4}
                                    placeholder="Write a caption..."
                                />
                                <div className="edit-actions">
                                    <button onClick={handleUpdate} disabled={loading} className="save-btn">
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                    <button onClick={() => {
                                        setIsEditing(false);
                                        setNewMediaFile(null);
                                        setNewMediaPreview(null);
                                        setCaption(post.caption);
                                    }} className="cancel-btn">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <p className="caption-text">
                                <span className="bold-name">{post.author?.name}</span> {caption}
                            </p>
                        )}
                    </div>

                    <div className="post-card-footer">
                        <p>{post.likes.length} likes</p>
                        <span className="post-date">{new Date(post.createdAt).toDateString()}</span>
                    </div>
                </div>

                <button className="absolute-close-btn" onClick={onClose}>
                    <IoClose size={30} color="#fff" />
                </button>
            </div>
        </div>
    );
};

export default SinglePostModal;