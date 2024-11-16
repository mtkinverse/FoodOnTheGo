const db = require('../db');

module.exports.getTopRestaurants = (req, res) => {
    console.log("getHome endpoint hit");
    const q = 'SELECT * from restaurant where rating >= ? order by rating DESC';
     
  // greater than 4
    db.query(q, [4], (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Database query failed', details: err.message });
      }
      return res.status(200).json(data);
    });
  }