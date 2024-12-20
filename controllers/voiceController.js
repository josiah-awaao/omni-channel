const { VoiceResponse } = require('twilio').twiml;

exports.handleIncomingCall = (req, res) => {
  const twiml = new VoiceResponse();

  twiml.say('Hello, test call.');

  // Example: Play an audio file
  // twiml.play('https://api.twilio.com/cowbell.mp3');

  res.type('text/xml');
  res.send(twiml.toString());
};

exports.handleGatherInput = (req, res) => {
  const twiml = new VoiceResponse();
  const gather = twiml.gather({ input: 'dtmf', timeout: 5, numDigits: 1 });

  gather.say('Press 1 for sales. Press 2 for support.');
  twiml.redirect('/voice/process-input');

  res.type('text/xml');
  res.send(twiml.toString());
};

exports.processUserInput = (req, res) => {
  const { Digits } = req.body; // Get user input
  const twiml = new VoiceResponse();

  if (Digits === '1') {
    twiml.say('You selected sales. Connecting you now.');
  } else if (Digits === '2') {
    twiml.say('You selected support. Connecting you now.');
  } else {
    twiml.say('Invalid input. Goodbye.');
  }

  res.type('text/xml');
  res.send(twiml.toString());
};
