const db = require('../db');
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



// module.exports.addMenuItem = (req,res) => {
//     menu_id = req.body.restaurant_id;
//     const q = "INSERT INTO menu_items VALUES (?) "
// }