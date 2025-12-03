// const Message = require("../models/Message");
// const Chat = require("../models/Chat");
// const CryptoJS = require("crypto-js");

// // AES key for MVP (one key per chat, can be improved later)
// const CHAT_KEY = process.env.CHAT_KEY || "1234567890123456";

// // Send message
// exports.sendMessage = async (req, res) => {
//   try {
//     const { chatId, type, text, mediaUrl } = req.body;

//     // Encrypt text if type === text
//     let encryptedText = text;
//     if (type === "text" && text) {
//       encryptedText = CryptoJS.AES.encrypt(text, CHAT_KEY).toString();
//     }

//     const message = new Message({
//       chatId,
//       senderId: req.user.id,
//       type,
//       text: encryptedText,
//       mediaUrl
//     });

//     await message.save();

//     // Update lastMessage in Chat
//     await Chat.findByIdAndUpdate(chatId, {
//       lastMessage: { text, senderId: req.user.id, timestamp: new Date() }
//     });

//     res.status(201).json(message);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Get messages for a chat
// // exports.getMessages = async (req, res) => {
// //   try {
// //     const { chatId } = req.params;
// //     const messages = await Message.find({ chatId }).populate("senderId", "name email pic").sort({ createdAt: 1 });

// //     // Decrypt text
// //     const decrypted = messages.map((m) => {
// //       let text = m.text;
// //       if (m.type === "text" && text) {
// //         const bytes = CryptoJS.AES.decrypt(text, CHAT_KEY);
// //         text = bytes.toString(CryptoJS.enc.Utf8);
// //       }
// //       return { ...m._doc, text };
// //     });

// //     res.json(decrypted);
// //   } catch (err) {
// //     res.status(500).json({ msg: err.message });
// //   }
// // };





// exports.getMessages = async (req, res) => {
//   try {
//     const { chatId } = req.params;
//     const messages = await Message.find({ chatId })
//       .populate("senderId", "name email pic")
//       .sort({ createdAt: 1 });

//     // Decrypt text SAFELY (crash nahi hoga)
//     const decrypted = messages.map((m) => {
//       let text = m.text;
      
//       // Check karo ki type 'text' hai, text hai, aur text encrypted lag raha hai
//       if (m.type === "text" && text && text.startsWith("U2FsdGVkX1")) {
//         try {
//           // Ise decrypt karne ki koshish karo
//           const bytes = CryptoJS.AES.decrypt(text, CHAT_KEY);
//           text = bytes.toString(CryptoJS.enc.Utf8);
          
//           // Agar key galat thi aur result khaali aaya
//           if (!text) {
//             text = "[Key Galat Hai]"; // Ya wapas 'm.text' dikha do
//           }
//         } catch (e) {
//           // Agar decryption poori tarah fail ho (data galat hai)
//           text = "[Decryption Error]"; // Crash nahi hoga
//         }
//       }
//       // Agar text plain hai (jaise "Hello"), toh woh waisa hi nikal jayega
      
//       return { ...m._doc, text };
//     });

//     res.json(decrypted);
//   } catch (err) {
//     // General server error
//     res.status(500).json({ msg: err.message });
//   }
// };

// exports.editMessage = async (req, res) => {
//   try {
//     const { messageId, newText } = req.body;
//     const message = await Message.findById(messageId);

//     if (!message) return res.status(404).json({ msg: "Message not found" });
//     if (message.senderId.toString() !== req.user.id) return res.status(403).json({ msg: "Not authorized" });

//     // Encrypt text
//     const encryptedText = CryptoJS.AES.encrypt(newText, CHAT_KEY).toString();
//     message.text = encryptedText;
//     message.edited = true;
//     await message.save();

//     res.json(message);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// exports.deleteMessage = async (req, res) => {
//   try {
//     const { messageId } = req.params;
//     const message = await Message.findById(messageId);

//     if (!message) return res.status(404).json({ msg: "Message not found" });
//     if (message.senderId.toString() !== req.user.id) return res.status(403).json({ msg: "Not authorized" });

//     message.deleted = true;
//     await message.save();

