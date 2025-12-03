// src/socket/socketHandler.js
const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message"); // Ticks ke liye Message model

// Map ko top level par define karein taaki export ho sake
const onlineUsers = new Map(); // { userId -> socketId }

// Helper function to emit status updates to friends (WITH LOGS)
const emitStatusToFriends = async (io, userId, statusEvent, data) => {
    try {
        const user = await User.findById(userId).select("friends").lean();
        if (user && user.friends && user.friends.length > 0) {
            // console.log(`[emitStatus] User ${userId} triggered ${statusEvent}. Found ${user.friends.length} friends.`);
            user.friends.forEach(friendId => {
                const friendIdStr = friendId.toString();
                // console.log(`[emitStatus] Checking friend: ${friendIdStr}`);
                const friendSocketId = onlineUsers.get(friendIdStr);
                if (friendSocketId) {
                    // console.log(`[emitStatus] Friend ${friendIdStr} is ONLINE at socket ${friendSocketId}. Emitting ${statusEvent}.`);
                    io.to(friendSocketId).emit(statusEvent, data);
                } else {
                    // console.log(`[emitStatus] Friend ${friendIdStr} is OFFLINE (not in onlineUsers map).`);
                }
            });
        } else {
             // console.log(`[emitStatus] User ${userId} has no friends or user not found.`);
        }
    } catch (error) {
        console.error(`[emitStatus] Error during ${statusEvent} for user ${userId}:`, error);
    }
};

// --- 1. Main socket logic ko 'socketHandler' function mein daalein ---
const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log(`✅ [Connect] Client connected: ${socket.id}`);

        // --- 2. ADD USER SETUP EVENT ---
        socket.on("setup", async (userId) => {
            if (!userId) return;
            console.log(`🔗 [Setup] User ${userId} linked to socket ${socket.id}`);
            socket.userId = userId; // Socket par user ID store karein
            onlineUsers.set(userId, socket.id); // Map mein add karein

            try {
                await User.findByIdAndUpdate(userId, { online: true });
                emitStatusToFriends(io, userId, "user_online", { userId });
            } catch (error) {
                console.error(`Error setting user ${userId} online:`, error);
            }
        });

        // --- 3. JOIN ROOMS ---
        socket.on("join", (roomId) => { // Personal user room
            socket.join(roomId);
            // console.log(`📥 [Join User] User ${socket.id} joined user room: ${roomId}`);
        });
        socket.on("joinChat", (chatId) => { // Active chat room
            socket.join(chatId);
            // console.log(`🚪 [Join Chat] User ${socket.id} joined chat room: ${chatId}`);
        });

        // --- 4. MESSAGING ---
        // socket.on("sendMessage", async (message) => {
        //     console.log(`📩 [Send Msg] Received 'sendMessage' event for chat: ${message.chatId}`);
        //     try {
        //         const chatId = message.chatId;
        //         if (!chatId) return console.error("❌ [Error] Chat ID missing in message");
                
        //         socket.to(chatId).emit("newMessage", message); // Doosre users ko message bhejein
        //         // console.log(`📤 [Sent] Message sent to room: ${chatId}`);
        //     } catch (err) {
        //         console.error("❌ [Error] in 'sendMessage' event:", err);
        //     }
        // });






        socket.on("sendMessage", async (message) => {
            console.log(`📩 [Send Msg] Received 'sendMessage' event for chat: ${message.chatId}`);
            try {
                const chatId = message.chatId;
                const senderId = socket.userId; // Get sender's ID from socket
                if (!chatId || !senderId) return console.error("❌ [Error] Chat ID or Sender ID missing");

                const chat = await Chat.findById(chatId).select('members');
                if (!chat) return console.error("❌ [Error] Chat not found");

                let isReceiverOnline = false;

                // 1. Sabhi members ko naya message bhejo (sender ke alawa)
                chat.members.forEach(memberId => {
                    const memberIdStr = memberId.toString();
                    if (memberIdStr === senderId) return; // Sender ko wapas mat bhejo

                    const receiverSocketId = onlineUsers.get(memberIdStr);
                    if (receiverSocketId) {
                        // Receiver online hai!
                        isReceiverOnline = true;
                        io.to(receiverSocketId).emit("newMessage", message);
                    }
                });

                // 2. Agar receiver online tha, toh sender ko 'delivered' tick bhejo
                if (isReceiverOnline) {
                    // DB ko 'delivered' update karein (taaki refresh par bhi dikhe)
                    await Message.findByIdAndUpdate(message._id, { $set: { status: 'delivered' } });
                    
                    // Sender ko 'delivered' tick (Grey ✓✓) bhejo
                    socket.emit("update_message_status", { // 'socket.emit' sirf sender ko bhejega
                        messageId: message._id,
                        chatId: chatId,
                        status: 'delivered'
                    });
                }
                
            } catch (err) {
                console.error("❌ [Error] in 'sendMessage' event:", err);
            }
        });

      
      
        /**
         * 5. MESSAGE SEEN (Real-time tick)
         * (Jab receiver (User B) ka chat window khula ho aur message aaye)
         */
       socket.on("message_seen_realtime", async ({ messageId }) => {
            const receiverId = socket.userId;
            if (!messageId || !receiverId) return;

            console.log(`BACKEND: Received "message_seen_realtime" for ${messageId} from receiver ${receiverId}`);

            try {
                // --- YEH RAHA FIX ---
                // Map ko update karne ke liye dynamic key aur $set ka istemal karein
                const seenByKey = `seenBy.${receiverId}`;

                const message = await Message.findByIdAndUpdate(
                    messageId,
                    { 
                        $addToSet: { deliveredTo: receiverId }, // deliveredTo (Array) abhi bhi sahi hai
                        $set: {
                            status: 'seen', // Status ko 'seen' set karein
                            [seenByKey]: new Date() // 'seenBy' (Map) ko $set se update karein
                        }
                    },
                    { new: true }
                ).select('senderId chatId deliveredTo status seenBy');
                // ------------------

                if (!message) return;

                const senderSocketId = onlineUsers.get(message.senderId.toString());

                if (senderSocketId) {
                    console.log(`BACKEND: Emitting "update_message_status" (seen) to sender ${message.senderId}`);
                    io.to(senderSocketId).emit("update_message_status", {
                        messageId: message._id,
                        chatId: message.chatId,
                        status: 'seen', // <-- Blue tick
                        seenBy: Object.fromEntries(message.seenBy || new Map())
                    });
                }
            } catch (error) {
                console.error(`Error processing message_seen_realtime for ${messageId}:`, error);
            }
        });




/**
         * User A calls User B.
         * 'data' contains { userToCall, signalData, from: { _id, name, photoURL } }
         */
        socket.on("call_user", (data) => {
            console.log(`[Socket] User ${data.from.name} is calling ${data.userToCall}`);
            const receiverSocketId = onlineUsers.get(data.userToCall);
            
            if (receiverSocketId) {
                // User B ko call ka offer bhejein
                io.to(receiverSocketId).emit("call_incoming", { 
                    signal: data.signalData, 
                    from: data.from // User A ka object
                });
            } else {
                // User B offline hai
                socket.emit("call_failed", { msg: "User is offline." });
            }
        });

        /**
         * User B accepts the call.
         * 'data' contains { to (User A), signal }
         */
        socket.on("call_accepted", (data) => {
            console.log(`[Socket] Call accepted. Signaling back to ${data.to}`);
            const callerSocketId = onlineUsers.get(data.to); // 'to' matlab original caller (User A)
            
            if (callerSocketId) {
                // User A ko User B ka "answer" signal bhejein
                io.to(callerSocketId).emit("call_finalized", { 
                    signal: data.signal 
                });
            }
        });
        
        /**
         * User hangs up.
         * 'data' contains { to } (doosra user jisko batana hai)
         */
        socket.on("call_ended", (data) => {
            console.log(`[Socket] Call ended. Notifying ${data.to}`);
            const otherUserSocketId = onlineUsers.get(data.to);
            if (otherUserSocketId) {
                io.to(otherUserSocketId).emit("call_ended");
            }
        });
        
        // ------------------------------------




        socket.on("typing", ({ chatId }) => {
            const userId = socket.userId;
            if (!userId) {
                // --- YEH LOG ADD KAREIN ---
                console.log(`BACKEND: Received "typing" but socket.userId is UNDEFINED.`);
                return;
            }
            // --- YEH LOG ADD KAREIN ---
            console.log(`BACKEND: Received "typing" from ${userId}. Emitting "user_typing" to room ${chatId}.`);
            // --------------------------
            socket.to(chatId).emit("user_typing", { chatId, userId });
        });
        
        socket.on("stop_typing", ({ chatId }) => {
            const userId = socket.userId;
            if (!userId) return;
            // --- YEH LOG ADD KAREIN ---
            console.log(`BACKEND: Received "stop_typing". Emitting "user_stopped_typing" to room ${chatId}.`);
            // --------------------------
            socket.to(chatId).emit("user_stopped_typing", { chatId, userId });
        });

        // --- (Duplicate typing handler hata diya gaya) ---

        // --- 7. DISCONNECT ---
        socket.on("disconnect", async () => {
            console.log(`❎ [Disconnect] Client disconnected: ${socket.id}`);
            const userId = socket.userId;

            if (userId) {
                onlineUsers.delete(userId); // Map se hata dein
                const lastSeenTime = new Date();
                try {
                    await User.findByIdAndUpdate(userId, {
                        online: false,
                        lastSeen: lastSeenTime
                    });
                    emitStatusToFriends(io, userId, "user_offline", { userId, lastSeen: lastSeenTime });
                } catch (error) {
                    console.error(`Error setting user ${userId} offline:`, error);
                }
            }
        });
    });
};

// --- 3. Dono ko export karein taaki index.js crash na ho ---
module.exports = { socketHandler, onlineUsers };