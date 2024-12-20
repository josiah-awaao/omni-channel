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

// Create an HTTP server and attach socket.io
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

  // Start a chat session when a user connects
  connectToChat(socket, io);

  // Handle incoming chat messages
  socket.on('send-message', (message) => {
    console.log('Received message: ', message);
    sendMessage(socket, message); // sendMessage should broadcast this message to the other user.
  });

  // Handle incoming file attachments
  socket.on('send-file', (fileData) => {
    console.log('Received file data');
    sendFile(socket, fileData); // sendFile should broadcast the file to the other user.
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    userDisconnect(socket, io); // This will remove the user from the waiting list and notify the other user
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
