const twilio = require('twilio');

// Twilio credentials

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// In-memory storage for SMS inbox (use a database in production)
const smsInbox = [];

// Function to send SMS
exports.sendSms = async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and message are required.',
      });
    }

    const sms = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to,
    });

    console.log(`SMS sent successfully to ${to}: ${sms.sid}`);
    res.json({ success: true, sid: sms.sid });
  } catch (error) {
    console.error('Error sending SMS:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Function to handle incoming SMS
exports.receiveSms = (req, res) => {
  const { Body, From } = req.body;

  if (Body && From) {
    console.log(`Received SMS from ${From}: ${Body}`);
    // Store the incoming SMS in the inbox
    smsInbox.push({
      from: From,
      body: Body,
      date: new Date().toISOString(),
    });
  } else {
    console.error('Invalid incoming SMS data');
  }

  // Respond to Twilio to acknowledge receipt
  res.set('Content-Type', 'text/xml');
  res.send('<Response></Response>');
};

// Function to fetch SMS inbox
exports.getSmsInbox = (req, res) => {
  res.json({ success: true, messages: smsInbox });
};
