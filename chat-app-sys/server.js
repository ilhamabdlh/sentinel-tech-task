// Real-time Chat Application
// Backend Server with WebSocket support

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

// in-memory storage for demo
const users = new Map();
const messages = [];
const MAX_MESSAGES = 100;

// user management
class User {
    constructor(id, username, socketId) {
        this.id = id;
        this.username = username;
        this.socketId = socketId;
        this.joinTime = new Date();
        this.isTyping = false;
    }
}

// message management
class Message {
    constructor(id, userId, username, content, timestamp) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.content = content;
        this.timestamp = timestamp;
    }
}

// socket connection handling
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // user joins chat
    socket.on('join', (data) => {
        const { username } = data;
        
        if (!username || username.trim().length === 0) {
            socket.emit('error', { message: 'Username is required' });
            return;
        }

        // check if username is already taken
        const existingUser = Array.from(users.values()).find(user => 
            user.username.toLowerCase() === username.toLowerCase()
        );

        if (existingUser) {
            socket.emit('error', { message: 'Username is already taken' });
            return;
        }

        // create new user
        const userId = uuidv4();
        const user = new User(userId, username, socket.id);
        users.set(socket.id, user);

        // join socket room
        socket.join('chat');

        // send user their ID and current messages
        socket.emit('joined', {
            userId: userId,
            username: username,
            messages: messages.slice(-50)
        });

        // notify other users
        socket.to('chat').emit('userJoined', {
            userId: userId,
            username: username,
            userCount: users.size
        });

        // send updated user list
        io.to('chat').emit('userList', {
            users: Array.from(users.values()).map(user => ({
                id: user.id,
                username: user.username,
                joinTime: user.joinTime
            }))
        });

        console.log(`User ${username} joined the chat`);
    });

    // user sends message
    socket.on('message', (data) => {
        const user = users.get(socket.id);
        if (!user) {
            socket.emit('error', { message: 'User not found' });
            return;
        }

        const { content } = data;
        if (!content || content.trim().length === 0) {
            socket.emit('error', { message: 'Message content is required' });
            return;
        }

        // create message
        const messageId = uuidv4();
        const message = new Message(
            messageId,
            user.id,
            user.username,
            content.trim(),
            new Date()
        );

        // add to messages array
        messages.push(message);

        // keep only last MAX_MESSAGES
        if (messages.length > MAX_MESSAGES) {
            messages.shift();
        }

        // broadcast message to all users
        io.to('chat').emit('newMessage', {
            id: message.id,
            userId: message.userId,
            username: message.username,
            content: message.content,
            timestamp: message.timestamp
        });

        console.log(`Message from ${user.username}: ${content}`);
    });

    // user is typing
    socket.on('typing', (data) => {
        const user = users.get(socket.id);
        if (!user) return;

        user.isTyping = data.isTyping;

        // notify other users
        socket.to('chat').emit('userTyping', {
            userId: user.id,
            username: user.username,
            isTyping: user.isTyping
        });
    });

    // user disconnects
    socket.on('disconnect', () => {
        const user = users.get(socket.id);
        if (user) {
            users.delete(socket.id);

            // notify other users
            socket.to('chat').emit('userLeft', {
                userId: user.id,
                username: user.username,
                userCount: users.size
            });

            // send updated user list
            io.to('chat').emit('userList', {
                users: Array.from(users.values()).map(user => ({
                    id: user.id,
                    username: user.username,
                    joinTime: user.joinTime
                }))
            });

            console.log(`User ${user.username} left the chat`);
        }
    });

    // handle errors
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

// rest api endpoints
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        users: users.size,
        messages: messages.length
    });
});

app.get('/api/stats', (req, res) => {
    res.json({
        totalUsers: users.size,
        totalMessages: messages.length,
        onlineUsers: Array.from(users.values()).map(user => ({
            id: user.id,
            username: user.username,
            joinTime: user.joinTime
        }))
    });
});

// serve vue app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Chat server running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} to access the chat application`);
    console.log(`🔌 WebSocket server ready for connections`);
});

// graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
