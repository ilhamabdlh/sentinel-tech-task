# Real-time Chat Application

A modern, real-time chat application built with Vue.js and WebSocket technology.

## 🎯 Features

### Core Features
- **Real-time messaging** using WebSocket (Socket.IO)
- **Multi-user support** with live user list
- **Typing indicators** showing when users are typing
- **Message history** with timestamps
- **Responsive design** for desktop and mobile
- **Beautiful animations** and smooth transitions
- **User authentication** with username validation
- **Error handling** and connection management

### Technical Features
- **Vue.js 3** with Composition API
- **Socket.IO** for real-time communication
- **Modern CSS** with gradients and animations
- **Responsive design** with mobile-first approach
- **Production-ready** code structure

## 🛠️ Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Socket.IO Client** - Real-time communication
- **Modern CSS** - Gradients, animations, responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.IO** - WebSocket library
- **UUID** - Unique identifier generation

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the project:**
```bash
cd chat-app
```

2. **Install dependencies:**
```bash
npm run install-all
```

3. **Start the development server:**
```bash
npm run dev
```

This will start both the backend server (port 3000) and frontend development server (port 8080).

4. **Open your browser:**
- Navigate to `http://localhost:8080` for the Vue.js development server
- Or `http://localhost:3000` for the production build

### Alternative: Production Build

1. **Build the frontend:**
```bash
npm run build
```

2. **Start the production server:**
```bash
npm start
```

3. **Open your browser:**
- Navigate to `http://localhost:3000`

## 📱 Usage

### Getting Started
1. **Enter a username** - Choose a unique username to join the chat
2. **Start chatting** - Type messages and see them appear in real-time
3. **See who's online** - View the list of online users in the sidebar
4. **Typing indicators** - See when other users are typing

### Features in Action
- **Real-time messaging** - Messages appear instantly for all users
- **User management** - See when users join/leave the chat
- **Typing indicators** - Know when someone is typing a message
- **Message history** - View previous messages when joining
- **Responsive design** - Works on desktop, tablet, and mobile

## 🏗️ Architecture

### Frontend Structure
```
client/
├── src/
│   ├── components/
│   │   └── ChatApp.vue          # Main chat component
│   ├── App.vue                  # Root component
│   └── main.ts                  # Application entry point
├── public/                      # Static assets
└── package.json                 # Frontend dependencies
```

### Backend Structure
```
├── server.js                    # Main server file
├── package.json                 # Backend dependencies
└── README.md                    # This file
```

### Key Components

#### ChatApp.vue
- **Login screen** with username validation
- **Chat interface** with messages and user list
- **Real-time communication** using Socket.IO
- **Responsive design** with animations
- **TypeScript** for type safety

#### server.js
- **Express server** with Socket.IO integration
- **User management** with in-memory storage
- **Message handling** with history management
- **Real-time events** for chat functionality
- **REST API** endpoints for health checks

## 🔧 API Endpoints

### WebSocket Events

#### Client → Server
- `join` - Join the chat with username
- `message` - Send a message
- `typing` - Indicate typing status
- `disconnect` - Leave the chat

#### Server → Client
- `joined` - Confirmation of joining
- `newMessage` - New message received
- `userJoined` - User joined notification
- `userLeft` - User left notification
- `userList` - Updated user list
- `userTyping` - User typing status
- `error` - Error messages

### REST API
- `GET /api/health` - Server health check
- `GET /api/stats` - Chat statistics
- `GET /*` - Serve Vue.js application

## 🎨 Design Features

### Visual Design
- **Modern gradient backgrounds** with purple/blue theme
- **Smooth animations** for messages and interactions
- **Card-based layout** with shadows and rounded corners
- **Responsive sidebar** for user list
- **Typing indicators** with animated dots

### User Experience
- **Intuitive interface** with clear visual hierarchy
- **Real-time feedback** for all actions
- **Mobile-responsive** design
- **Accessibility** considerations
- **Error handling** with user-friendly messages

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## 📊 Performance Features

- **Efficient message handling** with message limits
- **Optimized re-renders** with Vue.js reactivity
- **Connection management** with automatic reconnection
- **Memory management** with message history limits
- **Responsive animations** with CSS transforms

## 🔒 Security Features

- **Input validation** for usernames and messages
- **XSS prevention** with proper escaping
- **Rate limiting** considerations
- **CORS configuration** for cross-origin requests
- **Error handling** without information leakage

## 🧪 Testing

### Manual Testing
1. **Open multiple browser windows** to test multi-user functionality
2. **Test username validation** with duplicate names
3. **Test typing indicators** by typing in different windows
4. **Test responsive design** on different screen sizes
5. **Test connection handling** by refreshing pages


