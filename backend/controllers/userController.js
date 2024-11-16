
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const phoneNumberPattern = /^\+92 \d{3} \d{7}$/;
// const isValidPhoneNumber = (phone) => phoneNumberPattern.test(phone);

function registerCustomer(req,res) {
    console.log("Customer registration endpoint hit");
    const q = 'SELECT * FROM Customer WHERE email_address = ? or phone_no = ?';

    db.query(q, [req.body.email,req.body.phoneNo], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("Customer account with this email or phone number already exists");
        
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        
        const qInsert = "INSERT INTO Customer (Customer_name,Email_address,Account_Password,Phone_no) VALUES (?, ?, ?, ?)";
        const values = [req.body.name,req.body.email, hash,req.body.phoneNo];
        console.log("Inserting customer:", values);
        db.query(qInsert, values, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json('Customer created');
        });
    });
}


function registerOwner(req,res) {
    console.log("Owner registration endpoint hit");
    const q = 'SELECT * FROM Restaurant_owner WHERE email_address = ? or phone_no = ?';

    db.query(q, [req.body.email,req.body.phoneNo], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("Owner account with this email or phone number already exists");
        
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        
        const qInsert = "INSERT INTO Restaurant_owner (Owner_name,Email_address,Account_Password,Phone_no) VALUES (?, ?, ?, ?)";
        const values = [req.body.name,req.body.email, hash,req.body.phoneNo];
        console.log("Inserting owner:", values);
        db.query(qInsert, values, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json('Owner created');
        });
    });
}


function registerRider(req,res) {
    console.log("Delivery Rider registration endpoint hit");
    const q = 'SELECT * FROM Delivery_Rider WHERE email_address = ? or phone_no = ?';

    db.query(q, [req.body.email,req.body.phoneNo], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("Rider account with this email or phone number already exists");
        
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        
        const qInsert = "INSERT INTO Delivery_Rider (Rider_name,Email_address,Account_Password,Phone_no,BikeNo) VALUES (?, ?, ?, ? ,?)";
        const values = [req.body.name,req.body.email, hash,req.body.phoneNo,req.body.bikeNo];
        console.log("Inserting rider:", values);
        db.query(qInsert, values, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json('Rider created');
        });
    });
}

module.exports.registerUser = (req, res) => {
    const role = req.body.role 

    switch (role) {
        case 'Customer':
            registerCustomer(req, res, (err) => {
                if (err) return res.status(500).json({ message: 'Registration failed for Customer', error: err.message });
                return res.status(200).json({ message: 'Customer registered successfully' });
            });
            break;
        case 'Restaurant_Owner':
            registerOwner(req, res, (err) => {
                if (err) return res.status(500).json({ message: 'Registration failed for Owner', error: err.message });
                return res.status(200).json({ message: 'Owner registered successfully' });
            });
            break;
        case 'Delivery_Rider':
            registerRider(req, res, (err) => {
                if (err) return res.status(500).json({ message: 'Registration failed for Rider', error: err.message });
                return res.status(200).json({ message: 'Rider registered successfully' });
            });
            break;
    }
};


module.exports.loginUser = (req, res) => {
    console.log('login endpoint hit');
    const role = req.body.role;
    const q = `SELECT * FROM ${role} WHERE Email_address = ?`;
  
    db.query(q, [req.body.email], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length == 0) return res.status(500).json("User not found");
        
        const user = data[0];
        const isPasswordValid = bcrypt.compareSync(req.body.password, user.Account_Password);
        if (!isPasswordValid) return res.status(401).json("Invalid password");
        
        const { Account_Password, ...other } = user;
        const token = jwt.sign(
          { id: role === 'Customer' ? user.customer_id : role == 'Restaurant_owner' ? user.owner_id : user.rider_id }, 
          "my_key" , { expiresIn: 60  }
        );
        res.cookie("access_token", token, {
            httpOnly: true
        }).json(other);
    });
};

module.exports.logoutUser = (req,res) =>{
    
        const token = req.cookies.access_token; // Get the token from cookies
        if (!token) return res.status(401).send({message : "No user session"});

        res.cookie('access_token', token, { 
          httpOnly: true, 
          secure: true,
          sameSite: 'strict', 
          expires: new Date(0)
        });

        res.status(200).send({ message: 'Logged out successfully' });

}

module.exports.AddToCart = (req,res) => {
    const q = '';
}
