const twilio = require('twilio');

// Twilio credentials

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// In-memory storage for call logs
const callLogs = [];

// Function to make a call
exports.makeCall = async (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required.',
      });
    }

    const call = await client.calls.create({
      url: 'http://demo.twilio.com/docs/voice.xml', // Update with your TwiML URL if needed
      from: twilioPhoneNumber,
      to,
    });

    console.log(`Call initiated successfully to ${to}: ${call.sid}`);
    callLogs.push({
      to,
      status: 'initiated',
      date: new Date().toISOString(),
    });
    res.json({ success: true, sid: call.sid });
  } catch (error) {
    console.error('Error making call:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Function to fetch call logs
exports.getCallLogs = (req, res) => {
  res.json({ success: true, logs: callLogs });
};
