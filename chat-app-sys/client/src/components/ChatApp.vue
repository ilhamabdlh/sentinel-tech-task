<template>
  <div class="chat-app">
    <!-- Login Screen -->
    <div v-if="!isLoggedIn" class="login-screen">
      <div class="login-container">
        <h1>🚀 Sentinel Chat</h1>
        <p>Real-time chat application built with Vue.js + WebSocket</p>
        
        <form @submit.prevent="joinChat" class="login-form">
          <div class="input-group">
            <label for="username">Username:</label>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Enter your username"
              required
              maxlength="20"
              class="username-input"
            />
          </div>
          <button type="submit" :disabled="!username.trim()" class="join-btn">
            Join Chat
          </button>
        </form>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>

    <!-- Chat Interface -->
    <div v-else class="chat-interface">
      <!-- Header -->
      <header class="chat-header">
        <div class="header-info">
          <h2>🚀 Sentinel Chat</h2>
          <span class="user-info">Welcome, {{ currentUser.username }}!</span>
        </div>
        <div class="header-stats">
          <span class="user-count">👥 {{ onlineUsers.length }} online</span>
          <button @click="leaveChat" class="leave-btn">Leave</button>
        </div>
      </header>

      <!-- Chat Container -->
      <div class="chat-container">
        <!-- Messages Area -->
        <div class="messages-container" ref="messagesContainer">
          <div
            v-for="message in messages"
            :key="message.id"
            class="message"
            :class="{ 'own-message': message.userId === currentUser.id }"
          >
            <div class="message-content">
              <div class="message-header">
                <span class="username">{{ message.username }}</span>
                <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
              </div>
              <div class="message-text">{{ message.content }}</div>
            </div>
          </div>
          
          <!-- Typing Indicator -->
          <div v-if="typingUsers.length > 0" class="typing-indicator">
            <span class="typing-text">
              {{ typingUsers.join(', ') }} {{ typingUsers.length === 1 ? 'is' : 'are' }} typing...
            </span>
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <!-- Message Input -->
        <div class="message-input-container">
          <form @submit.prevent="sendMessage" class="message-form">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type your message..."
              maxlength="500"
              class="message-input"
              @input="handleTyping"
              @keydown.enter="sendMessage"
            />
            <button type="submit" :disabled="!newMessage.trim()" class="send-btn">
              Send
            </button>
          </form>
        </div>
      </div>

      <!-- Online Users Sidebar -->
      <div class="users-sidebar">
        <h3>Online Users</h3>
        <div class="users-list">
          <div
            v-for="user in onlineUsers"
            :key="user.id"
            class="user-item"
            :class="{ 'current-user': user.id === currentUser.id }"
          >
            <span class="user-avatar">👤</span>
            <span class="user-name">{{ user.username }}</span>
            <span v-if="user.id === currentUser.id" class="you-badge">You</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  name: 'ChatApp',
  data() {
    return {
      isLoggedIn: false,
      username: '',
      currentUser: { id: '', username: '' },
      messages: [],
      newMessage: '',
      onlineUsers: [],
      typingUsers: [],
      error: '',
      socket: null,
      typingTimeout: null
    };
  },
  mounted() {
    this.connectSocket();
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  },
  methods: {
    connectSocket() {
      this.socket = io('http://13.55.197.252:3000', {
        transports: ['websocket', 'polling']
      });

      // Socket event listeners
      this.socket.on('joined', (data) => {
        this.currentUser = { id: data.userId, username: data.username };
        this.messages = data.messages;
        this.isLoggedIn = true;
        this.error = '';
        this.$nextTick(() => this.scrollToBottom());
      });

      this.socket.on('error', (data) => {
        this.error = data.message;
      });

      this.socket.on('newMessage', (message) => {
        this.messages.push(message);
        this.$nextTick(() => this.scrollToBottom());
      });

      this.socket.on('userJoined', (data) => {
        console.log(`${data.username} joined the chat`);
      });

      this.socket.on('userLeft', (data) => {
        console.log(`${data.username} left the chat`);
      });

      this.socket.on('userList', (data) => {
        this.onlineUsers = data.users;
      });

      this.socket.on('userTyping', (data) => {
        if (data.userId !== this.currentUser.id) {
          if (data.isTyping) {
            if (!this.typingUsers.includes(data.username)) {
              this.typingUsers.push(data.username);
            }
          } else {
            this.typingUsers = this.typingUsers.filter(name => name !== data.username);
          }
        }
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
        this.isLoggedIn = false;
        this.error = 'Connection lost. Please refresh the page.';
      });
    },

    joinChat() {
      if (this.socket && this.username.trim()) {
        this.socket.emit('join', { username: this.username.trim() });
      }
    },

    sendMessage() {
      if (this.socket && this.newMessage.trim()) {
        this.socket.emit('message', { content: this.newMessage.trim() });
        this.newMessage = '';
        this.stopTyping();
      }
    },

    handleTyping() {
      if (this.socket) {
        this.socket.emit('typing', { isTyping: true });
        
        // Clear existing timeout
        if (this.typingTimeout) {
          clearTimeout(this.typingTimeout);
        }
        
        // Set new timeout to stop typing indicator
        this.typingTimeout = setTimeout(() => {
          this.stopTyping();
        }, 1000);
      }
    },

    stopTyping() {
      if (this.socket) {
        this.socket.emit('typing', { isTyping: false });
      }
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
        this.typingTimeout = null;
      }
    },

    leaveChat() {
      if (this.socket) {
        this.socket.disconnect();
      }
      this.isLoggedIn = false;
      this.currentUser = { id: '', username: '' };
      this.messages = [];
      this.onlineUsers = [];
      this.typingUsers = [];
      this.username = '';
      this.error = '';
    },

    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }
};
</script>

