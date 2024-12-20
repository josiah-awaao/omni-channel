const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const emailRoutes = require('./routes/emailRoutes');
const smsRoutes = require('./routes/smsRoutes');
const { connectToChat, sendMessage, sendFile, userDisconnect } = require('./controllers/chatController');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the UI
app.use('/', express.static(path.join(__dirname, 'public')));

// Routes for email and SMS
app.use('/email', emailRoutes);
app.use('/sms', smsRoutes);

// Socket.io: Handling chat connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Start a chat session for the user
  connectToChat(socket, io);

  // Handle incoming chat messages
  socket.on('chat-message', (message) => {
    sendMessage(socket, message);
  });

  // Handle incoming file attachments
  socket.on('send-file', (fileData) => {
    sendFile(socket, fileData);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    userDisconnect(socket, io);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
