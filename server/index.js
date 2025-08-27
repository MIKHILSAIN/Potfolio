const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nmikhilsai@gmail.com',
    pass: 'uzpk hmkv yewl fkgt' // Gmail App Password
  }
});

// Verify transporter connection
transporter.verify(function (error, success) {
  if (error) {
    console.log('Error with mail transporter:', error);
  } else {
    console.log('Server is ready to take messages');
  }
});

app.post('/contact', async (req, res) => {
  const { fullname, email, message } = req.body;

  // Input validation
  if (!fullname || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  const mailOptions = {
    from: 'nmikhilsai@gmail.com',   // Always your Gmail
    to: 'nmikhilsai@gmail.com',
    replyTo: email,                 // User’s email
    subject: `New Contact Form Submission from ${fullname}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${fullname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      success: true,
      message: 'Message sent successfully!'
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
