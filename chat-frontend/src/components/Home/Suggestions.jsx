// import React from 'react';

// // Dummy Suggestion Data
// const suggestedUsers = [
//     { id: 101, name: 'WebDevKing', reason: 'New to your area', avatar: 'https://placehold.co/40x40/f97316/ffffff?text=WK' },
//     { id: 102, name: 'Frontend_Expert', reason: 'Followed by friend_1', avatar: 'https://placehold.co/40x40/6366f1/ffffff?text=FE' },
//     { id: 103, name: 'DesignQueen', reason: 'Popular Creator', avatar: 'https://placehold.co/40x40/ec4899/ffffff?text=DQ' },
// ];

// const SuggestionItem = ({ user }) => (
//     <div className="suggestion-item-home">
//         <div className="suggestion-user-info">
//             <img src={user.avatar} alt={user.name} className="suggestion-avatar" referrerPolicy="no-referrer" />
//             <div className="user-details">
//                 <span className="suggestion-username">{user.name}</span>
//                 <span className="suggestion-reason">{user.reason}</span>
//             </div>
//         </div>
//         <button className="follow-button">Follow</button>
//     </div>
// );

// export default function Suggestions() {
//     return (
//         <div className="suggestions-container-home">
//             <h3 className="suggestions-title">Suggested For You</h3>
//             <div className="suggestions-list">
//                 {suggestedUsers.map(user => (
//                     <SuggestionItem key={user.id} user={user} />
//                 ))}
//             </div>
//         </div>
//     );
// }




import React, { useState, useEffect } from 'react';
import API from '../../api/api'; // Make sure this path is correct
// You might need to import CSS if it's not global
// import './Home.css'; 

const SuggestionItem = ({ user, onAddFriend }) => {
    // Helper to get avatar (reused logic)
    const getAvatarUrl = (u) => {
        const defaultAvatarUrlPattern = `https://api.dicebear.com/7.x/initials/svg?seed=DefaultUser`;
        const useActualPhoto = u?.photoURL && u.photoURL !== defaultAvatarUrlPattern;
        return useActualPhoto
            ? u.photoURL
            : `https://api.dicebear.com/7.x/initials/svg?seed=${u.name || 'User'}`;
    };

    return (
        <div className="suggestion-item-home">
            <div className="suggestion-user-info">
                <img 
                    src={getAvatarUrl(user)} 
                    alt={user.name} 
                    className="suggestion-avatar" 
                    referrerPolicy="no-referrer" 
                />
                <div className="user-details">
                    <span className="suggestion-username">{user.name}</span>
                    <span className="suggestion-reason">Suggested for you</span>
                </div>
            </div>
            <button 
                className="follow-button"
                onClick={() => onAddFriend(user._id)}
                disabled={user.requestSent}
                style={user.requestSent ? {color: '#a1a1aa', cursor: 'default'} : {}}
            >
                {user.requestSent ? 'Sent' : 'Add'}
            </button>
        </div>
    );
};

export default function Suggestions() {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch suggestions on mount
    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                // Assuming you have a token in localStorage
                // You might want to handle the case where token is missing
                const token = localStorage.getItem("token");
                if (!token) return; 

                const res = await API.get("/auth/suggestions", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSuggestions(res.data);
            } catch (err) {
                console.error("Error fetching suggestions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSuggestions();
    }, []);

    // Handle adding a friend
    const handleAddFriend = async (receiverId) => {
        try {
            const token = localStorage.getItem("token");
            await API.post(`/friends/send/${receiverId}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            // Update UI to show "Sent"
            setSuggestions((prev) =>
                prev.map((user) =>
                    user._id === receiverId ? { ...user, requestSent: true } : user
                )
            );
        } catch (err) {
            console.error("Error sending request:", err);
            // Optional: Show an error toast/alert
        }
    };

    if (loading) {
        return (
            <div className="suggestions-container-home">
                <div style={{padding: '20px', color: '#a1a1aa', textAlign: 'center'}}>Loading...</div>
            </div>
        );
    }

    if (suggestions.length === 0) {
        return null; // Or show a message, or hide the container completely
    }

    return (
        <div className="suggestions-container-home">
            <h3 className="suggestions-title">Suggested For You</h3>
            <div className="suggestions-list">
                {suggestions.map(user => (
                    <SuggestionItem 
                        key={user._id} 
                        user={user} 
                        onAddFriend={handleAddFriend} 
                    />
                ))}
            </div>
        </div>
    );
}