// chatController.js
const { connectUserToChat, sendMessageToChat, handleFileAttachment, handleDisconnect } = require('../services/chatService');

// Handle connection to chat
const connectToChat = (socket, io) => {
  connectUserToChat(socket, io);
};

// Handle incoming chat messages
const sendMessage = (socket, message) => {
  sendMessageToChat(socket, message);
};

// Handle file attachment messages
const sendFile = (socket, fileData) => {
  handleFileAttachment(socket, fileData);
};

// Handle user disconnection
const userDisconnect = (socket, io) => {
  handleDisconnect(socket, io);
};

module.exports = { connectToChat, sendMessage, sendFile, userDisconnect };
