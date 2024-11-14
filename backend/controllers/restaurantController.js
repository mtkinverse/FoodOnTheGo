const db = require('../db');

module.exports.getRestaurants = (req, res) => {
    console.log("get Restaurants endpoint hit");
    
    // const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });

    const query = 'SELECT * FROM restaurant';

    db.query(query, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed', details: err.message });
        }
        console.log(data);
        return res.status(200).json(data);
    });
};


module.exports.getSpecificRestaurant = (req, res) => {
    const restaurantId = req.params.id;  
    console.log(`Fetching details for restaurant with ID: ${restaurantId}`);

    const query = 'SELECT * FROM restaurant WHERE Restaurant_id = ?';
    db.query(query, [restaurantId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed', details: err.message });
        }      
        if (data.length === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        return res.status(200).json(data[0]);  
    });
};
