const db = require('../db');

module.exports.getReviews = (req,res) => {
    const restaurant_id = req.params.id;
    const q = `
         SELECT re.*,c.customer_name from order_review re
        join orders o on o.review_id = re.review_id
        join customer c on c.customer_id = o.customer_id
        join restaurant r on o.restaurant_id = r.restaurant_id
        where r.restaurant_id =  ?;
    `

    db.query(q,[restaurant_id],(err,result) => {
      if(err){
        return res.status(400).json({message : 'Error getting reviews'});
      }
      return res.status(200).json(result.reverse());
    })
}
module.exports.getRestaurants = (req, res) => {
  const q = `
   SELECT 
     r.*, 
     loc.*, 
     d.discount_value, 
     d.start_date AS discount_start_date,
     d.end_date AS discount_end_date
   FROM Restaurant r
   JOIN Locations loc ON r.location_id = loc.location_id
   LEFT JOIN Discount d ON d.restaurant_id = r.restaurant_id
     AND d.start_date <= CURRENT_TIMESTAMP 
     AND d.end_date >= CURRENT_TIMESTAMP;
  `;

  db.query(q, [], (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed', details: err.message });
    }

    const restaurantsWithReviewCount = [];
    let processedCount = 0;

    data.forEach((restaurant, index) => {
      const reviewCountQuery = `
        SELECT COUNT(o.review_id) AS review_count
        FROM Orders o
        WHERE o.restaurant_id = ? AND o.review_id IS NOT NULL
      `;

      db.query(reviewCountQuery, [restaurant.restaurant_id], (err, reviewData) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch review count', details: err.message });
        }

        // Attach the review count to the restaurant object
        restaurant.review_count = reviewData[0]?.review_count || 0;

        // Push the restaurant with its discount value and review count
        restaurantsWithReviewCount.push(restaurant);
        processedCount++;

        // When all restaurants are processed, return the response
        if (processedCount === data.length) {
          return res.status(200).json(restaurantsWithReviewCount);
        }
      });
    });
  });
};



module.exports.getSpecificRestaurant = (req, res) => {
  const restaurantId = req.params.id;

  const query = `
    SELECT 
        r.*, 
        l.*, 
        d.*, 
        (SELECT COUNT(o.review_id) 
         FROM orders o 
         WHERE o.restaurant_id = r.Restaurant_id 
         AND o.review_id IS NOT NULL) AS review_count 
    FROM Restaurant r
    JOIN Locations l ON r.location_id = l.location_id
    LEFT JOIN Discount d ON d.restaurant_id = r.restaurant_id
    WHERE r.Restaurant_id = ?  AND d.start_date <= CURRENT_TIMESTAMP AND d.end_date >= CURRENT_TIMESTAMP;
`;



  db.query(query, [restaurantId], (err, data) => {
      if (err) {
          console.error(`Database query failed: ${err.message}`);
          return res.status(500).json({ error: 'Database query failed', details: err.message });
      }

      if (data.length === 0) {
          return res.status(404).json({ message: 'Restaurant not found' });
      }

      return res.status(200).json(data[0]);
  });
};

module.exports.getRestaurantMenu = (req, res) => {
    const restaurantId = req.params.id;  

    const query = 'SELECT menu_id FROM Restaurant WHERE restaurant_id = ?';
    db.query(query, [restaurantId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed', details: err.message });
        }
        if (data.length === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const menu_id = data[0].menu_id;
        const restaurantName = data[0].Restaurant_Name;
        const items_query = 'SELECT * FROM Menu_items WHERE menu_id = ?';
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


