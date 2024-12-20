const nodemailer = require('nodemailer');
const Imap = require('node-imap');
const { simpleParser } = require('mailparser');

// Send Email Controller
const sendEmail = async (req, res) => {
  try {
    const { to, cc, bcc, subject, htmlBody } = req.body;

    if (!to) {
      return res.status(400).json({ success: false, error: "Recipient 'to' field is required." });
    }

    const attachments = (req.files || []).map((file) => ({
      filename: file.originalname,
      content: file.buffer,
    }));

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      cc,
      bcc,
      subject,
      html: htmlBody,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Email Sending Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const receiveEmails = (req, res) => {
    const imapConfig = {
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASS,
      host: process.env.IMAP_HOST,
      port: process.env.IMAP_PORT || 993,
      tls: true,
    };
  
    const imap = new Imap(imapConfig);
  
    imap.once('ready', () => {
      console.log('IMAP Connection ready...');
      imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          console.error('Error opening inbox:', err);
          return res.status(500).json({ success: false, error: 'Failed to open inbox' });
        }
  
        console.log(`INBOX opened. Total messages: ${box.messages.total}`);
  
        // Search for all emails
        imap.search(['ALL'], (err, results) => {
          if (err || results.length === 0) {
            console.log('No emails found.');
            imap.end();
            return res.json({ success: true, emails: [] });
          }
  
          console.log(`Total emails found: ${results.length}`);
  
          const recentEmails = results.slice(-50); // Fetch last 50 emails
          const fetchedEmails = [];
          let completed = 0; // Counter to track completed parsing
  
          const fetch = imap.fetch(recentEmails, { bodies: '', markSeen: false });
  
          fetch.on('message', (msg, seqno) => {
            console.log(`Fetching message #${seqno}`);
            let email = {};
  
            msg.on('body', (stream) => {
              simpleParser(stream, (err, parsed) => {
                if (err) {
                  console.error(`Error parsing message #${seqno}:`, err);
                  return;
                }
  
                email = {
                  from: parsed.from.text,
                  subject: parsed.subject,
                  text: parsed.text,
                  html: parsed.html,
                  date: parsed.date,
                  attachments: parsed.attachments.map((att) => ({
                    filename: att.filename,
                    size: att.size,
                    contentType: att.contentType,
                    content: att.content.toString('base64'),
                  })),
                };
  
                fetchedEmails.push(email);
                completed++;
  
                // Check if all emails are parsed
                if (completed === recentEmails.length) {
                  console.log(`All ${completed} emails parsed successfully.`);
  
                  // Sort emails by date (newest first)
                  fetchedEmails.sort((a, b) => new Date(b.date) - new Date(a.date));
  
                  imap.end();
                  res.json({ success: true, emails: fetchedEmails });
                }
              });
            });
  
            msg.once('end', () => {
              console.log(`Finished fetching message #${seqno}`);
            });
          });
  
          fetch.once('error', (err) => {
            console.error('Fetch error:', err);
            imap.end();
            res.status(500).json({ success: false, error: 'Error fetching emails' });
          });
        });
      });
    });
  
    imap.once('error', (err) => {
      console.error('IMAP Error:', err);
      res.status(500).json({ success: false, error: 'IMAP connection failed' });
    });
  
    imap.once('end', () => {
      console.log('IMAP Connection ended.');
    });
  
    imap.connect();
  };
  

module.exports = { sendEmail, receiveEmails };