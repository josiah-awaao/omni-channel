const { connectUserToChat, sendMessageToChat, handleFileAttachment, handleDisconnect } = require('../services/chatService');

const connectToChat = (socket, io) => {
  connectUserToChat(socket, io);
};

const sendMessage = (socket, message) => {
  sendMessageToChat(socket, message);
};

const sendFile = (socket, fileData) => {
  handleFileAttachment(socket, fileData);
};

const userDisconnect = (socket, io) => {
  handleDisconnect(socket, io);
};

module.exports = { connectToChat, sendMessage, sendFile, userDisconnect };
