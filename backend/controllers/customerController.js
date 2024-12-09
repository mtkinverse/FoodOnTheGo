const db = require('../db');
const axios = require('axios');
const { sendOrderNotification, sendCancellationEmail, sendStatusEmail } = require('../services/emailService');



module.exports.notifyDispatch = (req, res) => {
    sendStatusEmail(req.body.customer_email,req.body.rider_email, req.body);
    return res.status(200).json({ message: 'email sent' });
}

module.exports.orderAgain = (req, res) => {
    const customer_id = req.params.id;

    const q = `
      SELECT r.*, loc.*, d.discount_value
      FROM restaurant r
      JOIN locations loc ON r.location_id = loc.location_id
      LEFT JOIN Discount d ON d.restaurant_id = r.restaurant_id  AND d.start_date <= CURRENT_TIMESTAMP AND d.end_date >= CURRENT_TIMESTAMP
      JOIN (
        SELECT DISTINCT restaurant_id
        FROM Orders
        WHERE customer_id = ?
      ) o ON o.restaurant_id = r.restaurant_id;
    `;

    db.query(q, [customer_id], (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed', details: err.message });
        }

        const restaurantsWithReviewCount = [];

        if (!data.length) {
            return res.status(200).json(restaurantsWithReviewCount); // Return empty array if no results
        }

        let processedCount = 0;

        data.forEach((restaurant) => {
            const reviewCountQuery = `
              SELECT COUNT(*) AS review_count
              FROM orders
              WHERE restaurant_id = ? AND review_id IS NOT NULL
            `;

            db.query(reviewCountQuery, [restaurant.Restaurant_id], (err, reviewData) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to fetch review count', details: err.message });
                }

                restaurant.review_count = reviewData[0]?.review_count || 0; // Add review_count to restaurant
                restaurantsWithReviewCount.push(restaurant);
                processedCount++;

                if (processedCount === data.length) {
                    // Send response when all restaurants have been processed
                    return res.status(200).json(restaurantsWithReviewCount);
                }
            });
        });
    });
};


module.exports.verifyPromo = (req, res) => {
    const menu_id = req.params.id;
    const promo_code = req.query.promo_code;
    const user_id = req.query.user_id;

    const q = 'SELECT restaurant_id FROM restaurant WHERE menu_id = ?';

    db.query(q, [menu_id], (err, result) => {
        if (err) {
            console.log('Error here --- err:', err.message);
            return res.status(500).json({ message: err.message });
        }

        if (!result || result.length === 0) {
            return res.status(404).json({ message: 'Restaurant not found for this menu' });
        }

        const restaurant_id = result[0].restaurant_id;
        const qq = `
            SELECT * 
            FROM promos 
            WHERE promo_code = ? 
              AND restaurant_id = ? 
              AND end_date >= CURRENT_DATE
              AND start_date <= CURRENT_DATE

        `;
        db.query(qq, [promo_code, restaurant_id], (err1, result1) => {
            if (err1) {
                console.log('Error 1:', err1.message);
                return res.status(500).json({ message: err1.message });
            }
            if (!result1 || result1.length === 0) {
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

                if (num_orders >= usage_limit) {
                    return res.status(403).json({ message: 'You have used the promo maximum number of times' });
                }

                // Return promo details if all checks pass
                return res.status(200).json(result1[0]);
            });
        });
    });
};


module.exports.getPromos = (req, res) => {
    const restaurant_id = req.params.id;
    const q = 'SELECT * from promos where restaurant_id = ? and start_date <= CURRENT_DATE and end_date >= CURRENT_DATE ';

    db.query(q, [restaurant_id, 'active'], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'No promos found' });
        }
        return res.status(200).json(result);
    })
}

module.exports.reviewOrder = (req, res) => {

    const order_id = req.params.id;
    const { rating, description } = req.body;
    const q = 'INSERT INTO order_review (rating,Review_Description) VALUES(?,?)';

    db.beginTransaction(() => {

        db.query(q, [rating, description], (err, result) => {
            if (err) {
                console.log(err.message);
                db.rollback();
                return res.status(400).json({ error: err.message });
            }
            //set order review here;
            const qq = 'UPDATE orders set review_id = ? where order_id = ?';
            db.query(qq, [result.insertId, order_id], (err1, result1) => {
                if (err1) {
                    console.log('err1', err1.message);
                    db.rollback();
                    return res.status(400).json({ error: err1.message });
                }
                db.commit();
                res.status(200).json({ review_id: result1.insertId });
            })
        });

    })



}

module.exports.getLastOrder = (req, res) => {

    const customer_id = req.params.id;
    const q = ` 
       SELECT o.order_id,r.restaurant_name,r.restaurant_id,o.review_id
       from orders o join customer c on o.customer_id = c.customer_id
       join restaurant r on o.restaurant_id = r.restaurant_id
       where c.customer_id = ? and o.Review_id IS NULL
       order by o.order_time
       LIMIT 1;
    `;

    db.query(q, [customer_id], (err, result) => {
        if (err) {
            console.log('error fetching recent order');
            return res.status(500).json({ error: err.message });
        }
        return res.status(200).json(result);
    })
}

module.exports.PlaceOrder = (req, res) => {
    const { Customer_id, Customer_name,phone_no, Email, Menu_Id, Address, NearbyPoint,Instructions, items, total_amount, promo_id, riderTip } = req.body;
    console.log('here to place order,',req.body);       
    const q1 = 'SELECT Restaurant_id FROM restaurant WHERE menu_id = ?';
            db.beginTransaction(() => {

                db.query(q1, [Menu_Id], (err, restaurantResult) => {
                    if (err) {
                        console.error('Database query error:', err);
                        return res.status(500).json({ message: 'Database query error' });
                    }

                    if (restaurantResult.length === 0) {
                        return res.status(404).json({ message: 'Menu not found' });
                    }

                    const Restaurant_id = restaurantResult[0].Restaurant_id;
                    
                                         
                  //  const createOrderQuery = 'CALL PLACEORDER (?, ?, ?, ?, @Created_Order_id)';
                    const addressQuery = 'INSERT into deliveryaddress (address,phoneno,NearbyPoint) VALUES(?,?,?)';
                    db.query(addressQuery, [Address,phone_no,NearbyPoint], (err, addressResult) => {
                        if (err) {
                            console.error('Error while adding address order:', err);
                            return res.status(500).json({ message: 'Error while placing order' });
                        }
                        const status = 'Placed';
                        const order_q = 'INSERT INTO Orders (customer_id,order_time,order_status,Instructions,restaurant_id,address_id,promo_id) VALUES(?,?,?,?,?,?,?)';
                        db.query(order_q,[Customer_id,new Date(),status,Instructions,Restaurant_id,addressResult.insertId,promo_id], (err, orderStatus) => {
                            if (err) {
                                console.error('Error inserting order ID:', err);
                                return res.status(500).json({ message: 'Error fetching order ID' });
                            }
                            const Order_id = orderStatus.insertId;
                            if (!Order_id) {
                                return res.status(400).json({ message: 'Failed to create order. Restaurant may be closed.' });
                            }

                            const itemInsertQuery = 'INSERT INTO ordered_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)';
                            items.forEach((item, index) => {
                                const priceToUse = item.discounted_price && item.discounted_price < item.Item_Price
                                    ? item.discounted_price
                                    : item.Item_Price;
                                item.Item_Price = priceToUse;
                                db.query(itemInsertQuery, [Order_id, item.Item_id, item.quantity, priceToUse], (err) => {
                                    if (err) {
                                        console.error('Error inserting item into ordered_items:', err);
                                        return res.status(500).json({ message: 'Error inserting item into order' });
                                    }

                                    if (index === items.length - 1) {
                                        const updateOrderQuery = 'UPDATE orders SET promo_id = ?, total_amount = ?, rider_tip = ? WHERE order_id = ?';
                                        db.query(updateOrderQuery, [promo_id, total_amount, riderTip, Order_id], (err) => {
                                            if (err) {
                                                console.error('Error updating order:', err);
                                                return res.status(500).json({ message: 'Error updating order' });
                                            }
                                            const order = {
                                                customerName: Customer_name,
                                                id: Order_id,
                                                date: new Date().toLocaleString(),
                                                items: items,
                                                totalAmount: total_amount,
                                                deliveryAddress: Address,
                                                riderTip: riderTip

                                            }
                                         //   sendOrderNotification(Email, order)
                                         db.commit();
                                            return res.status(200).json({ success: true, message: 'Order placed successfully' });
                                        });
                                    }
                                });
                            });
                        });
                    });
                });

            })
       


};



module.exports.cancelOrder = (req, res) => {
    const order_id = req.params.id;
    const { Email, Name } = req.body;
    const q = 'DELETE FROM Orders where Order_id = ? ';

    db.query(q, [order_id], (err, result) => {
        if (err) {
            console.log("error cancelling order");
            res.status(400).json({ error: "error cancelling the order" });
        }
        const order = {
            customerName: Name,
            id: order_id
        }
       // sendCancellationEmail(Email, order)
        res.status(200).json({ message: "Order cancelled" });
    });
}
module.exports.getAllOrders = (req, res) => {
    const Customer_id = req.params.id;
    const q = `
 SELECT 
        o.order_id,
        o.order_status,
        d.address,
        o.restaurant_id,
        r.restaurant_name,
        o.customer_id,
        o.review_id,
        DATE(o.order_time) AS order_date, 
        o.total_amount,
        TIME(o.order_time) AS order_time,
        i.dish_name,  -- Dish name from menu_items
        oo.item_id,
        oo.quantity,
        oo.price,  -- Price from ordered_items
        oo.price * oo.quantity AS sub_total
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
                        restaurant_id : curr.restaurant_id,
                        restaurant_name: curr.restaurant_name,
                        total_amount: curr.total_amount,
                        review_id: curr.review_id,
                        items: []
                    };
                }

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

        res.status(200).json(groupedOrders.reverse());
    });
};

module.exports.LodgeComplaint = (req,res) => {
    const {Customer_id,Order_id,Complaint_Desc} = req.body;
    
    if(Complaint_Desc.length >= 200){
        res.status(200).json({message : 'Please be precised within 200 words'});
        return;
    }

    const q = 'SELECT Restaurant_id FROM Orders WHERE Order_id = ?';
    db.query(q,[Order_id], (err,result) => {

        if(err){
            res.status(400).json({message : 'invalid order id'});
        }else{
            const Restaurant_id = result[0].Restaurant_id;
            const q1 = 'INSERT INTO Complaints (Restaurant_id,Customer_id,Order_id,Complaint_Desc, Status) VALUES (?,?,?,?,\'Lodged\')';

            db.query(q1,[Restaurant_id,Customer_id,Order_id,Complaint_Desc], (err1,result1) => {
                if(err1){
                    console.log('err1 ',err1.message);
                    res.status(400).json({message : 'Cannot Lodge complaint'});
                }
                else{
                    res.status(200).json({message : 'Comlpaint lodge'});
                }
            })

            
        }

    })

}
