const db = require('../db');
module.exports.getTopRestaurants = (req, res) => {
  

  const q = `
    SELECT * FROM Restaurant r 
    JOIN Locations loc ON r.location_id = loc.location_id
    LEFT JOIN Discount d ON d.restaurant_id = r.restaurant_id
    WHERE r.rating >= ? AND d.start_date <= CURRENT_TIMESTAMP AND d.end_date >= CURRENT_TIMESTAMP
    ORDER BY r.rating DESC
  `;

  db.query(q, [4], (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed', details: err.message });
    }

    const restaurantsWithReviewCount = [];

    let processedCount = 0;
    data.forEach((restaurant, index) => {
      const reviewCountQuery = `
        SELECT COUNT(o.review_id) AS review_count
        FROM orders o
        WHERE o.restaurant_id = ? AND o.review_id IS NOT NULL
      `;
      
      db.query(reviewCountQuery, [restaurant.restaurant_id], (err, reviewData) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch review count', details: err.message });
        }

        restaurant.review_count = reviewData[0]?.review_count || 0;
        restaurantsWithReviewCount.push(restaurant);
        processedCount++;
        if (processedCount === data.length) {
          return res.status(200).json(restaurantsWithReviewCount);
        }
      });
    });
  });
};
