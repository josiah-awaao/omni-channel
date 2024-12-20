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

const callRoutes = require('./routes/callRoutes');
const voiceRoutes = require('./routes/voiceRoutes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/email', emailRoutes);
app.use('/sms', smsRoutes);
app.use('/call', callRoutes);

app.use('/voice', voiceRoutes);
app.use('/twiml', voiceRoutes);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  connectToChat(socket, io);

  socket.on('chat-message', (message) => {

    const messageWithSenderInfo = { ...message, isSender: true };

    socket.broadcast.emit('new-message', { ...message, isSender: false });

    socket.emit('new-message', messageWithSenderInfo);
  });

  socket.on('send-file', (fileData) => {
    const fileWithSenderInfo = { ...fileData, isSender: true };

    socket.broadcast.emit('new-file', { ...fileData, isSender: false });

    socket.emit('new-file', fileWithSenderInfo);
  });

  socket.on('disconnect', () => {
    userDisconnect(socket, io);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});