// // components/FriendSystem/PendingRequests.jsx
// import React, { useState, useEffect } from "react";
// import API from "../../api/api";
// import "./FriendSystem.css";

// const PendingRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [message, setMessage] = useState("");

//   // 1. Saari pending requests fetch karein
//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await API.get("/friends/pending", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setRequests(res.data);
//         if (res.data.length === 0) {
//           setMessage("No pending requests.");
//         }
//       } catch (err) {
//         console.error("Error fetching requests:", err);
//       }
//     };
//     fetchRequests();
//   }, []);

//   const handleResponse = async (requestId, action) => {
//     try {
//       const token = localStorage.getItem("token");
//       await API.post(`/friends/${action}/${requestId}`, null, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // List se us request ko hata dein
//       setRequests(prev => prev.filter(req => req._id !== requestId));
//       setMessage(`Request ${action}ed!`);
      
//       // Step 4: Chat start ho jayega.
//       // Jab user 'Chats' tab par wapas jayega, toh ChatList.jsx
//       // naye dost ko automatically list mein dikha dega.
      
//     } catch (err) {
//       console.error(`Error ${action}ing request:`, err);
//     }
//   };

//   return (
//     <div className="friend-system-container">
//       <h4>Pending Requests</h4>
//       {message && <p className="system-message">{message}</p>}
//       <div className="user-list">
//         {requests.map((req) => (
//           <div key={req._id} className="user-item">
//             <img 
//               src={req.sender.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${req.sender.name}`} 
//               alt={req.sender.name} 
//               className="avatar"
//             />
//             <div className="user-info">
//               <span className="user-name">{req.sender.name}</span>
//             </div>
//             <div className="request-buttons">
//               <button onClick={() => handleResponse(req._id, 'accept')} className="accept-btn">
//                 Accept
//               </button>
//               <button onClick={() => handleResponse(req._id, 'reject')} className="reject-btn">
//                 Reject
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PendingRequests;





// components/FriendSystem/PendingRequests.jsx
import React, { useState, useEffect } from "react";
import API from "../../api/api";
import "./FriendSystem.css"; // CSS file ka naam wahi rakha hai jo tumne diya

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/friends/pending", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
        if (res.data.length === 0) {
          setMessage("No pending requests.");
        }
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };
    fetchRequests();
  }, []);

  const handleResponse = async (requestId, action) => {
    try {
      const token = localStorage.getItem("token");
      await API.post(`/friends/${action}/${requestId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(prev => prev.filter(req => req._id !== requestId));
      setMessage(`Request ${action}ed!`);
    } catch (err) {
      console.error(`Error ${action}ing request:`, err);
    }
  };

  return (
    <div className="pending-req">
      <h4 className="pending-req__title">Pending Requests</h4>
      {message && <p className="pending-req__message">{message}</p>}
      
      <div className="pending-req__list">
        {requests.map((req) => (
          <div key={req._id} className="pending-req__item">
            <div className="pending-req__sender">
              <img 
                src={req.sender.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${req.sender.name}`} 
                alt={req.sender.name} 
                className="pending-req__avatar"
              />
              <div className="pending-req__info">
                <span className="pending-req__name">{req.sender.name}</span>
                {/* Mobile par ye email/info hide ho jayegi */}
                <span className="pending-req__subtitle">Wants to be your friend</span>
              </div>
            </div>
            
            <div className="pending-req__actions">
              <button 
                onClick={() => handleResponse(req._id, 'accept')} 
                className="pending-req__btn pending-req__btn--accept"
              >
                Accept
              </button>
              <button 
                onClick={() => handleResponse(req._id, 'reject')} 
                className="pending-req__btn pending-req__btn--reject"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingRequests;