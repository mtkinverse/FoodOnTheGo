const db = require('../db');

module.exports.getHome = (req, res) => {
    console.log("getHome endpoint hit");
    const q = 'SELECT * from restaurants where rating >= ? order by rating DESC';
 
    db.query(q, [4], (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Database query failed', details: err.message });
      }
      return res.status(200).json(data);
    });
  }