const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// Set up Express server
const app = express();
const upload = multer(); // For handling file uploads

// Serve HTML UI for email sending
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Sender</title>
        <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
        <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          form {
            max-width: 600px;
            margin: 0 auto;
          }
          input, button {
            display: block;
            margin-bottom: 10px;
            width: 100%;
            padding: 8px;
          }
          #editor {
            height: 200px;
          }
        </style>
      </head>
      <body>
        <h1>Send Email</h1>
        <form id="emailForm" enctype="multipart/form-data">
          <input type="email" name="to" placeholder="To" required />
          <input type="text" name="cc" placeholder="CC" />
          <input type="text" name="bcc" placeholder="BCC" />
          <input type="text" name="subject" placeholder="Subject" required />
          <div id="editor"></div>
          <input type="file" name="attachments" multiple />
          <button type="submit">Send Email</button>
        </form>

        <script>
          const quill = new Quill('#editor', { theme: 'snow' });

          document.getElementById('emailForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            formData.append('htmlBody', quill.root.innerHTML);

            const response = await fetch('/email/send', {
              method: 'POST',
              body: formData,
            });

            const result = await response.json();
            if (result.success) {
              alert('Email sent successfully!');
            } else {
              alert('Failed to send email: ' + result.error);
            }
          });
        </script>
      </body>
    </html>
  `);
});

// Nodemailer transporter configuration (using your HostGator credentials)
const transporter = nodemailer.createTransport({
  host: 'dev.spark-consultancy.com', // HostGator SMTP
  port: 465,
  secure: true,
  auth: {
    user: 'test@dev.spark-consultancy.com',
    pass: 'testPassword69@',
  },
});

// Endpoint to send email
app.post('/email/send', upload.array('attachments'), async (req, res) => {
  try {
    const { to, cc, bcc, subject, htmlBody } = req.body;

    // Process attachments
    const attachments = (req.files || []).map((file) => ({
      filename: file.originalname,
      content: file.buffer,
    }));

    // Send email
    const info = await transporter.sendMail({
      from: '"Test User" <test@dev.spark-consultancy.com>',
      to,
      cc,
      bcc,
      subject,
      html: htmlBody,
      attachments,
    });

    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
