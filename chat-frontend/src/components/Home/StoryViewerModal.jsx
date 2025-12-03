import React, { useEffect, useState, useRef } from 'react';
import { IoClose, IoTrash, IoPencil, IoEllipsisVertical } from 'react-icons/io5';
import client from '../../api/api';
import './Stories.css';

const StoryViewerModal = ({ story, onClose, onDeleteSuccess }) => {
    const [updating, setUpdating] = useState(false);
    const [showMenu, setShowMenu] = useState(false); // Menu toggle ke liye
    const fileInputRef = useRef(null);

    // --- USER CHECK ---
    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    
    // Safe Check: Dono IDs ko string bana kar compare karo
    const isMine = story.user?._id?.toString() === currentUser?._id?.toString();

    // Auto-Close Timer
    useEffect(() => {
        if (!updating && !showMenu) { // Agar menu khula hai ya update ho raha hai to band mat karo
            const timer = setTimeout(() => { onClose(); }, 5000);
            return () => clearTimeout(timer);
        }
    }, [story, onClose, updating, showMenu]);

    // --- DELETE HANDLER ---
    const handleDelete = async () => {
        if (!window.confirm("Delete this story?")) return;
        try {
            await client.delete(`/stories/${story._id}`);
            if (onDeleteSuccess) onDeleteSuccess();
            onClose();
        } catch (error) { console.error("Delete error", error); }
    };

    // --- UPDATE HANDLER ---
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUpdating(true);
        setShowMenu(false); // Menu band kar do
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await client.put(`/stories/${story._id}`, formData);
            if (res.data.success) {
                alert("Story Updated!");
                if (onDeleteSuccess) onDeleteSuccess();
                onClose();
            }
        } catch (error) {
            console.error("Update error", error);
            alert("Update failed");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="story-viewer-overlay">
            
            {/* Close Button (Top Right Fixed) */}
            <button className="story-close-btn" onClick={onClose}>
                <IoClose size={30} />
            </button>

            <div className="story-content">
                
                {/* --- HEADER SECTION --- */}
                <div className="story-header-info">
                    <div className="user-details-row">

                        <img src={story.user?.photoURL || "https://via.placeholder.com/40"} alt="user" className="story-header-avatar" />

                        <span className="story-header-name">{story.user?.name}</span>
                        <span className="story-time">
                            {updating ? "Updating..." : new Date(story.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>

                    {/* 👇 THREE DOT MENU (Sirf Meri Story par) */}
                    {isMine && (
                        <div className="story-menu-container">
                            <button className="three-dot-btn" onClick={() => setShowMenu(!showMenu)}>
                                <IoEllipsisVertical size={20} />
                            </button>

                            {/* Dropdown */}
                            {showMenu && (
                                <div className="story-dropdown">
                                    <button onClick={() => fileInputRef.current.click()} className="menu-item">
                                        <IoPencil /> Edit
                                    </button>
                                    <button onClick={handleDelete} className="menu-item delete">
                                        <IoTrash /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* --- MEDIA SECTION --- */}
                {story.type === 'video' ? (
                    <video src={story.mediaUrl} autoPlay className="story-media-full" />
                ) : (
                    <img src={story.mediaUrl} alt="story" className="story-media-full" />
                )}

                {/* Hidden Input for Update */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{display:'none'}} 
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};

export default StoryViewerModal;
