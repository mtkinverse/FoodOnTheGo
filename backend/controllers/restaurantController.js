const db = require('../db');

module.exports.getRestaurants = (req, res) => {
  const q = `
   SELECT * 
   FROM restaurant r
   JOIN locations loc ON r.location_id = loc.location_id
   LEFT JOIN Discount d ON d.restaurant_id = r.restaurant_id AND d.end_date > CURRENT_TIMESTAMP;
`;

db.query(q,[], (err, data) => {
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
        console.log(restaurantsWithReviewCount);
        return res.status(200).json(restaurantsWithReviewCount);
      }
    });
  });
});
};


module.exports.getSpecificRestaurant = (req, res) => {
  const restaurantId = req.params.id;
  console.log(`Fetching details for restaurant with ID: ${restaurantId}`);

  const query = `
    SELECT 
        r.*, 
        l.*, 
        d.*, 
        (SELECT COUNT(o.review_id) 
         FROM orders o 
         WHERE o.restaurant_id = r.Restaurant_id 
         AND o.review_id IS NOT NULL) AS review_count 
    FROM restaurant r
    JOIN locations l ON r.location_id = l.location_id
    LEFT JOIN Discount d ON d.restaurant_id = r.restaurant_id AND d.end_date > CURRENT_TIMESTAMP
    WHERE r.Restaurant_id = ?;
`;



  db.query(query, [restaurantId], (err, data) => {
      if (err) {
          console.error(`Database query failed: ${err.message}`);
          return res.status(500).json({ error: 'Database query failed', details: err.message });
      }

      if (data.length === 0) {
          console.log(`No restaurant found with ID: ${restaurantId}`);
          return res.status(404).json({ message: 'Restaurant not found' });
      }

      console.log(`Fetched details:`, data[0]);
      return res.status(200).json(data[0]);
  });
};

module.exports.getRestaurantMenu = (req, res) => {
    const restaurantId = req.params.id;  

    const query = 'SELECT menu_id FROM restaurant WHERE restaurant_id = ?';
    db.query(query, [restaurantId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed', details: err.message });
        }
        if (data.length === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const menu_id = data[0].menu_id;
        const restaurantName = data[0].Restaurant_Name;
        const items_query = 'SELECT * FROM menu_items WHERE menu_id = ?';
        db.query(items_query, [menu_id], (err, items) => {
            if (err) {
                return res.status(500).json({ error: 'Database query failed', details: err.message });
            }
            if (items.length === 0) {
                return res.status(404).json({ message: 'No menu items found' });
            }

            return res.status(200).json({ menuItems: items });
        });
    });
};


