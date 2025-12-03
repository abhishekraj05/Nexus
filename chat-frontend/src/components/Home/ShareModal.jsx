import React, { useEffect, useState } from 'react';
import { IoClose, IoPaperPlane, IoShareSocial } from 'react-icons/io5';
import client from "../../api/api";
import './ShareModal.css'; // Iska CSS niche hai

const ShareModal = ({ post, onClose }) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sentList, setSentList] = useState([]); // Track karega kisko bhej diya

    // 1. Friends Fetch Karo
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const res = await client.get('/friends/my-friends'); // Step 1 wala route
                if (res.data.success) {
                    setFriends(res.data.friends);
                }
            } catch (error) {
                console.error("Error loading friends:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFriends();
    }, []);

    // 2. Internal Chat Share (Send Button Logic)
    const handleSendToChat = async (friendId) => {
        try {
            // Chat API call (Message bhejo)
            // Hum Post ka Link ya ID bhejenge text bankar
            const messageText = `Check out this post: ${window.location.origin}/post/${post._id}`;
            
            // Yahan aapki Chat API call hogi (Example)
            // await client.post('/messages/send', { receiverId: friendId, text: messageText });
            
            // UI Update: Button ko 'Sent' kar do
            setSentList([...sentList, friendId]);

        } catch (error) {
            console.error("Failed to send", error);
            alert("Message send failed");
        }
    };

    // 3. Native Share (Purana Feature)
    const handleNativeShare = async () => {
        const shareData = {
            title: 'Codrexa Post',
            text: `Check out this post by ${post.author?.name}`,
            url: `${window.location.origin}/post/${post._id}`
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                onClose(); // Share hone ke baad modal band
            } catch (err) { console.error(err); }
        } else {
            navigator.clipboard.writeText(shareData.url);
            alert("Link copied!");
            onClose();
        }
    };

    return (
        <div className="share-modal-overlay">
            <div className="share-modal-content">
                
                {/* Header */}
                <div className="share-header">
                    <h3>Share to...</h3>
                    <button onClick={onClose} className="close-btn"><IoClose size={24}/></button>
                </div>

                {/* Post Preview (Optional) */}
                {/* <div className="share-preview">
                    <img src={post.mediaUrl} alt="preview" className="share-thumb" />
                    <p className="share-caption">{post.caption?.substring(0, 30)}...</p>
                </div> */}

                {/* Friends List */}
                {/* <div className="friends-list-container">
                    {loading ? <p className="loading-text">Loading friends...</p> : 
                     friends.length === 0 ? <p className="no-friends">No friends found.</p> : 
                    (
                        friends.map(friend => {
                            const isSent = sentList.includes(friend._id);
                            return (
                                <div key={friend._id} className="friend-share-item">
                                    <div className="friend-info">
                                        <img src={friend.avatar || "https://via.placeholder.com/40"} className="friend-avatar" />
                                        <span className="friend-name">{friend.name}</span>
                                    </div>
                                    <button 
                                        className={`send-btn ${isSent ? 'sent' : ''}`}
                                        onClick={() => !isSent && handleSendToChat(friend._id)}
                                        disabled={isSent}
                                    >
                                        {isSent ? 'Sent' : 'Send'}
                                    </button>
                                </div>
                            )
                        })
                    )}
                </div> */}

                {/* Footer: External Share */}
                <div className="share-footer" onClick={handleNativeShare}>
                    <div className="native-share-btn">
                        <div className="icon-circle"><IoShareSocial /></div>
                        <span>Share via other apps...</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ShareModal;


