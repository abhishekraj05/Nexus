import React, { useState, useEffect, useRef } from "react";
import API from "../../api/api"; // Updated import
import { FaHeart, FaRegHeart, FaTrash, FaPen } from "react-icons/fa";
import "./Reels.css";

// ==========================================
// 🎬 SINGLE REEL COMPONENT
// ==========================================
const SingleReel = ({ 
  reel, listType, currentUserId, 
  handleLike, handleDelete, 
  // Edit Props receive kar rahe hain
  startEditing, isEditing, editState, setEditState, saveEdit, cancelEdit 
}) => {
  
  const videoRef = useRef(null);
  const isLiked = reel.likes.includes(currentUserId);

  const togglePlay = () => {
    if (videoRef.current.paused) videoRef.current.play();
    else videoRef.current.pause();
  };

  return (
    <div className="single-reel">
      <video
        ref={videoRef}
        src={reel.mediaUrl}
        className="video-player"
        loop
        onClick={togglePlay}
      />

      {/* --- OVERLAY: BOTTOM INFO (Name, Caption, Edit Form) --- */}
      <div className="reel-overlay-info">
        
        {/* Agar Edit Mode ON hai to FORM dikhao */}
        {isEditing ? (
          <div className="edit-input-group">
            <input 
              type="text" 
              className="edit-text-input"
              value={editState.caption}
              onChange={(e) => setEditState({...editState, caption: e.target.value})}
              placeholder="Edit Caption..."
            />
            <select 
              className="edit-select-input"
              value={editState.visibility}
              onChange={(e) => setEditState({...editState, visibility: e.target.value})}
            >
              <option value="public">🌍 Public</option>
              <option value="private">🔒 Private</option>
              <option value="only_me">👤 Only Me</option>
            </select>
            <div className="edit-btn-row">
              <button className="small-btn save-btn" onClick={() => saveEdit(reel._id)}>Save</button>
              <button className="small-btn cancel-btn" onClick={cancelEdit}>Cancel</button>
            </div>
          </div>
        ) : (
          // Normal Mode: Sirf Info dikhao
          <>
            <div className="user-details">
              <img src={reel.author?.photoURL || "https://via.placeholder.com/40"} className="user-avatar" alt="user" />
              <span className="username">{reel.author?.name}</span>
              {reel.visibility !== 'public' && (
                 <span style={{fontSize:'10px', background:'#333', padding:'2px 5px', borderRadius:'4px', marginLeft:'5px'}}>
                   {reel.visibility}
                 </span>
              )}
            </div>
            <p className="caption-text">{reel.caption}</p>
          </>
        )}
      </div>

      {/* --- OVERLAY: RIGHT ACTIONS --- */}
      <div className="reel-right-actions">
        
        {/* LIKE */}
        <button className="action-btn" onClick={() => handleLike(reel._id, listType)}>
          {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
          <span className="action-text">{reel.likes.length}</span>
        </button>

        {/* EDIT & DELETE (Sirf My Reels mein) */}
        {listType === 'my_reels' && !isEditing && (
          <>
            {/* Edit Button */}
            <button className="action-btn" onClick={() => startEditing(reel)}>
              <FaPen size={18} />
              <span className="action-text" style={{fontSize: '10px'}}>Edit</span>
            </button>

            {/* Delete Button */}
            <button className="action-btn" onClick={() => handleDelete(reel._id)}>
              <FaTrash size={18} />
              <span className="action-text" style={{fontSize: '10px'}}>Del</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};


// ==========================================
// 📱 MAIN PAGE COMPONENT
// ==========================================
const ReelsPage = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [reels, setReels] = useState([]);
  const [myReels, setMyReels] = useState([]);
  const [loading, setLoading] = useState(false);

  // Upload State
  const [videoFile, setVideoFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [uploading, setUploading] = useState(false);

  // 🔥 EDIT STATE (Jo gayab tha)
  const [editingReelId, setEditingReelId] = useState(null);
  const [editState, setEditState] = useState({ caption: "", visibility: "public" });

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // --- FETCH LOGIC ---
  const fetchFeed = async () => {
    try { 
      setLoading(true); 
      // Using API instead of axios. Headers like Authorization are likely handled by your API interceptor, 
      // but keeping specific headers if your API setup requires manual passing for some reason.
      // Usually API.get('/endpoint') is enough if interceptors are set up.
      // Assuming API handles baseURL, we just need the endpoint.
      const res = await API.get("/reels/feed", { headers: { Authorization: `Bearer ${token}` } }); 
      setReels(res.data.reels); 
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  const fetchMyReels = async () => {
    try { 
      setLoading(true); 
      const res = await API.get("/reels/my-reels", { headers: { Authorization: `Bearer ${token}` } }); 
      setMyReels(res.data.reels); 
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (activeTab === "feed") fetchFeed();
    if (activeTab === "my_reels") fetchMyReels();
  }, [activeTab]);

  // --- ACTIONS ---
  const handleLike = async (reelId, listType) => {
    try {
      const res = await API.put(`/reels/${reelId}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
      const updateList = (list) => list.map(r => r._id === reelId ? { ...r, likes: res.data.likes } : r);
      if (listType === 'feed') setReels(updateList(reels));
      else setMyReels(updateList(myReels));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try { 
      await API.delete(`/reels/${id}`, { headers: { Authorization: `Bearer ${token}` } }); 
      setMyReels(myReels.filter(r => r._id !== id)); 
    } catch (e) { 
      alert("Error"); 
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault(); 
    if (!videoFile) return alert("Select Video"); 
    setUploading(true);
    
    const fd = new FormData(); 
    fd.append("video", videoFile); 
    fd.append("caption", caption); 
    fd.append("visibility", visibility);
    
    try { 
      await API.post("/reels/create", fd, { 
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "multipart/form-data" 
        } 
      }); 
      alert("Uploaded!"); 
      setVideoFile(null); 
      setCaption(""); 
      setActiveTab("my_reels"); 
    } catch (e) { 
      alert("Fail"); 
    } finally { 
      setUploading(false); 
    }
  };

  // 🔥 EDIT LOGIC HANDLERS
  const startEditing = (reel) => {
    setEditingReelId(reel._id);
    setEditState({ caption: reel.caption, visibility: reel.visibility });
  };

  const cancelEdit = () => {
    setEditingReelId(null);
  };

  const saveEdit = async (reelId) => {
    try {
      await API.put(`/reels/${reelId}`, 
        { caption: editState.caption, visibility: editState.visibility }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setMyReels(myReels.map(r => r._id === reelId ? { ...r, caption: editState.caption, visibility: editState.visibility } : r));
      setEditingReelId(null); // Close Edit
    } catch (err) {
      alert("Update Failed");
    }
  };


  return (
    <div className="reels-app-container">
      
      {/* HEADER TABS */}
      <div className="reels-header">
        <button className={`tab-link ${activeTab === "feed" ? "active" : ""}`} onClick={() => setActiveTab("feed")}>Feed</button>
        <button className={`tab-link ${activeTab === "upload" ? "active" : ""}`} onClick={() => setActiveTab("upload")}>Upload</button>
        <button className={`tab-link ${activeTab === "my_reels" ? "active" : ""}`} onClick={() => setActiveTab("my_reels")}>Profile</button>
      </div>

      {/* FEED */}
      {activeTab === "feed" && (
        <div className="reels-feed-container">
          {loading ? <p style={{color:'white', textAlign:'center', marginTop:'100px'}}>Loading...</p> : (
            reels.map(reel => (
              <SingleReel 
                key={reel._id} 
                reel={reel} 
                listType="feed" 
                currentUserId={currentUser._id} 
                handleLike={handleLike} 
              />
            ))
          )}
        </div>
      )}

      {/* MY REELS (Edit functionality enabled here) */}
      {activeTab === "my_reels" && (
        <div className="reels-feed-container">
          {loading ? <p style={{color:'white', textAlign:'center', marginTop:'100px'}}>Loading...</p> : (
            myReels.map(reel => (
              <SingleReel 
                key={reel._id} 
                reel={reel} 
                listType="my_reels" 
                currentUserId={currentUser._id} 
                handleLike={handleLike} 
                handleDelete={handleDelete}
                
                // Passing Edit Props
                startEditing={startEditing}
                isEditing={editingReelId === reel._id}
                editState={editState}
                setEditState={setEditState}
                saveEdit={saveEdit}
                cancelEdit={cancelEdit}
              />
            ))
          )}
        </div>
      )}

      {/* UPLOAD FORM */}
      {activeTab === "upload" && (
        <div className="upload-wrapper" >
          <h2 style={{textAlign:'center', marginTop: "40px"}}>Upload Reel</h2>
          <form onSubmit={handleUpload}>
            <input type="file" accept="video/*" className="upload-input" onChange={(e) => setVideoFile(e.target.files[0])} />
            <input type="text" placeholder="Caption..." className="upload-input" value={caption} onChange={(e) => setCaption(e.target.value)} />
            <select className="upload-input" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
              <option value="public">Public</option>
              <option value="private">Friends Only</option>
              <option value="only_me">Only Me</option>
            </select>
            <button type="submit" className="upload-btn" disabled={uploading}>
              {uploading ? "Uploading..." : "Post Reel"}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default ReelsPage;