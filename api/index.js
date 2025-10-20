const express = require('express');
const http = require('http');
const {
    Server
} = require('socket.io');
const path = require('path');
const {
    v4: uuidv4
} = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Store active sessions
const sessions = new Map();

// Route for the home page
app.get('/', (req, res) => {
    // Generate a unique session ID and redirect to it
    const sessionId = uuidv4().substring(0, 8);
    res.redirect(`/board/${sessionId}`);
});

// Route for /board/ without a session ID - redirect to home
app.get('/board/', (req, res) => {
    res.redirect('/');
});

// Route for joining an existing session
app.get('/board/:sessionId', (req, res) => {
    const {
        sessionId
    } = req.params;

    // Initialize session if it doesn't exist
    if (!sessions.has(sessionId)) {
        sessions.set(sessionId, {
            users: 0
        });
    }

    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    let currentSessionId = null;

    // Handle user joining a session
    socket.on('joinSession', (sessionId) => {
        currentSessionId = sessionId;

        // Join the room for this session
        socket.join(sessionId);

        // Update user count
        if (sessions.has(sessionId)) {
            const session = sessions.get(sessionId);
            session.users += 1;
            console.log(`User joined session ${sessionId}. Total users: ${session.users}`);
        }
    });

    // Handle drawing events
    socket.on('draw', (data) => {
        // Broadcast the drawing data to all users in the same session except the sender
        socket.to(currentSessionId).emit('draw', data);
    });

    // Handle clear canvas event
    socket.on('clearCanvas', () => {
        // Broadcast the clear event to all users in the same session except the sender
        socket.to(currentSessionId).emit('clearCanvas');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        if (currentSessionId && sessions.has(currentSessionId)) {
            const session = sessions.get(currentSessionId);
            session.users -= 1;
            console.log(`User left session ${currentSessionId}. Total users: ${session.users}`);

            // Clean up empty sessions after some time
            if (session.users <= 0) {
                setTimeout(() => {
                    if (sessions.has(currentSessionId) && sessions.get(currentSessionId).users <= 0) {
                        sessions.delete(currentSessionId);
                        console.log(`Session ${currentSessionId} removed due to inactivity`);
                    }
                }, 60000); // Clean up after 1 minute of inactivity
            }
        }
    });
});

// Export the app for Vercel
module.exports = app;