//     res.json({ msg: "Message deleted", message });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// exports.reactMessage = async (req, res) => {
//   try {
//     const { messageId, emoji } = req.body;
//     const message = await Message.findById(messageId);
//     if (!message) return res.status(404).json({ msg: "Message not found" });

//     message.reactions.set(req.user.id, emoji);
//     await message.save();
//     res.json(message);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// exports.markDelivered = async (req, res) => {
//   try {
//     const { messageId } = req.body;
//     const message = await Message.findById(messageId);
//     if (!message) return res.status(404).json({ msg: "Message not found" });

//     if (!message.deliveredTo.includes(req.user.id)) message.deliveredTo.push(req.user.id);
//     await message.save();
//     res.json(message);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// exports.markSeen = async (req, res) => {
//   try {
//     const { messageId } = req.body;
//     const message = await Message.findById(messageId);
//     if (!message) return res.status(404).json({ msg: "Message not found" });

//     message.seenBy.set(req.user.id, new Date());
//     await message.save();
//     res.json(message);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };






// const Message = require("../models/Message");
// const Chat = require("../models/Chat");
// const CryptoJS = require("crypto-js");

// // AES key
// const CHAT_KEY = process.env.CHAT_KEY || "1234567890123456";

// // Send message
// exports.sendMessage = async (req, res) => {
//   try {
//     const { chatId, type, text, mediaUrl } = req.body;

//     // Encrypt text if type === text
//     let encryptedText = text;
//     if (type === "text" && text) {
//       encryptedText = CryptoJS.AES.encrypt(text, CHAT_KEY).toString();
//     }

//     const message = new Message({
//       chatId,
//       senderId: req.user.id,
//       type,
//       text: encryptedText, // Encrypted text save kiya
//       mediaUrl,
//     });

//     await message.save();

//     // --- FIX 1 ---
//     // 'lastMessage' mein bhi ENCRYPTED text hi save karein
//     await Chat.findByIdAndUpdate(chatId, {
//       lastMessage: {
//         text: encryptedText, // Yahaan 'text' ki jagah 'encryptedText'
//         senderId: req.user.id,
//         timestamp: new Date(),
//       },
//     });

//     // Client ko naya message bhej diya
//     res.status(201).json(message);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Get messages for a chat
// exports.getMessages = async (req, res) => {
//   try {
//     const { chatId } = req.params;
    
//     // --- FIX 2 ---
//     // Server par decryption (map function) poori tarah hata diya
//     // Sirf database se data fetch kiya aur bhej diya
//     const messages = await Message.find({ chatId })
//       .populate("senderId", "name email pic") // Saath mein sender ki info bhi bhej di
//       .sort({ createdAt: 1 });

//     // Encrypted messages ko jaisa hai, waisa hi bhej diya
//     res.json(messages);

//   } catch (err) {
//     // Ab yeh crash nahi hoga
//     res.status(500).json({ msg: err.message });
//   }
// };

// // --- (Baaki ke functions sahi hain) ---

// exports.editMessage = async (req, res) => {
//   try {
//     const { messageId, newText } = req.body;
//     const message = await Message.findById(messageId);

//     if (!message) return res.status(404).json({ msg: "Message not found" });
//     if (message.senderId.toString() !== req.user.id)
//       return res.status(403).json({ msg: "Not authorized" });

//     // Encrypt text
//     const encryptedText = CryptoJS.AES.encrypt(newText, CHAT_KEY).toString();
//     message.text = encryptedText;
//     message.edited = true;
//     await message.save();

//     res.json(message);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// exports.deleteMessage = async (req, res) => {
//   try {
//     const { messageId } = req.params;
//     const message = await Message.findById(messageId);

//     if (!message) return res.status(404).json({ msg: "Message not found" });
//     if (message.senderId.toString() !== req.user.id)
//       return res.status(403).json({ msg: "Not authorized" });

//     message.deleted = true;
//     await message.save();

//     res.json({ msg: "Message deleted", message });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// exports.reactMessage = async (req, res) => {
//   console.log(req.body);
//   try {
//     const { messageId, emoji } = req.body;
//     const message = await Message.findById(messageId);
//     if (!message) return res.status(404).json({ msg: "Message not found" });

//     message.reactions.set(req.user.id, emoji);
//     await message.save();
//     res.json(message);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// exports.markDelivered = async (req, res) => {
//   try {
//     const { messageId } = req.body;
//     const message = await Message.findById(messageId);
//     if (!message) return res.status(404).json({ msg: "Message not found" });

//     if (!message.deliveredTo.includes(req.user.id))
//       message.deliveredTo.push(req.user.id);
//     await message.save();
//     res.json(message);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// exports.markSeen = async (req, res) => {
//   try {
//     const { messageId } = req.body;
//     const message = await Message.findById(messageId);
//     if (!message) return res.status(404).json({ msg: "Message not found" });

//     message.seenBy.set(req.user.id, new Date());
//     await message.save();
//     res.json(message);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };



const Message = require("../models/Message");
const Chat = require("../models/Chat");
const CryptoJS = require("crypto-js");

// AES key (Make sure this matches frontend and is in .env)
const CHAT_KEY = process.env.CHAT_KEY || "1234567890123456";

// Send message
exports.sendMessage = async (req, res) => {
    try {
        const { chatId, type, text, mediaUrl } = req.body;
        const senderId = req.user.id;

        if (!chatId) {
            return res.status(400).json({ msg: "Chat ID is required" });
        }
        if (!type || (type === 'text' && !text) || (type !== 'text' && !mediaUrl)) {
            return res.status(400).json({ msg: "Message content or type is missing" });
        }

        // Encrypt text if type is 'text'
        let content = text;
        if (type === "text" && text) {
            content = CryptoJS.AES.encrypt(text, CHAT_KEY).toString();
        }

        const message = new Message({
            chatId,
            senderId,
            type,
            text: type === "text" ? content : undefined, // Only save text if type is text
            mediaUrl: type !== "text" ? mediaUrl : undefined, // Only save mediaUrl if type is not text
            status: 'sent', // Initial status
        });

        await message.save();

        // Populate sender details for the response/socket event
        const populatedMessage = await message.populate('senderId', 'name photoURL');

        // Update lastMessage in the Chat document
        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: {
                text: content, // Save encrypted text
                senderId: senderId,
                timestamp: populatedMessage.createdAt, // Use actual message creation time
            },
            // Optionally, reset unread counts or update based on logic
        });


        // Send response back to the original sender
        res.status(201).json(populatedMessage);

    } catch (err) {
        console.error("Error sending message:", err);
        res.status(500).json({ msg: "Server error while sending message" });
    }
};


// exports.sendMessage = async (req, res) => {
//     try {
//         const { chatId, type, text, mediaUrl } = req.body;
//         const senderId = req.user.id; // User A (Sender)

//         // --- Validation ---
//         if (!chatId) {
//             return res.status(400).json({ msg: "Chat ID is required" });
//         }
//         // Text message ke liye text hona zaroori hai
//         if (type === 'text' && !text) {
//              return res.status(400).json({ msg: "Message content is missing" });
//         }
//         // File/Media message ke liye URL aur Text (filename) hona zaroori hai
//         if (type !== 'text' && (!mediaUrl || !text)) {
//             return res.status(400).json({ msg: "Media URL or file name is missing" });
//         }

//         // --- Encryption ---
//         let content = text;
        
//         // Sirf 'text' type ke message ko encrypt karein
//         if (type === "text" && text) {
//             content = CryptoJS.AES.encrypt(text, CHAT_KEY).toString();
//         }
//         // Agar 'file', 'image' etc. hai, toh 'content' (filename) ko encrypt NAHI karna hai
//         // --------------------

//         const message = new Message({
//             chatId,
//             senderId,
//             type, // type (text, image, file, etc.) ko save karein
//             text: content, // Encrypted text YA plain filename
//             mediaUrl: type !== "text" ? mediaUrl : undefined, // mediaUrl save karein (undefined agar text hai)
//             status: 'sent',
//         });

//         await message.save();

//         const populatedMessage = await message.populate('senderId', 'name photoURL');
        
//         // Last message update karein
//         await Chat.findByIdAndUpdate(chatId, {
//             lastMessage: {
//                 text: content, // Encrypted text ya plain filename
//                 senderId: senderId,
//                 timestamp: populatedMessage.createdAt,
//             },
//         });
        
//         // --- REAL-TIME LOGIC ---
//         // Yeh logic ab 'socketHandler.js' mein 'sendMessage' event ke zariye hota hai
//         // (Isliye messageController se 'req.io' block hata diya gaya hai)
//         // -----------------------------------------------

//         res.status(201).json(populatedMessage);

//     } catch (err) {
//         console.error("Error sending message:", err);
//         res.status(500).json({ msg: "Server error while sending message" });
//     }
// };




// controllers/messageController.js



exports.getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.id; 

        // Database se messages fetch karein
        const messages = await Message.find({ 
            chatId: chatId, // Ussi chat ke
            // Aur sirf woh message laayein jinhe user ne 'clear' NAHI kiya hai
            clearedBy: { $ne: userId } 
        })
            // Saari zaroori user details saath mein laayein
            .populate("senderId", "name email photoURL bio online lastSeen")
            .sort({ createdAt: 1 }); // Purane se naye kram mein

        res.json(messages);

    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ msg: "Server error while fetching messages" });
    }
};

// Edit message
exports.editMessage = async (req, res) => {
    try {
        const { messageId } = req.params; // Get ID from URL
        const { newText } = req.body;
        const userId = req.user.id;

        if (!newText) {
            return res.status(400).json({ msg: "New text is required" });
        }

        const message = await Message.findById(messageId);

        if (!message) return res.status(404).json({ msg: "Message not found" });
        if (message.senderId.toString() !== userId) return res.status(403).json({ msg: "Not authorized to edit" });
        if (message.type !== 'text') return res.status(400).json({ msg: "Only text messages can be edited" });

        // Encrypt new text
        const encryptedText = CryptoJS.AES.encrypt(newText, CHAT_KEY).toString();
        message.text = encryptedText;
        message.edited = true;
        await message.save();

        // --- Emit update via Socket.IO ---
         if (req.io) {
             console.log(`[editMessage] Emitting 'message_edited' to room ${message.chatId}`);
             req.io.to(message.chatId.toString()).emit("message_edited", {
                 messageId: message._id,
                 chatId: message.chatId,
                 newText: message.text, // Send encrypted text
                 edited: true
             });
         }
        // --------------------------------

        res.json({ msg: "Message edited", message }); // Send updated message back
    } catch (err) {
        console.error("Error editing message:", err);
        res.status(500).json({ msg: "Server error" });
    }
};

// Delete message (Soft delete)
exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params; // Get ID from URL
        const userId = req.user.id;

        const message = await Message.findById(messageId);

        if (!message) return res.status(404).json({ msg: "Message not found" });
        // Allow deletion only by the sender
        if (message.senderId.toString() !== userId) return res.status(403).json({ msg: "Not authorized to delete" });

        message.deleted = true;
        message.text = undefined; // Optionally clear text content on delete
        message.mediaUrl = undefined; // Optionally clear media on delete
        message.reactions = new Map(); // Clear reactions
        await message.save();

        // --- Emit update via Socket.IO ---
        if (req.io) {
             console.log(`[deleteMessage] Emitting 'message_deleted' to room ${message.chatId}`);
             req.io.to(message.chatId.toString()).emit("message_deleted", {
                 messageId: message._id,
                 chatId: message.chatId,
             });
        }
        // --------------------------------

        res.json({ msg: "Message marked as deleted" });
    } catch (err) {
        console.error("Error deleting message:", err);
        res.status(500).json({ msg: "Server error" });
    }
};



