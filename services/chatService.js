const waitingUsers = [];
const userSockets = {};

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

const sendMessageToChat = (socket, message) => {
  socket.emit('new-message', message);
  socket.broadcast.emit('new-message', message);
};

const handleFileAttachment = (socket, fileData) => {
  socket.emit('new-file', fileData);
  socket.broadcast.emit('new-file', fileData);
};

const handleDisconnect = (socket, io) => {
  const index = waitingUsers.indexOf(socket.id);
  if (index !== -1) waitingUsers.splice(index, 1);

  delete userSockets[socket.id];

  socket.broadcast.emit('disconnected', { message: 'The other user has disconnected.' });
};

module.exports = { connectUserToChat, sendMessageToChat, handleFileAttachment, handleDisconnect };