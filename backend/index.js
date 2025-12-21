
// require('dotenv').config(); // Load environment variables first
// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');
// const connectDB = require('./src/config/db'); // Your database connection function

// // --- 1. Import socketHandler AND onlineUsers ---
// const { socketHandler, onlineUsers } = require('./src/socket/socketHandler');

// // Initialize Express app and HTTP server
// const app = express();
// const server = http.createServer(app);

// // --- SOCKET.IO SETUP ---
// const io = socketIo(server, {
//     cors: {
//         origin: "http://localhost:5173",
//         // origin: "https://crjoin.online", 
//         methods: ["GET", "POST", "PUT", "DELETE"]
//     }
// });

// // Pass the 'io' instance to your socket event handler logic
// socketHandler(io);
// // -----------------------

// // --- CORE MIDDLEWARES ---
// app.use(cors({ origin: "http://localhost:5173" }));
// app.use(express.json());

// // --- 2. Middleware to attach 'io' AND 'onlineUsers' ---
// app.use((req, res, next) => {
//     req.io = io;
//     req.onlineUsers = onlineUsers; // Ab 'onlineUsers' defined hai
//     next();
// });
// // -----------------------------

// // --- API ROUTES ---
// app.use('/api/auth', require('./src/routes/authRoutes'));
// app.use('/api/chat', require('./src/routes/chatRoutes'));
// app.use('/api/message', require('./src/routes/messageRoutes'));
// app.use('/api/upload', require('./src/routes/uploadRoutes')); 
// app.use('/api/friends', require('./src/routes/friendRoutes'));
// app.use("/api/posts", require("./src/routes/postRoutes"));
// app.use("/api/reels", require("./src/routes/reelRoutes"));
// app.use("/api/comments", require("./src/routes/commentRoutes"));
// app.use("/api/stories",require("./src/routes/storyRoutes"));

// // ------------------

// // --- 3. START SERVER (Async Function) ---
// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//     try {
//         // 1. Pehle Database connect hone ka intezaar karein
//         await connectDB(); 
//         console.log("MongoDB connected successfully.");

//         // 2. Database connect hone ke baad hi server start karein
//         server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        
//     } catch (error) {
//         console.error("Failed to connect to MongoDB. Server not started.", error);
//         process.exit(1); // Error ho toh server band kar dein
//     }
// };

// startServer(); // Server start karne ke liye function call karein
// // ----------------------------------------










require('dotenv').config(); // Load environment variables first
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./src/config/db'); // Your database connection function

// --- 1. Import socketHandler AND onlineUsers ---
const { socketHandler, onlineUsers } = require('./src/socket/socketHandler');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// 👇 Yahan saare allowed domains ki list hai (Local + Live)
const allowedOrigins = [
    "http://localhost:5173",          // Local testing
    "http://crjoin.online",           // HTTP Domain (Jo error de raha tha)
    "https://crjoin.online",          // HTTPS Domain
    "https://www.crjoin.online"       // WWW Domain
];

// --- SOCKET.IO SETUP ---
const io = socketIo(server, {
    cors: {
        origin: allowedOrigins,       // 👈 Upar wali list use ki hai
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

// Pass the 'io' instance to your socket event handler logic
socketHandler(io);
// -----------------------

// --- CORE MIDDLEWARES (API CORS) ---
app.use(cors({
    origin: allowedOrigins,           // 👈 Same list yahan bhi use ki hai
    credentials: true                 // Token/Cookies ke liye zaroori
}));

app.use(express.json());

// --- 2. Middleware to attach 'io' AND 'onlineUsers' ---
app.use((req, res, next) => {
    req.io = io;
    req.onlineUsers = onlineUsers; // Ab 'onlineUsers' defined hai
    next();
});
// -----------------------------

// --- API ROUTES ---
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/chat', require('./src/routes/chatRoutes'));
app.use('/api/message', require('./src/routes/messageRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes')); 
app.use('/api/friends', require('./src/routes/friendRoutes'));
app.use("/api/posts", require("./src/routes/postRoutes"));
app.use("/api/reels", require("./src/routes/reelRoutes"));
app.use("/api/comments", require("./src/routes/commentRoutes"));
app.use("/api/stories", require("./src/routes/storyRoutes"));

// ------------------

// --- 3. START SERVER (Async Function) ---
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // 1. Pehle Database connect hone ka intezaar karein
        await connectDB(); 
        console.log("MongoDB connected successfully.");

        // 2. Database connect hone ke baad hi server start karein
        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        
    } catch (error) {
        console.error("Failed to connect to MongoDB. Server not started.", error);
        process.exit(1); // Error ho toh server band kar dein
    }
};

startServer(); // Server start karne ke liye function call karein