exports.reactMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { emoji } = req.body; // 'emoji' null hoga removal ke liye
        const userId = req.user.id;

        // --- 1. ATOMIC UPDATE LOGIC ---
        let updateOperation;
        let logMessage;
        
        // MongoDB Map mein key ko dynamically access karne ke liye dot notation
        const reactionPath = `reactions.${userId}`;

        if (!emoji) { // Agar emoji null/undefined/falsy hai = REMOVE
            // $unset operator uss specific key ko Map se delete kar dega
            updateOperation = { $unset: { [reactionPath]: 1 } }; // [reactionPath] key ka naam banata hai
            logMessage = `[reactMessage] User ${userId} removed reaction from ${messageId}`;
        } else { // Agar emoji hai = ADD/UPDATE
            // $set operator uss key ko set ya update karega
            updateOperation = { $set: { [reactionPath]: emoji } };
            logMessage = `[reactMessage] User ${userId} reacted with ${emoji} to ${messageId}`;
        }

        // --- 2. DATABASE UPDATE ---
        // Hum update operation perform karenge aur naya (updated) document return lenge
        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            updateOperation,
            { new: true } // 'new: true' se updated document wapas milta hai
        );

        if (!updatedMessage) {
            return res.status(404).json({ msg: "Message not found" });
        }

        console.log(logMessage); // Naya log

        // --- 3. EMIT SOCKET EVENT ---
        if (req.io) {
            const chat = await Chat.findById(updatedMessage.chatId).select("members");
            if (chat) {
                const eventData = {
                    messageId: updatedMessage._id,
                    chatId: updatedMessage.chatId,
                    reactions: Object.fromEntries(updatedMessage.reactions) // Updated Map ko object bana kar bheja
                };
                console.log(`[reactMessage] Emitting 'message_reaction_update' to room ${updatedMessage.chatId}`);
                req.io.to(updatedMessage.chatId.toString()).emit("message_reaction_update", eventData);
            } else {
                console.error(`[reactMessage] Chat ${updatedMessage.chatId} not found for emit.`);
            }
        } else {
            console.warn("[reactMessage] req.io not found.");
        }
        // -----------------------------

        // 4. Send API response
        res.json({ msg: "Reaction updated", reactions: updatedMessage.reactions });

    } catch (err) {
        console.error("❌ Error in reactMessage:", err);
        res.status(500).json({ msg: "Server error" });
    }
};

// ... (Make sure reactMessage is exported) ...
// Mark message as delivered
// Note: This is usually triggered by the recipient's client via socket, not direct API call
exports.markDelivered = async (req, res) => {
    try {
        const { messageId } = req.params; // Get ID from URL
        const userId = req.user.id; // The user who received it

        const message = await Message.findByIdAndUpdate(
            messageId,
            {
                $addToSet: { deliveredTo: userId }, // Add user to delivered list
                // Optionally update status if ALL recipients have received it
                // status: 'delivered' // Be careful with this logic for groups
            },
            { new: true }
        ).select('senderId chatId deliveredTo status');

        if (!message) return res.status(404).json({ msg: "Message not found" });

        // --- Emit status update to SENDER via Socket.IO ---
        if (req.io && req.onlineUsers) { // Check for onlineUsers map
            const senderSocketId = req.onlineUsers.get(message.senderId.toString());
            if (senderSocketId) {
                console.log(`[markDelivered] Emitting 'update_message_status' to sender ${message.senderId}`);
                req.io.to(senderSocketId).emit("update_message_status", {
                    messageId: message._id,
                    chatId: message.chatId,
                    status: 'delivered', // Simplification for now
                    deliveredTo: message.deliveredTo
                });
            }
        }
        // ------------------------------------------------

        res.json({ msg: "Marked as delivered", deliveredTo: message.deliveredTo });
    } catch (err) {
        console.error("Error marking delivered:", err);
        res.status(500).json({ msg: "Server error" });
    }
};

