const db = require('../db');

module.exports.getWeeklyRevenue = (req,res) => {
   const r_id = req.params.id;
   const q = `
      SELECT 
    r.restaurant_id, 
    r.restaurant_name, 
    WEEK(o.order_time, 1) AS week, -- Use ISO-compliant week calculation
    SUM(o.total_amount) AS total_revenue 
FROM orders o 
JOIN restaurant r 
ON o.restaurant_id = r.restaurant_id
WHERE YEAR(o.order_time) = YEAR(CURRENT_DATE)  
AND MONTH(o.order_time) = MONTH(CURRENT_DATE)  
AND r.restaurant_id = ?
GROUP BY r.restaurant_id, r.restaurant_name, WEEK(o.order_time, 1)
ORDER BY week ASC;
   `
   db.query(q,[r_id],(err,result) => {
        if(err){
          return res.status(500).json({message: 'error fetching weekly revenue'});
        }
        console.log(result);
        return res.status(200).json(result);
   })
}

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
   FROM restaurant r
   JOIN locations loc ON r.location_id = loc.location_id
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
        FROM orders o
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
    FROM restaurant r
    JOIN locations l ON r.location_id = l.location_id
    LEFT JOIN Discount d ON d.restaurant_id = r.restaurant_id AND d.start_date <= CURRENT_TIMESTAMP AND d.end_date >= CURRENT_TIMESTAMP
    WHERE r.Restaurant_id = ? ;
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

module.exports.getPopularItems = (req, res) => {
  const restaurantId = req.params.id;
  console.log('here to get popular items');
  // First query: Get popular items
  const popularItemsQuery = `
     select oo.item_id
     from ordered_items oo
     join orders o on oo.order_id = o.order_id
     where restaurant_id = ?
     group by oo.item_id
     having count(oo.order_id) > 0
     order by count(oo.order_id)
     LIMIT 3;
  `;
  
  db.query(popularItemsQuery, [restaurantId], (err, result) => {
      if (err) {
          return res.status(500).json({ message: 'Error occurred while fetching popular items' });
      }

      const itemIds = result.map(row => row.item_id);
      console.log(itemIds);
      if (itemIds.length === 0) {
          return res.status(404).json({ message: 'No popular items found for this restaurant' });
      }
      console.log('popular items' ,itemIds);
      const menuItemsQuery = 'SELECT * FROM menu_items WHERE item_id IN (?)';
      db.query(menuItemsQuery, [itemIds], (err1, menuItems) => {
          if (err1) {
              return res.status(500).json({ message: 'Error occurred while fetching menu items' });
          }

          const discountQuery = `
              SELECT discount_value
              FROM discount
              WHERE restaurant_id = ?
              AND start_date <= CURRENT_DATE
              AND end_date >= CURRENT_TIMESTAMP
          `;

          db.query(discountQuery, [restaurantId], (err3, discounts) => {
              if (err3) {
                  return res.status(500).json({ message: 'Error occurred while fetching discount data' });
              }

              const itemsWithDiscount = menuItems.map(item => {
                  const discount = discounts.find(d => d.item_id === item.item_id);
                  const discount_value = discount ? discount.discount_value : 0;
                  const discounted_price = discount_value > 0
                      ? (item.Item_Price * (1 - discount_value / 100)).toFixed(2)
                      : item.Item_Price;

                  return {
                      ...item,
                      discounted_price: parseFloat(discounted_price),
                  };
              });
              console.log('returning result ',itemsWithDiscount);
              return res.status(200).json(itemsWithDiscount);
          });
      });
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


