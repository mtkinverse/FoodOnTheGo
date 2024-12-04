const nodemailer = require('nodemailer');
const db = require('../db');
const crypto = require('crypto');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD, // Use an app password for better security
  },
  debug: true, // Include detailed logs
  logger: true, // Log transport actions
});

function generateOTP() {
  return crypto.randomInt(1000, 9999).toString();
}

function formatOrderDetailsHTML(order) {
  return `
  <div style="font-family: Arial, sans-serif; color: #4B0082; background-color: #FFFFFF; padding: 20px; border: 1px solid #4B0082; border-radius: 8px;">
      <h1 style="color: #4B0082; border-bottom: 2px solid #4B0082; padding-bottom: 5px;">Order Confirmation</h1>
      <p>Hello <strong>${order.customerName}</strong>,</p>
      <p>Thank you for your order! Here are your order details:</p>

      <h3 style="color: #4B0082;">Order ID: ${order.id}</h3>
      <p>Date: ${order.date}</p>

      <h3 style="color: #4B0082;">Items:</h3>
      <ul style="list-style-type: none; padding: 0;">
          ${order.items.map(item => `<li style='margin-bottom: 8px;'>${item.quantity}x ${item.dish_name} - <strong>Rs ${item.Item_Price}</strong></li>`).join('')}
      </ul>

      <h3 style="color: #4B0082;">Total Amount: <span style="color: #2E8B57;">Rs ${order.totalAmount}</span></h3>

      <h3 style="color: #4B0082;">Delivery Address:</h3>
      <p>${order.deliveryAddress}</p>
      
      <p style="margin-top: 20px;">Thank you for ordering from us!</p>
      <p style="margin-top: 10px; text-align: center; font-weight: bold; border-top: 2px solid #4B0082; padding-top: 10px; color: #4B0082;">FOOD ON THE GO</p>
  </div>
  `;
}

function formatOrderCancellationEmail(order){
  return `
  <div style="font-family: Arial, sans-serif; color: #4B0082; background-color: #FFFFFF; padding: 20px; border: 1px solid #4B0082; border-radius: 8px;">
      <h1 style="color: #4B0082; border-bottom: 2px solid #4B0082; padding-bottom: 5px;">Order Cancellation</h1>
      <p>Hello <strong>${order.customerName}</strong>,</p>
      <p>Your order was cancelled</p>

      <h3 style="color: #4B0082;">Order ID: ${order.id}</h3>
      
      <p style="margin-top: 20px;">We hope to see you again!</p>
      <p style="margin-top: 10px; text-align: center; font-weight: bold; border-top: 2px solid #4B0082; padding-top: 10px; color: #4B0082;">FOOD ON THE GO</p>
  </div>
  `;
}

async function sendOrderNotification(email, order) {
  const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Order Confirmation - ${order.id}`,
      html: formatOrderDetailsHTML(order), // For HTML emails
  };

  try {
      await transporter.sendMail(mailOptions);
      console.log('Order notification sent.');
  } catch (error) {
      console.error('Error sending order notification:', error);
  }
}

async function sendCancellationEmail(email,order){
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `Order Cancellation - ${order.id}`,
    html: formatOrderCancellationEmail(order), // For HTML emails
};
  try{
    await transporter.sendMail(mailOptions);
    console.log('cancellation email sent');
  }
  catch(err){
    console.log('Error sending email');
  }
}

// Send verification email
async function sendVerificationEmail (email, otp) {
  const mailOptions = {
    from: process.env.EMAIL,
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

async function handleSendOTP  (req, res) {
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

async function handleVerifyOTP(req, res) {
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


module.exports = {
  handleSendOTP,
  handleVerifyOTP,
  sendOrderNotification,
  sendCancellationEmail
};