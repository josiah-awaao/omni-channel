const sendSMS = (req, res) => {
    const { to, message } = req.body;
  
    console.log(`SMS sent to ${to}: ${message}`);
    res.json({ success: true, message: 'SMS sent successfully (mocked).' });
  };
  
  module.exports = { sendSMS };
  