// Mark message as seen
// Note: This is usually triggered by the recipient's client via API/socket when chat is opened/message viewed
exports.markSeen = async (req, res) => {
    try {
        const { messageId } = req.params; // Get ID from URL
        const userId = req.user.id; // The user who saw it

        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ msg: "Message not found" });

        // Update seenBy map if not already seen
        if (!message.seenBy.has(userId)) {
            message.seenBy.set(userId, new Date());
            // Optionally update status if needed (e.g., if sender is the one marking seen? Complex logic)
            // Or if all recipients have seen it
            // message.status = 'seen';
            await message.save();

            // --- Emit status update to SENDER via Socket.IO ---
            if (req.io && req.onlineUsers) {
                const senderSocketId = req.onlineUsers.get(message.senderId.toString());
                 if (senderSocketId) {
                     console.log(`[markSeen] Emitting 'update_message_status' (seen) to sender ${message.senderId}`);
                     // You might need more complex logic to determine exact 'seen' status for sender
                     req.io.to(senderSocketId).emit("update_message_status", {
                         messageId: message._id,
                         chatId: message.chatId,
                         status: 'seen', // Simplification for now
                         seenBy: Object.fromEntries(message.seenBy) // Send seenBy Map as object
                     });
                 }
            }
            // ------------------------------------------------
            res.json({ msg: "Marked as seen", seenBy: message.seenBy });
        } else {
             res.json({ msg: "Already marked as seen", seenBy: message.seenBy });
        }

    } catch (err) {
        console.error("Error marking seen:", err);
        res.status(500).json({ msg: "Server error" });
    }
};



exports.markChatAsSeen = async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user.id; // User B (jisne dekha)

    try {
        const seenByKey = `seenBy.${userId}`;

        // --- YEH QUERY FIX HAI ---
        // 'status: { $ne: 'seen' }' ki jagah, hum 'sent' ya 'delivered' ko dhoondhenge
        const query = { 
            chatId: chatId, 
            senderId: { $ne: userId }, // Doosre ke messages
            status: { $in: ['seen', 'delivered'] } // Sirf unread messages
        };
        // -------------------------
        
        console.log("[markSeen V4] Finding messages with query:", JSON.stringify(query));

        const updateResult = await Message.updateMany(
            query, 
            { 
                $set: { 
                    status: 'seen', 
                    [seenByKey]: new Date()
                } 
            }
        );

        console.log(`[markSeen V4] Update Result: Matched: ${updateResult.matchedCount}, Modified: ${updateResult.modifiedCount}`);

        // Event hamesha emit karein (taaki UI sync ho)
        if (req.io && req.onlineUsers) {
            const chat = await Chat.findById(chatId).select('members');
            if (chat) {
                chat.members.forEach(memberId => {
                    if (memberId.toString() !== userId) { 
                        const senderSocketId = req.onlineUsers.get(memberId.toString());
                        if (senderSocketId) {
                            console.log(`[markSeen V4] >>> Emitting 'chat_seen' to user ${memberId}`);
                            req.io.to(senderSocketId).emit("chat_seen", {
                                chatId: chatId,
                                seenByUserId: userId 
                            });
                        }
                    }
                });
            }
        }
        
        res.status(200).json({ msg: "Messages marked as seen" });
    } catch (err) {
        console.error("❌ Error marking chat as seen (V4):", err);
        res.status(500).json({ msg: "Server error" });
    }
};




exports.deleteMultipleMessages = async (req, res) => {
    const { messageIds } = req.body; // Array of IDs
    const userId = req.user.id;

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
        return res.status(400).json({ msg: "Message IDs array is required." });
    }

    try {
        // --- 1. CHAT MEMBERSHIP CHECK (ZAROORI) ---
        // Pehle check karein ki user is chat ka member hai ya nahi
        // (Ek message se chat ID nikaal kar)
        const firstMsg = await Message.findById(messageIds[0]).select('chatId');
        if (!firstMsg) {
            return res.status(404).json({ msg: "Message not found." });
        }
        
        const chat = await Chat.findById(firstMsg.chatId).select('members');
        if (!chat || !chat.members.includes(userId)) {
            return res.status(403).json({ msg: "You are not a member of this chat." });
        }
        // ------------------------------------------

        // --- 2. DELETE LOGIC (BINA SENDER CHECK) ---
        // Ab messages ko delete karein, bhale hi sender koi bhi ho
        await Message.updateMany(
            { 
                _id: { $in: messageIds },
                // 'senderId: userId' waala check HATA DIYA GAYA HAI
            },
            { 
                $set: { 
                    deleted: true, 
                    text: "This message was deleted", 
                    type: 'text',
                    reactions: new Map() // Reactions clear karein
                }
            }
        );
        // -----------------------------------------

        // 3. Real-time update sabko bhejein
        if (req.io) {
            req.io.to(firstMsg.chatId.toString()).emit("messages_deleted", { 
                messageIds: messageIds 
            });
        }
        res.status(200).json({ msg: "Messages deleted" });
    } catch (err) {
        console.error("Error deleting multiple messages:", err);
        res.status(500).json({ msg: "Server error" });
    }
};

