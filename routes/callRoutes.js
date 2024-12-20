const express = require('express');
const { makeCall, getCallLogs } = require('../controllers/callController');

const router = express.Router();

router.post('/make', makeCall);
router.get('/logs', getCallLogs);

module.exports = router;
