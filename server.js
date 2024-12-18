const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const emailRoutes = require('./routes/emailRoutes');
const smsRoutes = require('./routes/smsRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve UI
app.use('/', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/email', emailRoutes);
app.use('/sms', smsRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
