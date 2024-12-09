const nodemailer = require('nodemailer');
const db = require('../db');
const crypto = require('crypto');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD, 
  },

});

function generateOTP() {
  return crypto.randomInt(1000, 9999).toString();
}

function formatOrderDetailsHTML(order) {
  return `
  <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h1 style="color: #4B0082; text-align: center; border-bottom: 2px solid #4B0082; padding-bottom: 10px;">Order Confirmation</h1>
      <p style="font-size: 16px; line-height: 1.5;">Hello <strong>${order.customerName}</strong>,</p>
      <p style="font-size: 16px; line-height: 1.5;">Thank you for your order! Below are your order details:</p>

      <div style="margin: 20px 0; padding: 10px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px;">
          <h3 style="color: #4B0082; margin-bottom: 5px;">Order ID: <span style="color: #000;">${order.id}</span></h3>
          <p style="margin: 5px 0; font-size: 14px; color: #555;">Date: ${order.date}</p>
      </div>

      <h3 style="color: #4B0082; margin-top: 20px;">Items Ordered:</h3>
      <ul style="list-style: none; padding: 0;">
          ${order.items.map(item => `
              <li style='margin-bottom: 10px; font-size: 14px;'>
                  <span style="font-weight: bold;">${item.quantity}x</span> ${item.dish_name} 
                  - <span style="color: #2E8B57; font-weight: bold;">Rs ${item.Item_Price}</span>
              </li>
          `).join('')}
      </ul>

      <div style="margin: 20px 0; padding: 10px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px;">
          <h3 style="color: #4B0082; margin-bottom: 5px;">Total Amount:</h3>
          <p style="font-size: 16px; color: #2E8B57; font-weight: bold;">Rs ${order.totalAmount}</p>
      </div>

      <h3 style="color: #4B0082; margin-top: 20px;">Delivery Address:</h3>
      <p style="font-size: 14px; line-height: 1.5;">${order.deliveryAddress}</p>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 16px; text-align: center; margin: 20px 0; color: #555;">Thank you for choosing <strong style="color: #4B0082;">FOOD ON THE GO</strong>!</p>
      <p style="font-size: 14px; text-align: center; font-weight: bold; color: #4B0082; margin-top: 10px;">Your satisfaction is our priority!</p>
  </div>
  `;
}


function formatOrderCancellationEmail(order) {
  return `
  <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h1 style="color: #B22222; text-align: center; border-bottom: 2px solid #B22222; padding-bottom: 10px;">Order Cancellation</h1>
      <p style="font-size: 16px; line-height: 1.5;">Hello <strong>${order.customerName}</strong>,</p>
      <p style="font-size: 16px; line-height: 1.5;">We are sorry to know that you cancelled your order. Below are the details:</p>

      <div style="margin: 20px 0; padding: 10px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px;">
          <h3 style="color: #B22222; margin-bottom: 5px;">Order ID: <span style="color: #000;">${order.id}</span></h3>
      </div>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 16px; text-align: center; margin: 20px 0; color: #555;">We apologize for the any inconvenience we may caused and hope to serve you again in the future.</p>
      <p style="font-size: 14px; text-align: center; font-weight: bold; color: #B22222; margin-top: 10px;">Thank you for choosing <strong style="color: #4B0082;">FOOD ON THE GO</strong>.</p>
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

function formatStatusEmail(order) {
  return `
  <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h1 style="color: #4B0082; text-align: center; border-bottom: 2px solid #4B0082; padding-bottom: 10px;">Order Delivery</h1>
      <p style="font-size: 16px; line-height: 1.5;">Hello <strong>${order.customer_name}</strong>,</p>
      <p style="font-size: 16px; line-height: 1.5;">We are excited to inform you that your order is out for delivery!</p>

      <div style="margin: 20px 0; padding: 10px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px;">
          <h3 style="color: #4B0082; margin-bottom: 5px;">Order ID: <span style="color: #000;">${order.order_id}</span></h3>
          <p style="margin: 5px 0; font-size: 14px; color: #555;">Rider: <strong>${order.rider_name}</strong></p>
          <p style="margin: 5px 0; font-size: 14px; color: #555;">Contact: <strong>${order.rider_contact}</strong></p>
      </div>

      <p style="font-size: 16px; line-height: 1.5; margin-top: 20px;">Please have <strong style="color: #2E8B57;">Rs. ${order.total_amount}</strong> ready for payment.</p>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 16px; text-align: center; margin: 20px 0; color: #555;">Thank you for choosing <strong style="color: #4B0082;">FOOD ON THE GO</strong>! We hope you enjoy your meal.</p>
      <p style="font-size: 14px; text-align: center; font-weight: bold; color: #4B0082; margin-top: 10px;">Your satisfaction is our priority!</p>
  </div>
  `;
}

function formatRiderEmail(order) {
  return `
  <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h1 style="color: #4B0082; text-align: center; border-bottom: 2px solid #4B0082; padding-bottom: 10px;">Order Delivery</h1>
      <p style="font-size: 16px; line-height: 1.5;">Hello <strong>${order.rider_name}</strong>,</p>
      <p style="font-size: 16px; line-height: 1.5;">You have been assigned a new delivery!</p>

      <div style="margin: 20px 0; padding: 10px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px;">
          <h3 style="color: #4B0082; margin-bottom: 5px;">Order ID: <span style="color: #000;">${order.order_id}</span></h3>
          <p style="margin: 5px 0; font-size: 14px; color: #555;">Address: <strong>${order.address}</strong></p>
          <p style="margin: 5px 0; font-size: 14px; color: #555;">Amount to collect: <strong>${order.toal_amount}</strong></p>
      </div>

      <p style="font-size: 16px; line-height: 1.5; margin-top: 20px;">Please ensure a timely delivery!</p>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 16px; text-align: center; margin: 20px 0; color: #555;"> <strong style="color: #4B0082;">FOOD ON THE GO</strong>!.</p>
  </div>
  `;
}


async function sendStatusEmail(customer_email,rider_email,order){
  const customerOptions = {
    from: process.env.EMAIL,
    to: customer_email,
    subject: `Your order is on the way - ${order.order_id}`,
    html: formatStatusEmail(order), // For HTML emails
};
const riderOptions = {
  from: process.env.EMAIL,
  to: rider_email,
  subject: `Your have been assigned a new task- ${order.order_id}`,
  html: formatRiderEmail(order), // For HTML emails
};
  try{
    await transporter.sendMail(customerOptions);
    await transporter.sendMail(riderOptions);
    console.log('dispatch email sent');
  }
  catch(err){
    console.log('Error sending email');
  }
}

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
  sendCancellationEmail,
  sendStatusEmail
};