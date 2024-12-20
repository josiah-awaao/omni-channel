const express = require('express');
const { sendSms, receiveSms, getSmsInbox } = require('../controllers/smsController');

const router = express.Router();

router.post('/send', sendSms);
router.post('/receive', receiveSms);
router.get('/inbox', getSmsInbox);

module.exports = router;
