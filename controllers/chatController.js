const { connectUserToChat, sendMessageToChat, handleFileAttachment, handleDisconnect } = require('../services/chatService');

// Connect users to chat
const connectToChat = (socket, io) => {
  connectUserToChat(socket, io);
};

// Handle sending chat message
const sendMessage = (socket, message) => {
  sendMessageToChat(socket, message);
};

// Handle sending file attachments
const sendFile = (socket, fileData) => {
  handleFileAttachment(socket, fileData);
};

// Handle user disconnect
const userDisconnect = (socket, io) => {
  handleDisconnect(socket, io);
};

module.exports = { connectToChat, sendMessage, sendFile, userDisconnect };
