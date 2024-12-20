const waitingUsers = [];
const userSockets = {};

// Connect user to the chat queue and attempt to match with another user
const connectUserToChat = (socket, io) => {
  // Add user to the waiting queue
  waitingUsers.push(socket.id);
  userSockets[socket.id] = socket;

  // If we have at least two users, try to match them
  if (waitingUsers.length >= 2) {
    const user1 = waitingUsers.shift(); // First user
    const user2 = waitingUsers.shift(); // Second user

    // Notify both users they are matched
    io.to(user1).emit('matched', { message: 'You are now connected to someone!' });
    io.to(user2).emit('matched', { message: 'You are now connected to someone!' });

    // Notify both users they can start chatting
    io.to(user1).emit('chat-started');
    io.to(user2).emit('chat-started');
  }
};

// Send a message to the other user
const sendMessageToChat = (socket, message) => {
  // Emit message to the sender
  socket.emit('new-message', message);
  // Broadcast message to the other user
  socket.broadcast.emit('new-message', message);
};

// Handle file attachments
const handleFileAttachment = (socket, fileData) => {
  // Emit the file to the sender
  socket.emit('new-file', fileData);
  // Broadcast file to the other user
  socket.broadcast.emit('new-file', fileData);
};

// Handle user disconnections and remove them from the waiting queue
const handleDisconnect = (socket, io) => {
  // Remove the user from the waiting queue
  const index = waitingUsers.indexOf(socket.id);
  if (index !== -1) waitingUsers.splice(index, 1);

  delete userSockets[socket.id];

  // Notify the other user about the disconnection
  socket.broadcast.emit('disconnected', { message: 'The other user has disconnected.' });
};

module.exports = { connectUserToChat, sendMessageToChat, handleFileAttachment, handleDisconnect };
