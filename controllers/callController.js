const twilio = require('twilio');


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const callLogs = [];

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
      url: 'http://demo.twilio.com/docs/voice.xml',
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

exports.getCallLogs = (req, res) => {
  res.json({ success: true, logs: callLogs });
};

const incomingCallLogs = [];

exports.getIncomingCallLogs = (req, res) => {
  res.json({ success: true, logs: incomingCallLogs });
};

exports.handleIncomingCall = (req, res) => {
  const { From } = req.body;

  // Add to logs
  incomingCallLogs.push({
    from: From,
    message: 'Incoming call received.',
    date: new Date().toISOString(),
  });

  const twiml = new VoiceResponse();
  twiml.say('Thank you for calling! We will get back to you.');
  res.type('text/xml');
  res.send(twiml.toString());
};
