import React, { useEffect, useState, useRef } from 'react';
import { IoClose, IoSend, IoEllipsisVertical, IoPencil, IoTrash, IoCheckmark } from 'react-icons/io5';
import client from "../../api/api";
import './CommentModal.css';

const CommentModal = ({ postId, onClose }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState(""); // Bottom Input Value
    const [loading, setLoading] = useState(true);
    const inputRef = useRef(null); // Input ko focus karne ke liye

    // --- STATE VARIABLES ---
    const [editingCommentId, setEditingCommentId] = useState(null); // Agar ye null nahi hai, matlab hum EDIT kar rahe hain
    const [openMenuId, setOpenMenuId] = useState(null); 

    // --- USER ID ---
    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const currentUserId = currentUser ? currentUser._id : null;

    // 1. Fetch Comments
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await client.get(`/comments/${postId}`);
                if (res.data.success) {
                    setComments(res.data.comments);
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [postId]);

    // 2. Menu Toggle
    const toggleMenu = (commentId) => {
        setOpenMenuId(openMenuId === commentId ? null : commentId);
    };

    // 3. Start Editing (Edit click karne par)
    const handleEditClick = (comment) => {
        setEditingCommentId(comment._id); // Batado ki is ID ko edit karna hai
        setNewComment(comment.content);   // Text ko niche wale input mein daal do
        setOpenMenuId(null);              // Menu band karo
        inputRef.current?.focus();        // Input box pe cursor le jao
    };

    // 4. Cancel Editing
    const cancelEdit = () => {
        setEditingCommentId(null);
        setNewComment("");
    };

    // 5. Delete Comment
    const handleDelete = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            const res = await client.delete(`/comments/${commentId}`);
            if (res.data.success) {
                setComments(comments.filter(c => c._id !== commentId));
                setOpenMenuId(null);
                
                // Agar wahi delete kiya jo edit ho raha tha, to edit mode band karo
                if (editingCommentId === commentId) cancelEdit();
            }
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };

    // 6. MAIN SUBMIT FUNCTION (Create aur Update dono yahan se honge)
    const handleSubmit = async () => {
        if (!newComment.trim()) return;

        if (editingCommentId) {
            // --- UPDATE LOGIC ---
            try {
                const res = await client.put(`/comments/${editingCommentId}`, { text: newComment });
                if (res.data.success) {
                    // List update karo
                    setComments(comments.map(c => 
                        c._id === editingCommentId ? { ...c, content: newComment } : c
                    ));
                    cancelEdit(); // Reset everything
                }
            } catch (error) {
                console.error("Update Error:", error);
            }
        } else {
            // --- CREATE LOGIC ---
            try {
                const res = await client.post(`/comments/${postId}`, { text: newComment });
                if (res.data.success) {
                    setComments([res.data.comment, ...comments]);
                    setNewComment("");
                }
            } catch (error) {
                console.error("Add Error:", error);
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                
                {/* Header */}
                <div className="modal-header">
                    <h3>Comments</h3>
                    <button onClick={onClose} className="close-btn"><IoClose size={24} /></button>
                </div>

                {/* Comments List */}
                <div className="comments-list">
                    {loading ? <p className="loading-text">Loading...</p> : 
                     comments.length === 0 ? <p className="no-comments">No comments yet.</p> : 
                    (
                        comments.map((comment) => {
                            const isAuthor = comment.author?._id === currentUserId;
                            // Agar ye comment edit ho raha hai, to thoda highlight karo (Optional)
                            const isEditing = editingCommentId === comment._id;

                            return (
                                <div key={comment._id} className={`comment-item ${isEditing ? 'editing-highlight' : ''}`}>
                                    <img 
                                        src={comment.author?.photoURL || "https://via.placeholder.com/30"} 
                                        alt="avatar" className="comment-avatar"
                                    />

                                    <div className="comment-wrapper">
                                        <div className="comment-bubble">
                                            <span className="comment-username">{comment.author?.name}</span>
                                            <p className="comment-text">{comment.content}</p>
                                        </div>

                                        {/* Three Dot Menu */}
                                        {isAuthor && (
                                            <div className="menu-container">
                                                <button className="three-dot-btn" onClick={() => toggleMenu(comment._id)}>
                                                    <IoEllipsisVertical />
                                                </button>

                                                {openMenuId === comment._id && (
                                                    <div className="dropdown-menu">
                                                        <button onClick={() => handleEditClick(comment)} className="dropdown-item">
                                                            <IoPencil size={14} /> Edit
                                                        </button>
                                                        <button onClick={() => handleDelete(comment._id)} className="dropdown-item delete">
                                                            <IoTrash size={14} /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer Input Section */}
                <div className="footer-container">
                    
                    {/* 🆕 Editing Indicator Bar (Ye tabhi dikhega jab edit mode on ho) */}
                    {editingCommentId && (
                        <div className="editing-indicator">
                            <span>Editing comment...</span>
                            <button onClick={cancelEdit} className="cancel-edit-btn">
                                <IoClose size={16} />
                            </button>
                        </div>
                    )}

                    <div className="comment-input-box">
                        <input 
                            ref={inputRef}
                            type="text" 
                            placeholder={editingCommentId ? "Update your comment..." : "Write a comment..."}
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                        />
                        <button 
                            onClick={handleSubmit} 
                            disabled={!newComment.trim()}
                            className={editingCommentId ? "update-btn" : "send-btn"}
                        >
                            {editingCommentId ? <IoCheckmark size={20} /> : <IoSend size={18} />}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CommentModal;