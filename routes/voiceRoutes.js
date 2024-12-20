const express = require('express');
const { handleIncomingCall, handleGatherInput, processUserInput } = require('../controllers/voiceController');

const router = express.Router();

router.post('/twiml/voice', handleIncomingCall);

router.post('/voice/gather', handleGatherInput);

router.post('/voice/process-input', processUserInput);

module.exports = router;
