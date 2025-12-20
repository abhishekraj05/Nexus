import React, { useEffect, useState, useRef } from 'react';
import { IoAdd } from 'react-icons/io5';
import client from '../../api/api';
import StoryViewerModal from './StoryViewerModal';
import './Stories.css';

const StoriesBar = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewStory, setViewStory] = useState(null); // Kaunsi story dekh rahe hain
    const [uploading, setUploading] = useState(false);
    
    const fileInputRef = useRef(null);

    // Current User Info (LocalStorage se)
    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    // 1. Fetch Stories
    const fetchStories = async () => {
        try {
            const res = await client.get('/stories/feed');
            if (res.data.success) {
                setStories(res.data.stories);
            }
        } catch (error) {
            console.error("Error fetching stories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    // 2. Handle Upload
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await client.post('/stories', formData);
            if (res.data.success) {
                fetchStories(); // List refresh karo
            }
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="stories-container">
            
            {/* 1. Add Story Circle */}
            <div className="story-item" onClick={() => fileInputRef.current.click()}>
                <div className={`story-circle-border ${uploading ? 'uploading-border' : ''}`}>
                    <img 
                        src={currentUser?.avatar || currentUser?.photoURL || "https://via.placeholder.com/60"} 
                        alt="me" 
                        className="story-avatar" 
                    />
                    <div className="add-story-icon">
                        <IoAdd size={14} color="white" />
                    </div>
                </div>
                <span className="story-username">Your Story</span>
                
                {/* Hidden Input */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{display:'none'}} 
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                />
            </div>

            {/* 2. Friends Stories List */}
            {loading ? <div style={{color:'grey', fontSize:'12px'}}>Loading...</div> : (
                stories.map(story => (
                    <div key={story._id} className="story-item" onClick={() => setViewStory(story)}>
                        <div className="story-circle-border active-story">
                            <img 
                                src={story.user?.photoURL || "https://via.placeholder.com/60"} 
                                alt={story.user?.name} 
                                className="story-avatar" 
                            />
                        </div>
                        <span className="story-username">
                            {/* Agar naam lamba hai to kaat do */}
                            {story.user?.name.length > 10 ? story.user?.name.substring(0,8)+'...' : story.user?.name}
                        </span>
                    </div>
                ))
            )}

            {/* 3. Story Viewer Modal */}
            {viewStory && (
                <StoryViewerModal 
                    story={viewStory} 
                    onClose={() => setViewStory(null)} 
                />
            )}

        </div>
    );
};

export default StoriesBar;


