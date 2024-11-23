
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
        
        const qInsert = "INSERT INTO Delivery_Rider (Rider_name,Email_address,Account_Password,Phone_no) VALUES (?, ?, ?, ?)";
        const values = [req.body.name,req.body.email, hash,req.body.phoneNo];
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
    console.log(req.body);
    const role = req.body.role;
    console.log(req.body.role);
    const q = `SELECT * FROM ${role} WHERE Email_address = ?`;

    db.query(q, [req.body.email], (err, data) => {
        if (err) return res.status(500).json(err);

        if (data.length == 0) {
            // Return an error for invalid email
            console.log("email error set");
            return res.status(400).json({
                errors: { email: "Invalid email address",password : "" }
            });
        }
         
        const user = data[0];
        const isPasswordValid = bcrypt.compareSync(req.body.password, user.Account_Password);
        
        if (!isPasswordValid) {
            // Return an error for invalid password
            console.log("password error set");
            return res.status(401).json({
                errors: { email: "" ,password: "Incorrect password" }
            });
        }

        const { Account_Password, ...other } = user;
        console.log(other);

        const token = jwt.sign(
            { id: role === 'Customer' ? user.Customer_id : role == 'Restaurant_owner' ? user.Owner_id : role == 'Restaurant_Admin' ? user.Admin_id : user.Rider_id }, 
            "my_key", 
            { expiresIn: 600 }
        );

        res.status(200).cookie("access_token", token, {
            httpOnly: true
        }).json({
            ...other,
            role: role
        });
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



module.exports.getMenu = (req, res) => {
    console.log('menu hit');
    const restaurant_id = req.params.id;
    const menu_query = 'SELECT menu_id FROM restaurant WHERE restaurant_id = ?';

    db.query(menu_query, [restaurant_id], (err, result) => {
        if (err) {
            return res.status(400).json({ message: 'Database query failed' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const menu_id = result[0].menu_id;

        const items_query = 'SELECT * FROM menu_items WHERE menu_id = ?';

        db.query(items_query, [menu_id], (err, items) => {
            if (err) {
                return res.status(400).json({ message: 'Failed to fetch menu items' });
            }
           console.log('sending items',items);
            return res.status(200).json(items);
        });
    });
};


module.exports.updateAccount = (req,res) => {
    const {User_id,User_name,Email_address,phone_no,role} = req.body.userData;
    console.log(req.body.userData);
    let new_password = req.body.password;
    console.log('update account hitt');
    let hash ;
    if(new_password !== ""){
        const salt = bcrypt.genSaltSync(10);
        hash = bcrypt.hashSync(new_password, salt);
        new_password = hash;
    }
    let query ;
    switch (role) {
        case 'Customer':
            if(new_password !== "")
            query = 'UPDATE Customer SET Customer_name = ?,Email_Address = ?, Account_Password = ? ,Phone_No = ? where Customer_id = ?';
            else  query = 'UPDATE Customer SET Customer_name = ?,Email_Address = ? ,Phone_No = ? where Customer_id = ?';
            break;
        case 'Restaurant_Owner':
            if(new_password !== "")
            query = 'UPDATE Restaurant_Owner SET Owner_name = ?,Email_Address = ?, Account_Password = ? ,Phone_No = ? where Owner_id = ?';
            else query = 'UPDATE Restaurant_Owner SET Owner_name = ?,Email_Address = ? ,Phone_No = ? where Owner_id = ?';
            break;
        case 'Delivery_Rider':
            if(new_password !== "")
            query = 'UPDATE Delivery_rider SET Rider_name = ?, Email_Address = ?, Account_Password = ? ,Phone_No = ? where Rider_id = ?';
            else query = 'UPDATE Delivery_rider SET Rider_name = ?, Email_Address = ? ,Phone_No = ? where Rider_id = ?';
            break;
    }
  
    if(new_password !== ""){
    db.query(query, [User_name,Email_address,new_password,phone_no,User_id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("Error executing DB query");
    
        return res.status(200).json('Owner account updated');
    });
  }
  else {
    db.query(query, [User_name,Email_address,phone_no,User_id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("Error executing DB query");
    
        return res.status(200).json('Owner account updated');
    });
  }
   
}