// import React, { useState, useContext } from 'react';
// import { AuthContext } from '../../context/AuthContext';
// import API from '../../api/api'; 
// import { useNavigate } from 'react-router-dom';
// import { IoClose } from 'react-icons/io5'; 
// import './EditProfileModal.css'; 

// const EditProfileModal = ({ onClose }) => {
//     const { user, logout, login } = useContext(AuthContext);
//     const navigate = useNavigate();

//     // Form State
//     const [formData, setFormData] = useState({
//         name: user?.name || '',
//         email: user?.email || '',
//         username: user?.username || '',
//         bio: user?.bio || '',
//         photoURL: user?.avatar || user?.photoURL || '', 
//     });
    
//     // Sirf File State bacha hai
//     const [file, setFile] = useState(null); 

//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     // HANDLE FILE SELECTION (Gallery)
//     const handleFileChange = (e) => {
//         const selectedFile = e.target.files[0];
//         if (selectedFile) {
//             setFile(selectedFile);
//             // Preview ke liye temporary URL set kar rahe hain
//             setFormData({ ...formData, photoURL: URL.createObjectURL(selectedFile) });
//         }
//     };

//     // --- UPDATE PROFILE HANDLER ---
//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");
//         setSuccess("");

//         const token = localStorage.getItem("token");
//         if (!token || !user) {
//             setError("You are not authenticated.");
//             setLoading(false);
//             return;
//         }

//         const dataToSend = new FormData();
//         dataToSend.append("name", formData.name);
//         dataToSend.append("bio", formData.bio);

//         // Logic: Agar File select ki hai to 'photo' bhejo
//         if (file) {
//             dataToSend.append("photo", file); 
//         } else {
//             // Agar file change nahi ki, to purana URL bhej do (backend handle kar lega)
//             dataToSend.append("photoURL", formData.photoURL); 
//         }

//         if (password && password.trim() !== "") {
//             dataToSend.append("password", password);
//         }

//         try {
//             const res = await API.put(`/auth/${user._id}`, dataToSend, {
//                 headers: { 
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "multipart/form-data" 
//                 }
//             });

//             localStorage.setItem("user", JSON.stringify(res.data.user));
            
//             login({ 
//                 user: res.data.user, 
//                 token: token 
//             });

//             setSuccess("Profile updated successfully!");
//             setPassword(""); 
//             setFile(null); 

//         } catch (err) {
//             console.error(err);
//             setError(err.response?.data?.msg || "Failed to update profile.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // --- DELETE ACCOUNT HANDLER ---
//     const handleDelete = async () => {
//         if (!window.confirm("ARE YOU SURE? This action cannot be undone.")) {
//             return;
//         }
//         setLoading(true);
//         try {
//             const token = localStorage.getItem("token");
//             await API.delete(`/auth/${user._id}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             logout();
//             navigate("/login");
//         } catch (err) {
//             setError(err.response?.data?.msg || "Failed to delete account.");
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="modal-overlay">
//             <div className="edit-modal-content">
                
//                 <div className="modal-header">
//                     <h3>Edit Profile</h3>
//                     <button onClick={onClose} className="close-btn">
//                         <IoClose size={24} />
//                     </button>
//                 </div>

//                 <div className="modal-body scrollable-body">
//                     <form className="profile-form" onSubmit={handleUpdate}>
                        
//                         {/* --- IMAGE PREVIEW & UPLOAD BUTTON --- */}
//                         <div style={{textAlign: 'center', marginBottom: '20px'}}>
//                             <img 
//                                 src={formData.photoURL || "https://via.placeholder.com/100"} 
//                                 alt="Avatar" 
//                                 className="profile-avatar-preview"
//                                 onError={(e) => { e.target.src = "https://via.placeholder.com/100" }} 
//                             />
                            
//                             <div style={{ marginTop: "15px", display: "flex", justifyContent: "center" }}>
//                                 {/* Sirf Upload Button Bacha Hai */}
//                                 <label className="profile-btn" style={{background: "#ddd", color: "#333", cursor: "pointer"}}>
//                                     📁 Upload Photo
//                                     <input 
//                                         type="file" 
//                                         onChange={handleFileChange} 
//                                         accept="image/*"
//                                         style={{ display: "none" }} 
//                                     />
//                                 </label>
//                             </div>
//                         </div>
//                         {/* ------------------------------------- */}

//                         <label>Name</label>
//                         <input 
//                             type="text" 
//                             name="name" 
//                             value={formData.name} 
//                             onChange={handleChange} 
//                             placeholder="Your Name"
//                         />

//                         <label>Email (Cannot be changed)</label>
//                         <input 
//                             type="email" 
//                             value={formData.email} 
//                             disabled 
//                             className="disabled-input" 
//                         />

//                         <label>Bio</label>
//                         <textarea 
//                             name="bio" 
//                             value={formData.bio} 
//                             onChange={handleChange} 
//                             rows={3} 
//                             placeholder="Tell us about yourself..."
//                         />

//                         <label>New Password</label>
//                         <input 
//                             type="password" 
//                             value={password} 
//                             onChange={(e) => setPassword(e.target.value)} 
//                             placeholder="Leave blank to keep current password" 
//                         />

