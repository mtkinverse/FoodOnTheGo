const db = require('../db');
const jwt = require('jsonwebtoken');

module.exports.getOwnedRestaurants = (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }
    try {
        const decoded = jwt.verify(token, 'my_key'); 
        const owner_id = decoded.owner_id;

        const query = 'SELECT * from Restaurant WHERE Owner_id = ?';
        db.query(query, [owner_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database query failed', details: err.message });
            }
            if (result.length === 0) return res.status(400).json({ message: 'No restaurants owned' });
            return res.status(200).json({ ownedRestaurants: result });
        });
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports.AddRestaurant = (req,res) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }
    try {
        const decoded = jwt.verify(token, 'my_key'); 
        const owner_id = decoded.id;
        
        const {Restaurant_Name,OpensAt,ClosesAt,Restaurant_Image} = req.body;

        const query = 'INSERT INTO Restaurant (Restaurant_Name,OpensAt,ClosesAt,Restaurant_image,Owner_id) VALUES (?,?,?,?,?)';
        db.query(query, [Restaurant_Name,OpensAt,ClosesAt,Restaurant_Image,owner_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database query failed', details: err.message });
            }
            return res.status(200).json({ restaurantId : result.insertId });
        });
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports.addMenu = (req, res) => {
    const restaurant_id = req.params.id;

    const checkQuery = 'SELECT menu_id FROM restaurant WHERE restaurant_id = ?';

    db.query(checkQuery, [restaurant_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed', details: err.message });
        }
        
        if (results.length > 0 && results[0].menu_id) {
            return res.status(400).json({ message: 'Restaurant already has a menu assigned' });
        }

        const insertMenuQuery = 'INSERT INTO menu () VALUES ()'; 
        
        db.query(insertMenuQuery, (err, menuResult) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to create menu', details: err.message });
            }

            const menu_id = menuResult.insertId; 
            const updateRestaurantQuery = 'UPDATE restaurant SET menu_id = ? WHERE restaurant_id = ?';

            db.query(updateRestaurantQuery, [menu_id, restaurant_id], (err, updateResult) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update restaurant with new menu', details: err.message });
                }

                return res.status(200).json({ message: 'Menu created and assigned to restaurant successfully', menu_id });
            });
        });
    });
};

//insertId is used for auto increments ids

module.exports.addMenuItem = (req, res) => {
    const restaurant_id = req.params.id;
    
    const menu_query = 'SELECT menu_id FROM restaurant WHERE restaurant_id = ?';

    db.query(menu_query, [restaurant_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed', details: err.message });
        }
        console.log(results);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Restaurant not found or no menu associated with this restaurant' });
        }

        const menu_id = results[0].menu_id;

        const insert_query = 'INSERT INTO menu_items (Dish_Name, Item_Price, Item_image, Cuisine, Menu_id) VALUES (?, ?, ?, ?, ?)';
        const { Dish_Name, Item_Price, Item_image, Cuisine } = req.body;

        db.query(insert_query, [Dish_Name, Item_Price, Item_image, Cuisine, menu_id], (err, menuResult) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to add menu item', details: err.message });
            }
            return res.status(201).json({ message: 'Menu item added successfully', item_id: menuResult.insertId });
        });
    });
};
