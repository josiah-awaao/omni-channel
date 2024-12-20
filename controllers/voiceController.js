const twilio = require('twilio');
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const VoiceResponse = twilio.twiml.VoiceResponse;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET; 
const twimlAppSid = process.env.TWILIO_TWIML_ID;

exports.generateToken = (req, res) => {
  const identity = 'web-client'; 

  try {
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true,
    });

    const token = new AccessToken(accountSid, apiKey, apiSecret, { identity });
    token.addGrant(voiceGrant);

    res.json({ token: token.toJwt() });
  } catch (error) {
    console.error('Error generating token:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.handleIncomingCall = (req, res) => {
  try {
    const twiml = new VoiceResponse();

    twiml.say('Hello, how can I assist you today?');

    twiml.dial().client('web-client');

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error handling incoming call:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.processUserInput = (req, res) => {
  const { Digits } = req.body;
  const twiml = new VoiceResponse();

  console.log('Received DTMF input:', Digits);

  try {
    if (Digits === '1') {
      console.log('Responding: Take your water.');
      twiml.say('Please remember to take your water.');
    } else if (Digits === '2') {
      console.log('Responding: Drink your vitamins.');
      twiml.say('Don\'t forget to drink your vitamins.');
    } else {
      console.log('Responding: Invalid input.');
      twiml.say('Invalid input. Goodbye.');
    }

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error processing user input:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.playWaterMessage = (req, res) => {
  const twiml = new VoiceResponse();
  twiml.say('Please remember to take your water.');

  res.type('text/xml');
  res.send(twiml.toString());
};

exports.playVitaminsMessage = (req, res) => {
  const twiml = new VoiceResponse();
  twiml.say('Please remember to drink your vitamins.');

  res.type('text/xml');
  res.send(twiml.toString());
};