//                         {success && <p className="profile-success">{success}</p>}
//                         {error && <p className="profile-error">{error}</p>}

//                         <button type="submit" className="profile-btn update-btn" disabled={loading}>
//                             {loading ? "Updating..." : "Save Changes"}
//                         </button>

//                         <hr className="profile-divider" />

//                         <button 
//                             type="button" 
//                             className="profile-btn delete-btn" 
//                             onClick={handleDelete} 
//                             disabled={loading}
//                         >
//                             Delete Account
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditProfileModal;




import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Path check kar lena
import API from '../../api/api'; 
import { useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5'; 
import './EditProfileModal.css'; 

const EditProfileModal = ({ onClose }) => {
    const { user, logout, login } = useContext(AuthContext);
    const navigate = useNavigate();

    // --- FORM STATE ---
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        username: user?.username || '', // ✅ Username State Added
        bio: user?.bio || '',
        photoURL: user?.avatar || user?.photoURL || '', 
    });
    
    const [file, setFile] = useState(null); 
    const [password, setPassword] = useState("");
    
    // UI States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle File Selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            // Instant Preview
            setFormData({ ...formData, photoURL: URL.createObjectURL(selectedFile) });
        }
    };

    // --- UPDATE PROFILE HANDLER ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");
        if (!token || !user) {
            setError("You are not authenticated.");
            setLoading(false);
            return;
        }

        const dataToSend = new FormData();
        dataToSend.append("name", formData.name);
        
        // ✅ USERNAME LOGIC: Send only if exists
        if (formData.username) {
            dataToSend.append("username", formData.username);
        }

        dataToSend.append("bio", formData.bio);

        // Photo Logic
        if (file) {
            dataToSend.append("photo", file); 
        } else {
            dataToSend.append("photoURL", formData.photoURL); 
        }

        // Password Logic
        if (password && password.trim() !== "") {
            dataToSend.append("password", password);
        }

        try {
            const res = await API.put(`/auth/${user._id}`, dataToSend, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data" 
                }
            });

            // Update Local Storage & Context
            localStorage.setItem("user", JSON.stringify(res.data.user));
            
            login({ 
                user: res.data.user, 
                token: token 
            });

            setSuccess("Profile updated successfully!");
            setPassword(""); 
            setFile(null); 

        } catch (err) {
            console.error(err);
            // Backend duplicate username error handle karega
            setError(err.response?.data?.msg || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    // --- DELETE ACCOUNT HANDLER ---
    const handleDelete = async () => {
        if (!window.confirm("ARE YOU SURE? This action cannot be undone.")) {
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await API.delete(`/auth/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            logout();
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.msg || "Failed to delete account.");
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="edit-modal-content">
                
                <div className="modal-header">
                    <h3>Edit Profile</h3>
                    <button onClick={onClose} className="close-btn">
                        <IoClose size={24} />
                    </button>
                </div>

                <div className="modal-body scrollable-body">
                    <form className="profile-form" onSubmit={handleUpdate}>
                        
                        {/* --- IMAGE UPLOAD SECTION --- */}
                        <div style={{textAlign: 'center', marginBottom: '20px'}}>
                            <img 
                                src={formData.photoURL || "https://via.placeholder.com/100"} 
                                alt="Avatar" 
                                className="profile-avatar-preview"
                                onError={(e) => { e.target.src = "https://via.placeholder.com/100" }} 
                            />
                            
                            <div style={{ marginTop: "15px", display: "flex", justifyContent: "center" }}>
                                <label className="profile-btn" style={{background: "#ddd", color: "#333", cursor: "pointer"}}>
                                    📁 Upload Photo
                                    <input 
                                        type="file" 
                                        onChange={handleFileChange} 
                                        accept="image/*"
                                        style={{ display: "none" }} 
                                    />
                                </label>
                            </div>
                        </div>

                        {/* --- FORM FIELDS --- */}

                        <label>Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            placeholder="Your Name"
                        />

                        {/* ✅ USERNAME INPUT FIELD ADDED */}
                        <label>Username</label>
                        <input 
                            type="text" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleChange} 
                            placeholder="Unique Username"
                            required
                        />

                        <label>Email (Cannot be changed)</label>
                        <input 
                            type="email" 
                            value={formData.email} 
                            disabled 
                            className="disabled-input" 
                        />

                        <label>Bio</label>
                        <textarea 
                            name="bio" 
                            value={formData.bio} 
                            onChange={handleChange} 
                            rows={3} 
                            placeholder="Tell us about yourself..."
                        />

                        <label>New Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Leave blank to keep current password" 
                        />

                        {/* Messages */}
                        {success && <p className="profile-success">{success}</p>}
                        {error && <p className="profile-error">{error}</p>}

                        {/* Action Buttons */}
                        <button type="submit" className="profile-btn update-btn" disabled={loading}>
                            {loading ? "Updating..." : "Save Changes"}
                        </button>

                        <hr className="profile-divider" />

                        <button 
                            type="button" 
                            className="profile-btn delete-btn" 
                            onClick={handleDelete} 
                            disabled={loading}
                        >
                            Delete Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;