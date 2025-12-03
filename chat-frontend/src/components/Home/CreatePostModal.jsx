// import React, { useState, useRef } from "react";
// import { IoClose, IoImage, IoVideocam, IoCloudUpload } from "react-icons/io5";
// import client from "../../api/api";
// import "./CreatePostModal.css"; // CSS File

// const CreatePostModal = ({ onClose, onPostSuccess }) => {
//   const [caption, setCaption] = useState("");
//   const [media, setMedia] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);
  
//   const fileInputRef = useRef();

//   // 1. File Select Handle Karna
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setMedia(file);
//       setPreview(URL.createObjectURL(file)); // Preview URL create karo
//     }
//   };

//   // 2. Post Submit Karna
//   const handleSubmit = async () => {
//     if (!media) return alert("Please select an image or video!");

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("caption", caption);
//     formData.append("file", media); // Backend mein humne 'file' naam rakha tha

//     try {
//       // Header 'multipart/form-data' Axios khud set kar leta hai jab FormData bhejte hain
//       const res = await client.post("/posts", formData);

//       if (res.data.success) {
//         onPostSuccess(); // Feed refresh karne ke liye callback
//         onClose(); // Modal band karo
//       }
//     } catch (error) {
//       console.error("Post upload failed:", error);
//       alert("Error creating post");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="create-post-card">
        
//         {/* Header */}
//         <div className="modal-header">
//           <h3>Create Post</h3>
//           <button onClick={onClose} className="close-btn">
//             <IoClose size={24} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="modal-body">
          
//           {/* Caption Input */}
//           <textarea
//             className="caption-input"
//             placeholder="What's on your mind?"
//             value={caption}
//             onChange={(e) => setCaption(e.target.value)}
//             rows={3}
//           />

//           {/* Image Preview Area */}
//           {preview ? (
//             <div className="preview-container">
//               <img src={preview} alt="Preview" className="media-preview" />
//               <button onClick={() => { setMedia(null); setPreview(null); }} className="remove-media-btn">
//                 <IoClose />
//               </button>
//             </div>
//           ) : (
//             // Upload Placeholder
//             <div 
//                 className="upload-placeholder" 
//                 onClick={() => fileInputRef.current.click()}
//             >
//                 <IoCloudUpload size={40} color="#3b82f6" />
//                 <p>Click to upload photos/videos</p>
//             </div>
//           )}

//           {/* Hidden File Input */}
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             style={{ display: "none" }}
//             accept="image/*,video/*"
//           />
//         </div>

//         {/* Footer Actions */}
//         <div className="modal-footer">
//           <div className="add-media-icons">
//              {/* Shortcuts to trigger file input */}
//             <IoImage size={24} color="#22c55e" onClick={() => fileInputRef.current.click()} style={{cursor:'pointer'}} />
//             <IoVideocam size={24} color="#ef4444" onClick={() => fileInputRef.current.click()} style={{cursor:'pointer'}} />
//           </div>

//           <button 
//             className="post-submit-btn" 
//             onClick={handleSubmit} 
//             disabled={loading || !media}
//           >
//             {loading ? "Posting..." : "Post"}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default CreatePostModal;


import React, { useState, useRef } from "react";
import { IoClose, IoImage, IoVideocam, IoCloudUpload } from "react-icons/io5";
import client from "../../api/api";
import "./CreatePostModal.css"; 

const CreatePostModal = ({ onClose, onPostSuccess }) => {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!media) return alert("Please select an image or video!");

    setLoading(true);
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("file", media);

    try {
      const res = await client.post("/posts", formData);

      if (res.data.success) {
        onPostSuccess(); 
        onClose(); 
        // setLoading(false) yahan se hata diya (Fix)
      }
    } catch (error) {
      console.error("Post upload failed:", error);
      alert("Error creating post");
      setLoading(false); // Sirf error aane par loading band karo
    }
  };

  return (
    <div className="modal-overlay">
      <div className="create-post-card">
        
        <div className="modal-header">
          <h3>Create Post</h3>
          <button onClick={onClose} className="close-btn">
            <IoClose size={24} />
          </button>
        </div>

        <div className="modal-body">
          <textarea
            className="caption-input"
            placeholder="What's on your mind?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
          />

          {/* 👇 VIDEO PREVIEW FIX YAHAN HAI 👇 */}
          {preview ? (
            <div className="preview-container">
              {media?.type.startsWith("video/") ? (
                <video src={preview} className="media-preview" controls />
              ) : (
                <img src={preview} alt="Preview" className="media-preview" />
              )}
              
              <button onClick={() => { setMedia(null); setPreview(null); }} className="remove-media-btn">
                <IoClose />
              </button>
            </div>
          ) : (
            <div 
                className="upload-placeholder" 
                onClick={() => fileInputRef.current.click()}
            >
                <IoCloudUpload size={40} color="#3b82f6" />
                <p>Click to upload photos/videos</p>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept="image/*,video/*"
          />
        </div>

        <div className="modal-footer">
          <div className="add-media-icons">
            <IoImage size={24} color="#22c55e" onClick={() => fileInputRef.current.click()} style={{cursor:'pointer'}} />
            <IoVideocam size={24} color="#ef4444" onClick={() => fileInputRef.current.click()} style={{cursor:'pointer'}} />
          </div>

          <button 
            className="post-submit-btn" 
            onClick={handleSubmit} 
            disabled={loading || !media}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreatePostModal;