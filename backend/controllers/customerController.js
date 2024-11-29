const db = require('../db');

module.exports.verifyPromo = (req, res) => {
    console.log('Verify promo hit');
    const menu_id = req.params.id;
    const promo_code = req.query.promo_code;
    const user_id = req.query.user_id;

    const q = 'SELECT restaurant_id FROM restaurant WHERE menu_id = ?';
    console.log(menu_id, promo_code, user_id);

    db.query(q, [menu_id], (err, result) => {
        if (err) {
            console.log('Error here --- err:', err.message);
            return res.status(500).json({ message: err.message });
        }

        if (!result || result.length === 0) {
            console.log('Error: restaurant not found');
            return res.status(404).json({ message: 'Restaurant not found for this menu' });
        }

        const restaurant_id = result[0].restaurant_id;
        const qq = `
            SELECT * 
            FROM promos 
            WHERE promo_code = ? 
              AND restaurant_id = ? 
              AND end_date >= CURRENT_TIMESTAMP
        `;
        db.query(qq, [promo_code, restaurant_id], (err1, result1) => {
            if (err1) {
                console.log('Error 1:', err1.message);
                return res.status(500).json({ message: err1.message });
            }
            if (!result1 || result1.length === 0) {
                console.log('Promo not found or expired');
                return res.status(404).json({ message: 'Promo code not found or expired' });
            }

            const promo_id = result1[0].promo_id;
            const usage_limit = result1[0].usage_limit;
            const qqq = `
                SELECT count(order_id) as num_orders 
                FROM orders 
                WHERE customer_id = ? 
                  AND promo_id = ?
            `;
            db.query(qqq, [user_id, promo_id], (err2, result2) => {
                if (err2) {
                    console.log('Error 2:', err2.message);
                    return res.status(500).json({ message: err2.message });
                }

                // Ensure `result2` is valid and has the expected structure
                const num_orders = result2[0]?.num_orders || 0;

                console.log('Number of orders:', num_orders);
                if (num_orders >= usage_limit) {
                    console.log('Usage limit reached');
                    return res.status(403).json({ message: 'You have used the promo maximum number of times' });
                }

                console.log('Sending promo back:', result1[0]);
                // Return promo details if all checks pass
                return res.status(200).json(result1[0]);
            });
        });
    });
};


module.exports.getPromos = (req,res) => {
    const restaurant_id = req.params.id;
    const q = 'SELECT * from promos where restaurant_id = ? and start_date <= CURRENT_TIMESTAMP and end_date >= CURRENT_TIMESTAMP ';

    db.query(q,[restaurant_id,'active'],(err,result) => {
        if(err){
            return res.status(500).json({message : 'No promos found'});
        }
        console.log(result);
        return res.status(200).json(result);
    })
}

module.exports.reviewOrder = (req,res) => {
    console.log('i am here to review order');
   const order_id = req.params.id;
   const {rating,description} = req.body;
   const q = 'INSERT INTO order_review (rating,Review_Description) VALUES(?,?)';

   db.query(q,[rating,description],(err,result) => {
      if(err){
        console.log(err.message);
        return res.status(400).json({error : err.message});
      }
      //set order review here;
      const qq = 'UPDATE orders set review_id = ? where order_id = ?';
      db.query(qq,[result.insertId,order_id],(err1,result1) => {
        if(err1){
            console.log('err1',err1.message);
            return res.status(400).json({error : err1.message});
        }
        res.status(200).json({message : 'Order rated successfully'});
      })
   });

}

module.exports.getLastOrder  = (req,res) =>{
     
    const customer_id = req.params.id;
    console.log('HEre to fetch last order : ',customer_id);
    const q = ` 
       SELECT o.order_id,r.restaurant_name,r.restaurant_id,o.review_id
       from orders o join customer c on o.customer_id = c.customer_id
       join restaurant r on o.restaurant_id = r.restaurant_id
       where c.customer_id = ? and o.Review_id IS NULL
       order by o.order_time
       LIMIT 1;
    `;

    db.query(q,[customer_id],(err,result) =>{
        if (err) {
            console.log('error fetching recent order');
            return res.status(500).json({ error : err.message });
        }
        console.log(result);
        return res.status(200).json(result);
    })
}
module.exports.PlaceOrder = async (req, res) => {
    console.log('Received order request:', req.body);

    const { Customer_id, Menu_Id, Address, NearbyPoint, items, total_amount, promo_id } = req.body;
    try {
        const q1 = 'SELECT Restaurant_id FROM restaurant WHERE menu_id = ?';
        const [restaurantResult] = await db.promise().query(q1, [Menu_Id]);

        if (restaurantResult.length === 0) {
            return res.status(404).json({ message: 'Menu not found' });
        }

        const Restaurant_id = restaurantResult[0].Restaurant_id;
        console.log('Found Restaurant_id:', Restaurant_id);

        const createOrderQuery = 'CALL PLACEORDER (?, ?, ?, ?, @Created_Order_id)';
        await db.promise().query(createOrderQuery, [Customer_id, Restaurant_id, Address, NearbyPoint]);

        const [orderResult] = await db.promise().query('SELECT @Created_Order_id AS orderId');
        const Order_id = orderResult[0].orderId;
        console.log('Created Order ID:', Order_id);

        const itemInsertQuery = 'INSERT INTO ordered_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)';
        for (const item of items) {
            const priceToUse = item.discounted_price && item.discounted_price < item.Item_Price
                ? item.discounted_price
                : item.Item_Price; 
                console.log('adding item to orderd_items ',item.Item_id,item.quantity,priceToUse);
            await db.promise().query(itemInsertQuery, [Order_id, item.Item_id, item.quantity, priceToUse]);
        }

        const updateOrderQuery = 'UPDATE orders SET promo_id = ?, total_amount = ? WHERE order_id = ?';
        console.log('Updating order ', Order_id, promo_id, total_amount);
        await db.promise().query(updateOrderQuery, [promo_id, total_amount, Order_id]);

        return res.status(200).json({ success: true, message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error while placing order:', error);
        return res.status(500).json({ error: 'An error occurred while placing the order', details: error.message });
    }
};




module.exports.cancelOrder = (req, res) => {
    const order_id = req.params.id;
    console.log('Delete order hit');
    const q  = 'DELETE FROM Orders where Order_id = ? ';

    db.query(q,[order_id],(err,result) => {
        if(err){
            console.log("error cancelling order");
            res.status(400).json({error: "error cancelling the order"});
        }
       
        res.status(200).json({message : "Order cancelled"});
    });
}
module.exports.getAllOrders = (req, res) => {
    const Customer_id = req.params.id;
    console.log('get orders hit ', Customer_id);

    const q = `
 SELECT 
        o.order_id,
        o.order_status,
        d.address,
        r.restaurant_name,
        o.customer_id,
        DATE(o.order_time) AS order_date, 
        o.total_amount,
        TIME(o.order_time) AS order_time,
        i.dish_name,  -- Dish name from menu_items
        oo.item_id,
        oo.quantity,
        oo.price,  -- Price from ordered_items
        oo.price * oo.quantity AS sub_total -- Calculate sub_total using item_price from ordered_items
      FROM orders o 
      JOIN deliveryaddress d ON o.address_id = d.address_id
      JOIN restaurant r ON o.restaurant_id = r.restaurant_id
      JOIN ordered_items oo ON o.order_id = oo.order_id        
      JOIN menu_items i ON oo.item_id = i.item_id  -- Join with menu_items to get dish_name
      WHERE o.customer_id = ?
      ORDER BY order_date DESC;

    `;

    db.query(q, [Customer_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed', details: err.message });
        }

        const groupedOrders = Object.values(
            results.reduce((acc, curr) => {
                if (!acc[curr.order_id]) {
                    acc[curr.order_id] = {
                        order_id: curr.order_id,
                        address: curr.address,
                        status: curr.order_status,
                        order_date: curr.order_date,
                        order_time: curr.order_time,
                        customer_id: curr.customer_id,
                        restaurant_name: curr.restaurant_name,
                        total_amount: curr.total_amount,
                        items: []
                    };
                }

                // Add the item to the order using item_price from ordered_items
                acc[curr.order_id].items.push({
                    item_id: curr.item_id,
                    dish_name: curr.dish_name,  // Dish name from menu_items
                    quantity: curr.quantity,
                    item_price: curr.item_price,  // Price from ordered_items
                    sub_total: curr.sub_total  // Calculated sub_total
                });

                return acc;
            }, {})
        );

        console.log(groupedOrders);
        res.status(200).json(groupedOrders);
    });
};
