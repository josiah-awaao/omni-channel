// chatService.js

const waitingUsers = []; // Queue of waiting users
const userSockets = {}; // Mapping of user IDs to their socket connections

// Connect user to chat and match with another user
const connectUserToChat = (socket, io) => {
  waitingUsers.push(socket.id);
  userSockets[socket.id] = socket;

  if (waitingUsers.length >= 2) {
    const user1 = waitingUsers.shift();
    const user2 = waitingUsers.shift();

    // Notify both users that they are matched
    io.to(user1).emit('matched', { message: 'You are now connected to someone!' });
    io.to(user2).emit('matched', { message: 'You are now connected to someone!' });

    // Start the chat for both users
    io.to(user1).emit('chat-started');
    io.to(user2).emit('chat-started');
  }
};

// Send a message to the other user
const sendMessageToChat = (socket, message) => {
  // Send message to the sender and broadcast to the other user
  socket.emit('new-message', message);
  socket.broadcast.emit('new-message', message);
};

// Handle file attachment
const handleFileAttachment = (socket, fileData) => {
  socket.emit('new-file', fileData); // Send to sender
  socket.broadcast.emit('new-file', fileData); // Broadcast to the other user
};

// Handle user disconnection
const handleDisconnect = (socket, io) => {
  // Remove user from the waiting list and from the userSockets map
  const index = waitingUsers.indexOf(socket.id);
  if (index !== -1) waitingUsers.splice(index, 1);

  delete userSockets[socket.id];

  // Notify the other user about the disconnection
  socket.broadcast.emit('disconnected', { message: 'The other user has disconnected.' });
};

module.exports = { connectUserToChat, sendMessageToChat, handleFileAttachment, handleDisconnect };
