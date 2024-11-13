const db = require('../db');

module.exports.getRestaurants = (req, res) => {
    console.log("get Restaurants endpoint hit");
    
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });

    const query = `
    SELECT * FROM restaurant
    WHERE 
      (OpensAt <= ? AND ClosesAt >= ?) 
      OR 
      (OpensAt > ClosesAt AND (? >= OpensAt OR ? <= ClosesAt))
    `;

    db.query(query, [currentTime, currentTime, currentTime, currentTime], (err, data) => {
        if (err) {
         return res.status(500).json({ error: 'Database query failed', details: err.message });
        }
        return res.status(200).json(data);
    });

};