<style scoped>
.chat-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Login Screen */
.login-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
}

.login-container {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-container h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 2.5em;
}

.login-container p {
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1em;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.input-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.username-input {
  padding: 15px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.username-input:focus {
  outline: none;
  border-color: #667eea;
}

.join-btn {
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.join-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.join-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  margin-top: 15px;
  padding: 10px;
  background: #fdf2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

/* Chat Interface */
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: white;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-info h2 {
  margin: 0;
  font-size: 1.8em;
}

.user-info {
  font-size: 0.9em;
  opacity: 0.9;
}

.header-stats {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-count {
  font-size: 0.9em;
  opacity: 0.9;
}

.leave-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.leave-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.chat-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  animation: messageSlide 0.3s ease-out;
}

@keyframes messageSlide {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.own-message {
  justify-content: flex-end;
}

.message-content {
  max-width: 70%;
  padding: 15px 20px;
  border-radius: 20px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.own-message .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-size: 0.8em;
  opacity: 0.8;
}

.username {
  font-weight: 600;
}

.timestamp {
  font-size: 0.9em;
}

.message-text {
  font-size: 1em;
  line-height: 1.4;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 200px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.typing-text {
  font-size: 0.9em;
  color: #666;
  font-style: italic;
}

.typing-dots {
  display: flex;
  gap: 3px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: #667eea;
  border-radius: 50%;
  animation: typingDot 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingDot {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.message-input-container {
  padding: 20px;
  background: white;
  border-top: 1px solid #e1e5e9;
}

.message-form {
  display: flex;
  gap: 10px;
}

.message-input {
  flex: 1;
  padding: 15px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.message-input:focus {
  outline: none;
  border-color: #667eea;
}

.send-btn {
  padding: 15px 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Users Sidebar */
.users-sidebar {
  width: 250px;
  background: white;
  border-left: 1px solid #e1e5e9;
  padding: 20px;
  overflow-y: auto;
}

.users-sidebar h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.2em;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  transition: background 0.3s ease;
}

.user-item:hover {
  background: #f8f9fa;
}

.user-item.current-user {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.user-avatar {
  font-size: 1.2em;
}

.user-name {
  flex: 1;
  font-weight: 500;
}

.you-badge {
  font-size: 0.8em;
  opacity: 0.8;
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
  .chat-container {
    flex-direction: column;
  }
  
  .users-sidebar {
    width: 100%;
    height: 150px;
    border-left: none;
    border-top: 1px solid #e1e5e9;
  }
  
  .users-list {
    flex-direction: row;
    overflow-x: auto;
  }
  
  .user-item {
    min-width: 120px;
  }
  
  .message-content {
    max-width: 85%;
  }
  
  .login-container {
    margin: 20px;
    padding: 30px 20px;
  }
}
</style>
