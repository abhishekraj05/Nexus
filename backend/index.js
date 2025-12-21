// require('dotenv').config();
// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');
// const connectDB = require('./src/config/db');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, { cors: { origin: '*' } });

// // Connect to DB
// connectDB();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/auth', require('./src/routes/authRoutes'));
// app.use('/api/chat', require('./src/routes/chatRoutes'));
// app.use('/api/message', require('./src/routes/messageRoutes'));
// app.use('/api/friends', require('./src/routes/friendRoutes'));

// // Socket.io handler
// const socketHandler = require('./src/socket/socketHandler'); // <-- CommonJS style
// socketHandler(io); // <-- call immediately after require

// // Start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// require('dotenv').config(); // Load environment variables first
// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');
// const connectDB = require('./src/config/db'); // Your database connection function
// const socketHandler = require('./src/socket/socketHandler'); // Your socket logic handler



// // Initialize Express app and HTTP server
// const app = express();
// const server = http.createServer(app);

// // --- SOCKET.IO SETUP ---
// // Initialize Socket.IO and attach it to the HTTP server
// const io = socketIo(server, {
//     cors: {
//         origin: "http://localhost:5173", // IMPORTANT: Restrict to your frontend URL in production
//         methods: ["GET", "POST", "PUT", "DELETE"]
//     }
// });
// // Pass the 'io' instance to your socket event handler logic
// socketHandler(io);
// // -----------------------

// // Connect to MongoDB Database
// connectDB();

// // --- CORE MIDDLEWARES ---
// // Enable Cross-Origin Resource Sharing (adjust origin in production)
// app.use(cors({ origin: "http://localhost:5173" })); // Be more specific than '*'
// // Parse incoming JSON request bodies
// app.use(express.json());

// // --- !! ADD THIS MIDDLEWARE !! ---
// // Middleware to attach the Socket.IO instance ('io') to every request object ('req')
// // This makes 'io' accessible within your controllers (e.g., req.io.emit)
// app.use((req, res, next) => {
//     req.io = io;
//     // Note: If you need onlineUsers map in controllers, export/import it or manage globally
//     // req.onlineUsers = onlineUsers;
//     next(); // Pass control to the next middleware or route handler
// });
// // -----------------------------

// // --- API ROUTES ---
// // Mount your different API routers
// app.use('/api/auth', require('./src/routes/authRoutes'));
// app.use('/api/chat', require('./src/routes/chatRoutes'));
// app.use('/api/message', require('./src/routes/messageRoutes'));
// app.use('/api/friends', require('./src/routes/friendRoutes'));
// // ------------------

// // --- START SERVER ---
// // Define the port to listen on, using environment variable or default 5000
// const PORT = process.env.PORT || 5000;
// // Start listening for incoming connections
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



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

// --- SOCKET.IO SETUP ---
const io = socketIo(server, {
    cors: {
        // origin: "http://localhost:5173",
        origin: "https://crjoin.online", // Frontend URL
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
// Pass the 'io' instance to your socket event handler logic
socketHandler(io);
// -----------------------

// --- CORE MIDDLEWARES ---
// app.use(cors({ origin: "http://localhost:5173" }));
app.use(cors({ origin: "https://crjoin.online" }));
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
app.use("/api/stories",require("./src/routes/storyRoutes"));

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
// ----------------------------------------