const express = require('express');
const { generateToken, handleIncomingCall, processUserInput } = require('../controllers/voiceController');

const router = express.Router();

router.get('/token', generateToken);
router.post('/voice', handleIncomingCall);
router.post('/process-input', processUserInput);

module.exports = router;
