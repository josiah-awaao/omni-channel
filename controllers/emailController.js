// const nodemailer = require('nodemailer');

// const sendEmail = async (req, res) => {
//   try {
//     const { to, cc, bcc, subject, htmlBody } = req.body;

//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const info = await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to,
//       cc,
//       bcc,
//       subject,
//       html: htmlBody,
//     });

//     res.json({ success: true, messageId: info.messageId });
//   } catch (error) {
//     console.error('Email Error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// module.exports = { sendEmail };

// const nodemailer = require('nodemailer');

// // Email Sending Controller
// const sendEmail = async (req, res) => {
//   try {
//     // Extract form fields and attachments
//     const { to, cc, bcc, subject, htmlBody } = req.body;

//     // Ensure 'to' field is provided
//     if (!to) {
//       return res.status(400).json({ success: false, error: "Recipient 'to' field is required." });
//     }

//     // Process attachments if any
//     const attachments = (req.files || []).map((file) => ({
//       filename: file.originalname,
//       content: file.buffer,
//     }));

//     // Nodemailer transporter configuration
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: true, // True for 465 (SSL)
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // Email sending configuration
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to, // Main recipient
//       cc, // CC recipients
//       bcc, // BCC recipients
//       subject, // Email subject
//       html: htmlBody, // HTML content (from Quill editor)
//       attachments, // Processed file attachments
//     };

//     // Send the email
//     const info = await transporter.sendMail(mailOptions);

//     console.log('Email Sent:', info.messageId);
//     res.json({ success: true, messageId: info.messageId });
//   } catch (error) {
//     console.error('Email Sending Error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// module.exports = { sendEmail };
const nodemailer = require('nodemailer');

// Email Sending Controller
const sendEmail = async (req, res) => {
  try {
    // Extract fields from req.body
    const { to, cc, bcc, subject, htmlBody } = req.body;

    // Ensure 'to' field is provided
    if (!to) {
      return res.status(400).json({ success: false, error: "Recipient 'to' field is required." });
    }

    // Process attachments (if any)
    const attachments = (req.files || []).map((file) => ({
      filename: file.originalname,
      content: file.buffer,
    }));

    // Nodemailer Transporter Configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, // True for port 465 (SSL)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Mail Options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      cc,
      bcc,
      subject,
      html: htmlBody, // HTML content from Quill Editor
      attachments, // Attachments
    };

    // Send Email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email Sent:', info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Email Sending Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { sendEmail };