// controllers/messageController.js
exports.clearChat = async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user.id;

    try {
        const chat = await Chat.findOne({ _id: chatId, members: userId });
        if (!chat) {
            return res.status(403).json({ msg: "Not authorized or chat not found" });
        }

        // --- SAHI LOGIC ---
        // Is chat ke sabhi messages ko dhoondhein
        // Aur unke 'clearedBy' array mein apni ID add kar dein
        await Message.updateMany(
            { chatId: chatId }, // Chat ke saare messages
            { $addToSet: { clearedBy: userId } } // Un sab mein apni ID add karo
        );
        // ------------------

        console.log(`[clearChat] User ${userId} cleared all messages in chat ${chatId}`);

        if (req.io && req.onlineUsers) {
            // Sirf us user ko event bhejein jisne request ki thi
            const userSocketId = req.onlineUsers.get(userId);
            if (userSocketId) {
                req.io.to(userSocketId).emit("chat_cleared", { chatId: chatId });
            }
        }
        
        res.status(200).json({ msg: "Chat cleared successfully" });

    } catch (err) {
        console.error("Error clearing chat:", err);
        res.status(500).json({ msg: "Server error" });
    }
};



exports.deleteMultipleForMe = async (req, res) => {
    const { messageIds } = req.body;
    const userId = req.user.id;

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
        return res.status(400).json({ msg: "Message IDs are required." });
    }
    try {
        // Sirf 'clearedBy' array mein user ki ID add karein
        await Message.updateMany(
            { _id: { $in: messageIds } },
            { $addToSet: { clearedBy: userId } } // User ki ID ko 'clearedBy' mein add karo
        );
        
        console.log(`[DeleteForMe] User ${userId} cleared ${messageIds.length} messages.`);
        
        // Sirf sender ko update bhejein (taaki UI refresh ho)
        if (req.io && req.onlineUsers) {
            const userSocketId = req.onlineUsers.get(userId);
            if (userSocketId) {
                req.io.to(userSocketId).emit("messages_cleared_for_me", { 
                    messageIds: messageIds,
                    chatId: (await Message.findById(messageIds[0]).select('chatId')).chatId
                });
            }
        }
        res.status(200).json({ msg: "Messages cleared for you" });
    } catch (err) {
        console.error("Error in deleteMultipleForMe:", err);
        res.status(500).json({ msg: "Server error" });
    }
};

// --- 2. YEH FUNCTION "DELETE FOR EVERYONE" KAREGA ---
exports.deleteMultipleForEveryone = async (req, res) => {
    const { messageIds } = req.body;
    const userId = req.user.id;

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
        return res.status(400).json({ msg: "Message IDs are required." });
    }
    try {
        // Sirf woh messages update karein jo 'senderId: userId' match karte hain
        await Message.updateMany(
            { 
                _id: { $in: messageIds },
                senderId: userId // <-- Security check (Sirf apne message)
            },
            { 
                $set: { deleted: true, text: "This message was deleted", type: 'text', reactions: new Map() }
            }
        );

        console.log(`[DeleteForEveryone] User ${userId} soft-deleted messages.`);

        // Sabko real-time update bhejein
        if (req.io) {
            const firstMsg = await Message.findById(messageIds[0]).select('chatId');
            if (firstMsg) {
                req.io.to(firstMsg.chatId.toString()).emit("messages_deleted", { 
                    messageIds: messageIds 
                });
            }
        }
        res.status(200).json({ msg: "Messages deleted for everyone" });
    } catch (err) {
        console.error("Error in deleteMultipleForEveryone:", err);
        res.status(500).json({ msg: "Server error" });
    }
};