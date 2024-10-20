const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const cron = require('node-cron');
const app = express();

app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'civiccompassnotification@gmail.com',
    pass: 'abaphhydfxaepuxy',
  },
});

const daysUntilElection = () => {
  const electionDate = new Date('2024-11-05');
  const today = new Date();
  const difference = electionDate - today;
  return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

const generateEmailContent = () => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; color: #333;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="text-align: center; color: #2a9d8f;">National Election Checklist</h2>
        <p style="font-size: 16px; color: #555;">
          Here’s what you can do to ensure you’re prepared for the upcoming election on 
          <strong>November 5, 2024</strong>:
        </p>
        <ul style="font-size: 16px; line-height: 1.5; color: #333;">
          <li>Verify your voter registration status.</li>
          <li>Locate your polling place.</li>
          <li>Review candidates and ballot measures.</li>
          <li>Prepare your ID for voting.</li>
          <li>Make a transportation plan for Election Day.</li>
          <li>Mark your calendar for <strong>November 5, 2024</strong>!</li>
        </ul>
        <div style="text-align: center; margin-top: 20px;">
          <span style="font-size: 18px; color: #e76f51;">
            <strong>Days left until Election Day: ${daysUntilElection()}</strong>
          </span>
        </div>
        <div style="margin-top: 30px; padding: 10px; background-color: #2a9d8f; color: #fff; text-align: center; border-radius: 8px;">
          <p style="font-size: 14px; margin: 0;">
            Thank you for staying engaged! Your vote matters. Make your voice heard!
          </p>
        </div>
      </div>
    </div>
  `;
};

app.post('/api/send-election-reminder', async (req, res) => {
  const { email } = req.body;
  console.log('Received request to send email to:', email);

  const mailOptions = {
    from: 'civiccompassnotification@gmail.com',
    to: email,
    subject: 'Weekly Election Checklist & Countdown',
    html: generateEmailContent(),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending email.' });
    }
    console.log('Email sent:', info.response);
    res.json({ message: 'Election reminder sent successfully!' });
  });
});

cron.schedule('0 9 * * 2', () => {
  const emailList = ['user1@example.com', 'user2@example.com'];

  emailList.forEach((email) => {
    const mailOptions = {
      from: 'civiccompassnotification@gmail.com',
      to: email,
      subject: 'Weekly Election Checklist & Countdown',
      html: generateEmailContent(),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending scheduled email:', error);
      } else {
        console.log('Scheduled email sent:', info.response);
      }
    });
  });
  console.log('Weekly election reminders sent to all users!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
