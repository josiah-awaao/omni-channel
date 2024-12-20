// const express = require('express');
// const dotenv = require('dotenv');
// const path = require('path');
// const emailRoutes = require('./routes/emailRoutes');
// const smsRoutes = require('./routes/smsRoutes');

// dotenv.config();
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve UI
// app.use('/', express.static(path.join(__dirname, 'public')));

// // Routes
// app.use('/email', emailRoutes);
// app.use('/sms', smsRoutes);

// // Start Server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
// const express = require('express');
// const dotenv = require('dotenv');
// const path = require('path');
// const emailRoutes = require('./routes/emailRoutes');
// const smsRoutes = require('./routes/smsRoutes');
// const http = require('http');
// const socketIo = require('socket.io');
// const { startChatSession, handleChatMessage, handleFileMessage, handleDisconnect } = require('./controllers/chatController');

// dotenv.config();
// const app = express();

// // Create HTTP server and attach socket.io
// const server = http.createServer(app);
// const io = socketIo(server);

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve UI
// app.use('/', express.static(path.join(__dirname, 'public')));

// // Routes for email and SMS
// app.use('/email', emailRoutes);
// app.use('/sms', smsRoutes);

// // Socket.IO: Handling connections for chat
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Start a chat session for the user
//   startChatSession(socket, io);

//   // Listen for incoming chat messages
//   socket.on('chat-message', (message) => {
//     handleChatMessage(socket, message);
//   });

//   // Listen for file attachments
//   socket.on('send-file', (fileData) => {
//     handleFileMessage(socket, fileData);
//   });

//   // Handle disconnections
//   socket.on('disconnect', () => {
//     handleDisconnect(socket, io);
//   });
// });

// // Start Server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

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

// Serve UI
app.use('/', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/email', emailRoutes);
app.use('/sms', smsRoutes);

// Socket.io logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user connection to chat
  connectToChat(socket, io);

  // Listen for incoming messages
  socket.on('send-message', (message) => sendMessage(socket, message));

  // Handle file attachments
  socket.on('send-file', (fileData) => sendFile(socket, fileData));

  // Handle user disconnection
  socket.on('disconnect', () => userDisconnect(socket, io));
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
