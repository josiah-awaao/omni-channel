const express = require('express');
const { sendSms, receiveSms, getSmsInbox } = require('../controllers/smsController');

const router = express.Router();

router.post('/send', sendSms); // Endpoint to send SMS
router.post('/receive', receiveSms); // Endpoint to handle incoming SMS
router.get('/inbox', getSmsInbox); // Endpoint to fetch SMS inbox

module.exports = router;
