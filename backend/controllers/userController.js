
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const phoneNumberPattern = /^\+92 \d{3} \d{7}$/;
// const isValidPhoneNumber = (phone) => phoneNumberPattern.test(phone);

module.exports.deleteAccount = (req, res) => {
    const user_id = req.params.id;
    const { role } = req.body;

    if (!['Customer', 'Delivery_Rider'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role provided' });
    }
   
    let q;
    switch (role) {
        case 'Customer':
            q = 'DELETE FROM Customer WHERE customer_id = ?';
            break;
        case 'Delivery_Rider':
            q = 'DELETE FROM Delivery_rider WHERE rider_id = ?';
            break;
        default:
            return res.status(400).json({ message: 'Role not supported' });
    }

    db.query(q, [user_id], (err, result) => {
        if (err) {
            console.error('Error deleting account:', err); 
            return res.status(500).json({ message: 'Error deleting account' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Account not found' });
        }
        
        return res.status(200).json({ message: 'Account deleted successfully' });
    });
};

function registerCustomer(req,res) {
    
    const q = 'SELECT * FROM Customer WHERE email_address = ? or phone_no = ?';

    db.query(q, [req.body.email,req.body.phoneNo], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("Customer account with this email or phone number already exists");
        
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        
        const qInsert = "INSERT INTO Customer (Customer_name,Email_address,Account_Password,Phone_no) VALUES (?, ?, ?, ?)";
        const values = [req.body.name,req.body.email, hash,req.body.phoneNo];
        
        db.query(qInsert, values, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json('Customer created');
        });
    });
}


function registerOwner(req,res) {
    
    const q = 'SELECT * FROM Restaurant_Owner WHERE email_address = ? or phone_no = ?';

    db.query(q, [req.body.email,req.body.phoneNo], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("Owner account with this email or phone number already exists");
        
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        
        const qInsert = "INSERT INTO Restaurant_Owner (Owner_name,Email_address,Account_Password,Phone_no) VALUES (?, ?, ?, ?)";
        const values = [req.body.name,req.body.email, hash,req.body.phoneNo];
        
        db.query(qInsert, values, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json('Owner created');
        });
    });
}


function registerRider(req,res) {
    
    const q = 'SELECT * FROM Delivery_Rider WHERE email_address = ? or phone_no = ?';

    db.query(q, [req.body.email,req.body.phoneNo], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("Rider account with this email or phone number already exists");
        
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        
        const qInsert = "INSERT INTO Delivery_Rider (Rider_name,Email_address,Account_Password,Phone_no) VALUES (?, ?, ?, ?)";
        const values = [req.body.name,req.body.email, hash,req.body.phoneNo];
        
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
                if (err) return res.status(500).json({ message: err.message });
                return res.status(200).json({ message: 'Customer registered successfully' });
            });
            break;
        case 'Restaurant_Owner':
            registerOwner(req, res, (err) => {
                if (err) return res.status(500).json({ message: err.message });
                return res.status(200).json({ message: 'Owner registered successfully' });
            });
            break;
        case 'Delivery_Rider':
            registerRider(req, res, (err) => {
                if (err) return res.status(500).json({ message: err.message });
                return res.status(200).json({ message: 'Rider registered successfully' });
            });
            break;
    }
};

module.exports.loginUser = (req, res) => {
    
    
    const role = req.body.role;
    const q = `SELECT * FROM ${role} WHERE Email_address = ?`;

    db.query(q, [req.body.email], (err, data) => {
        if (err) return res.status(500).json(err);

        if (data.length == 0) {
            // Return an error for invalid email
            
            return res.status(400).json({message : 'Invalid email address'});
        }
         
        const user = data[0];
        const isPasswordValid = bcrypt.compareSync(req.body.password, user.Account_Password);
        
        if (!isPasswordValid) {
            // Return an error for invalid password
            
            return res.status(400).json({message : 'Incorrect Password,Try again'});
        }

        const { Account_Password, ...other } = user;
        

        const token = jwt.sign(
            { id: role === 'Customer' ? user.Customer_id : role == 'Restaurant_Owner' ? user.Owner_id : role == 'Restaurant_Admin' ? user.Admin_id : user.Rider_id }, 
             process.env.JWT_SECRET, 
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

        res.cookie('access_token',{ 
          httpOnly: true, 
          secure: true,
          sameSite: 'strict', 
          expires: new Date(0)
        });

        res.status(200).send({ message: 'Logged out successfully' });

}


module.exports.getMenu = (req, res) => {
    
    const restaurant_id = req.params.id;

    // Query to fetch the menu_id for the given restaurant
    const menu_query = 'SELECT menu_id FROM restaurant WHERE restaurant_id = ?';

    db.query(menu_query, [restaurant_id], (err, result) => {
        if (err) {
            console.error('Error fetching menu ID:', err.message);
            return res.status(400).json({ message: 'Database query failed' });
        }

        if (result.length === 0) {
            console.warn('No restaurant found for ID:', restaurant_id);
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const menu_id = result[0].menu_id;

        const discount_query = `
            SELECT discount_value 
            FROM discount 
            WHERE restaurant_id = ? 
            AND start_date <= CURRENT_DATE  AND end_date >= CURRENT_TIMESTAMP
        `;

        db.query(discount_query, [restaurant_id], (err2, discountResult) => {
            if (err2) {
                console.error('Error fetching discount:', err2.message);
                return res.status(400).json({ message: 'Failed to fetch discount information' });
            }

            const discount_value = discountResult.length > 0 ? discountResult[0].discount_value : 0;
            

            const items_query = 'SELECT * FROM menu_items WHERE menu_id = ?';

            db.query(items_query, [menu_id], (err3, items) => {
                if (err3) {
                    console.error('Error fetching menu items:', err3.message);
                    return res.status(400).json({ message: 'Failed to fetch menu items' });
                }

                const itemsWithDiscount = items.map(item => {
                    const discounted_price = discount_value > 0
                        ? (item.Item_Price * (1 - discount_value / 100)).toFixed(2)
                        : item.Item_Price;
                    
                    return {
                        ...item,
                        discounted_price: parseFloat(discounted_price),
                    };
                });

                
                return res.status(200).json(itemsWithDiscount);
            });
        });
    });
};


module.exports.updateAccount = (req,res) => {
    const {User_id,User_name,Email_address,phone_no,role} = req.body.userData;
    
    let new_password = req.body.password;
    
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