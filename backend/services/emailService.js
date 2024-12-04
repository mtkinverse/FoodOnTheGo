const nodemailer = require('nodemailer');
const db = require('../db');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abdullahedhi17@gmail.com',
    pass: 'fqwg bdzf cutl jgot', // Use an app password for better security
  },
  debug: true, // Include detailed logs
  logger: true, // Log transport actions
});

function generateOTP() {
  return crypto.randomInt(1000, 9999).toString();
}

// Send verification email
async function sendVerificationEmail(email, otp) {
  const mailOptions = {
    from: 'abdullahedhi17@gmail.com',
    to: email,
    subject: 'Verify Your Email',
    text: `Your verification code is: ${otp}. This code will expire in 5 minutes.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

function generateAndStoreOTP(email) {
  return new Promise(async (resolve, reject) => {
    const otp = generateOTP();
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    const query = `
      INSERT INTO OTP (email, otp, expiration_time) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE 
      otp = VALUES(otp), expiration_time = VALUES(expiration_time)
    `;

    db.query(query, [email, otp, expirationTime], async (err, result) => {
      if (err) {
        console.error('Error storing OTP:', err);
        return reject(false);
      }
      const emailSent = await sendVerificationEmail(email, otp);
      if (emailSent) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  });
}

function verifyOTP(email, userOTP) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * 
      FROM OTP 
      WHERE email = ? AND otp = ? AND expiration_time > NOW()
    `;
    db.query(query, [email, userOTP], (err, result) => {
      if (err) {
        console.error('Error verifying OTP:', err);
        return reject(false);
      }
      if (result.length > 0) {
        const deleteQuery = 'DELETE FROM OTP WHERE email = ?';
        db.query(deleteQuery, [email], (deleteErr) => {
          if (deleteErr) {
            console.error('Error deleting OTP after verification:', deleteErr);
            return reject(false);
          }
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
  });
}

module.exports.handleSendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await generateAndStoreOTP(email);
    if (result) {
      res.status(200).json({ message: 'OTP sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('Error handling send OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.handleVerifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const isValid = await verifyOTP(email, otp);
    if (isValid) {
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error handling verify OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
