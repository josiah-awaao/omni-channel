const express = require('express');
const multer = require('multer');
const { sendEmail } = require('../controllers/emailController');

// Configure Multer to handle file uploads and form fields
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: { fileSize: 10 * 1024 * 1024 }, // Optional: Limit file size to 10 MB
});

const router = express.Router();

// Use 'upload' middleware to parse multipart/form-data
router.post('/send', upload.array('attachments'), sendEmail);

module.exports = router;
