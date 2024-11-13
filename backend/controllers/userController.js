
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const phoneNumberPattern = /^\+92 \d{3} \d{7}$/;
const isValidPhoneNumber = (phone) => phoneNumberPattern.test(phone);

module.exports.registerUser = (req, res) => {
    const q = 'SELECT * FROM Customer WHERE email_address = ?';
    db.query(q, [req.body.email], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("Account with this email already exists");
        
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        
        const qInsert = "INSERT INTO Customer (Customer_name,Email_address,Account_Password,Phone_no) VALUES (?, ?, ?,  `?)";
        const values = [req.body.name,req.body.email, hash,req.body.phoneNo];
        console.log("Inserting user:", values);
        db.query(qInsert, values, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json('User created');
        });
    });
}

module.exports.loginUser = (req, res) => {
    const q = 'SELECT * FROM Customer WHERE Email_address = ?';
    
    db.query(q, [req.body.email], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("User not found");
        
        const user = data[0];
        const isPasswordValid = bcrypt.compareSync(req.body.password, user.Account_Password);
        if (!isPasswordValid) return res.status(401).json("Invalid password");
        
        const { Account_Password, ...other } = user;
        const token = jwt.sign({ id: user.customer_id }, "mykey");
        res.cookie("access_token", token, {
            httpOnly: true
        }).json(other);
    });
};
