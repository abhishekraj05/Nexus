import React, { createContext, useState, useRef, useEffect, useContext } from 'react';
import Peer from 'simple-peer'; // WebRTC ko aasan banata hai
import { AuthContext } from './AuthContext';
import { SocketContext } from './SocketContext';

// Google ke free STUN servers (Connection setup ke liye)
const configuration = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }
    ]
};

// 1. Context ko banayein aur export karein
export const CallContext = createContext();

// 2. Provider component banayein jo poore app ko wrap karega
export const CallProvider = ({ children }) => {
    const { user } = useContext(AuthContext); // Logged-in user
    const { socket } = useContext(SocketContext); // Socket connection

    // --- State Variables ---
    const [stream, setStream] = useState(null); // Meri video/audio stream
    const [remoteStream, setRemoteStream] = useState(null); // Doosre user ki video/audio stream
    const [call, setCall] = useState(null); // Incoming call ki details
    const [callAccepted, setCallAccepted] = useState(false); // Kya call accept ho chuki hai?
    const [callEnded, setCallEnded] = useState(false); // Track karta hai call end hui ya nahi
    const [isCalling, setIsCalling] = useState(false); // Kya call UI (black screen) dikhana hai?
    
    // --- Refs ---
    const peerRef = useRef(); // Asli WebRTC connection ko store karta hai

    // 1. Camera aur Mic access lein (FIXED LOGIC)
    useEffect(() => {
        // Function jo naya stream fetch karega
        const getMedia = () => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((currentStream) => {
                    setStream(currentStream);
                })
                .catch(err => {
                    console.error("Error getting user media:", err);
                    if (err.name === "NotAllowedError") {
                        alert("Camera/Mic permission denied. Please allow in browser settings and refresh.");
                    } else if (err.name === "NotReadableError" || err.name === "OverconstrainedError") {
                         alert("Your camera or mic is already in use. Close other apps (Zoom, OBS, other browser tabs) and refresh.");
                    }
                });
        };
        
        // Sirf tab naya stream lein jab stream na ho (page load)
        if (!stream) {
            getMedia();
        }
        
        // Cleanup: Stream ko tabhi band karein jab provider unmount ho (jaise logout)
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]); // 'stream' par depend karega
    // ----------------------------------------------

    // 2. Socket events sunein
    useEffect(() => {
        // Agar socket ready nahi hai, toh kuch na karein
        if (!socket) return;

        // A. Jab koi call kare
        socket.on("call_incoming", ({ signal, from }) => {
            setCall({ isReceivingCall: true, from, signal });
        });
        // B. Jab call accept ho jaaye
        socket.on("call_finalized", ({ signal }) => {
            setCallAccepted(true);
            if (peerRef.current) {
                peerRef.current.signal(signal); // Connection poora karein
            }
        });
        // C. Jab doosra user call kaat de
        socket.on("call_ended", () => {
            leaveCall(false); // Call cleanup karein
        });
        // D. Jab user offline ho
        socket.on("call_failed", ({ msg }) => {
            alert(msg);
            leaveCall(false);
        });

        // Cleanup
        return () => {
            socket.off("call_incoming");
            socket.off("call_finalized");
            socket.off("call_ended");
            socket.off("call_failed");
        };
    }, [socket, stream]); // stream dependency zaroori hai

    // 3. User A (Caller) - Call karne ka function
    const callUser = (receiverId, receiverName) => {
        if (!stream) {
            alert("Cannot start call: Media stream not ready. Please allow camera/mic access and refresh.");
            return;
        }
        setIsCalling(true);
        
        const peer = new Peer({ 
            initiator: true, 
            trickle: false, 
            config: configuration, 
            stream: stream // Active stream attach karein
        });
        peerRef.current = peer;

        peer.on('signal', (offer) => {
            socket.emit('call_user', { 
                userToCall: receiverId,
                signalData: offer,
                from: { _id: user._id, name: user.name, photoURL: user.photoURL }
            });
        });
        
        peer.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream); // Remote stream state mein save karein
        });

        setCall({ from: { _id: receiverId, name: receiverName } }); 
    };

    // 4. User B (Receiver) - Call accept karne ka function
    const acceptCall = () => {
        if (!stream) {
            alert("Cannot accept call: Media stream not ready. Please refresh.");
            return;
        }
        setCallAccepted(true);
        setIsCalling(true);
        
        const peer = new Peer({ 
            initiator: false, 
            trickle: false, 
            config: configuration, 
            stream: stream // Active stream attach karein
        });
        peerRef.current = peer;

        peer.on('signal', (answer) => {
            socket.emit('call_accepted', { 
                signal: answer, 
                to: call.from._id 
            });
        });
        
        peer.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream); // Remote stream state mein save karein
        });

        peer.signal(call.signal);
    };

    // 5. Call kaatna (Hang up) (FIXED LOGIC)
    const leaveCall = (notifyOtherUser = true) => {
        setIsCalling(false);
        setCallAccepted(false);
        setRemoteStream(null);
        
        // Doosre user ko notify karein
        if (notifyOtherUser && call?.from?._id) {
             socket.emit("call_ended", { to: call.from._id });
        }
        
        setCall(null);

        if (peerRef.current) {
            peerRef.current.destroy(); // P2P connection band karein
        }
        
        // --- FIX: Stream ko band NA KAREIN ---
        // (Stream ab sirf tab band hoga jab component unmount hoga)
        // stream?.getTracks().forEach(track => track.stop());
        // setStream(null); 
        // setCallEnded(true); 
        // ------------------------------------
    };
    
    // 6. Context ki value provide karein
    return (
        <CallContext.Provider value={{
            call,
            callAccepted,
            isCalling,
            stream, // Aapki video stream
            remoteStream, // Doosre ki video stream
            callUser,
            acceptCall,
            leaveCall
        }}>
            {children}
        </CallContext.Provider> 
    );
};

