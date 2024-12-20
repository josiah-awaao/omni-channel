const express = require('express');
const { makeCall, getCallLogs, getIncomingCallLogs  } = require('../controllers/callController');

const router = express.Router();

router.post('/make', makeCall);
router.get('/logs', getCallLogs);
router.get('/incoming-logs', getIncomingCallLogs);

module.exports = router;
