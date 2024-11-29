const db = require('../db');

module.exports.getDeals = (req, res) => {
    const location_id = req.params.id;

    const restaurantQuery = 'SELECT restaurant_id FROM restaurant WHERE location_id = ?';
    console.log('get deals hit',location_id);
    db.query(restaurantQuery, [location_id], (err, restaurantResult) => {
        if (err) {
            console.error("Error fetching restaurant:", err);
            return res.status(500).send("Internal Server Error");
        }

        if (restaurantResult.length === 0) {
            return res.status(404).send("No restaurant found for the given location.");
        }

        const restaurant_id = restaurantResult[0].restaurant_id;

        const promosQuery = 'SELECT * FROM promos WHERE restaurant_id = ? AND end_date >= CURRENT_TIMESTAMP';
        db.query(promosQuery, [restaurant_id], (err, promosResult) => {
            if (err) {
                console.error("Error fetching promos:", err);
                return res.status(500).send("Internal Server Error");
            }

            const discountsQuery = 'SELECT * FROM discount WHERE restaurant_id = ? AND end_date >= CURRENT_TIMESTAMP';
            db.query(discountsQuery, [restaurant_id], (err, discountsResult) => {
                if (err) {
                    console.error("Error fetching discounts:", err);
                    return res.status(500).send("Internal Server Error");
                }
                console.log(promosResult,discountsResult);
                res.json({
                    promos: promosResult,
                    discounts: discountsResult
                });
            });
        });
    });
};
module.exports.AddDiscount = (req, res) => {
    console.log('Here to add discount');
    const location_id = req.params.id;
    const { discount_value, start_date, end_date } = req.body;

    const queryRestaurant = 'SELECT restaurant_id FROM restaurant WHERE location_id = ?';
    db.query(queryRestaurant, [location_id], (err, result) => {
        if (err || result.length === 0) {
            const message = err ? 'Error fetching restaurant data' : 'No restaurant found for the given location ID';
            return res.status(404).json({ message });
        }

        const restaurant_id = result[0].restaurant_id;

        const queryActiveDiscount = `
            SELECT * FROM discount 
            WHERE restaurant_id = ? AND end_date >= CURRENT_TIMESTAMP
        `;
        db.query(queryActiveDiscount, [restaurant_id], (err2, activeDiscounts) => {
            if (err2) {
                console.error('Error checking active discounts:', err2);
                return res.status(500).json({ message: 'Error checking active discounts' });
            }

            if (activeDiscounts.length > 0) {
                return res.status(409).json({
                    message: 'Only one flat active discount is allowed for this restaurant'
                });
            }

            const insertDiscount = `
                INSERT INTO discount (restaurant_id, discount_value, start_date, end_date)
                VALUES (?, ?, ?, ?);
            `;
            db.query(insertDiscount, [restaurant_id, discount_value, start_date, end_date], (err3, result1) => {
                if (err3) {
                    console.error('Error adding discount:', err3);
                    return res.status(500).json({ message: 'Error adding discount' });
                }

                console.log('Discount added successfully');
                return res.status(201).json({
                    success: true,
                    message: 'Discount added successfully',
                });
            });
        });
    });
};


module.exports.AddPromo = (req,res) => {
    const location_id = req.params.id;
    const {  promo_code ,promo_value ,start_date ,end_date ,limit,Min_Total} = req.body;
console.log(req.body);
    const q = 'SELECT restaurant_id from restaurant where location_id = ? ';
    
    db.query(q,[location_id],(err,result) => {
        if(err){
            return res.status(500).json({message : 'No such location id found'});
        }

        const restaurant_id = result[0].restaurant_id;
        console.log(restaurant_id);
        const qq = `
            INSERT INTO Promos (restaurant_id,promo_code,
            promo_value,start_date,end_date,usage_limit,Min_Total) VALUES (?,?,?,?,?,?,?); 
        `
        db.query(qq,[restaurant_id,promo_code ,promo_value ,start_date ,end_date ,limit,Min_Total],(err1,result1) => {
            if(err1){
                return res.status(500).json({message : 'Error adding promo'});
            }
            console.log('prmote added');
            return res.status(200).json({message : 'Promo added'});
        })
    })
}



module.exports.getRiders = (req,res) => {
    const location_id = req.params.id;
    const q = `
       SELECT d.rider_id,d.rider_name,d.available ,d.bikeNo from delivery_rider d
       join restaurant r on d.restaurant_id = d.restaurant_id
       where r.location_id = ? and d.Available = true;
    `;

    db.query(q,[location_id],(error,result) => {
        if(error){
            console.log("error here",error.message);
            res.status(500).json({message : error.message});
        }
        else {         
            console.log(result);
            res.status(200).json(result);
        }
    })
}
module.exports.getOrders = (req, res) => {
    const location_id = req.params.id;
    console.log('location id is ', location_id);

    const q = `
       SELECT o.order_id, o.total_amount, o.order_status, TIME(o.order_time) AS order_time, o.promo_id, 
              p.promo_value, mm.dish_name, i.quantity, i.price * i.quantity AS sub_total, 
              d.address, o.delivered_by_id
       FROM orders o 
       JOIN deliveryaddress d ON o.address_id = d.address_id
       JOIN restaurant r ON r.restaurant_id = o.restaurant_id
       JOIN ordered_items i ON i.order_id = o.order_id
       JOIN menu_items mm ON i.item_id = mm.item_id
       LEFT JOIN promos p ON o.promo_id = p.promo_id  -- Using LEFT JOIN to include orders with no promo
       WHERE r.location_id = ? 
       AND o.order_status IN ('Placed', 'Preparing', 'Out for delivery');
    `;
    
    db.query(q, [location_id], (err, result) => {
        if (err) {
            console.error("Error fetching orders:", err);
            return res.status(500).send("Internal Server Error");
        }

        const groupedOrders = result.reduce((acc, row) => {
            const { order_id, order_status, order_time, dish_name, quantity, sub_total, address, delivered_by_id, promo_value, total_amount } = row;

            let order = acc.find(o => o.order_id === order_id);

            if (!order) {
                order = {
                    order_id,
                    time: order_time,
                    address,
                    status: order_status,
                    items: [],
                    total_amount,
                    rider_id: delivered_by_id,
                    promo_value: promo_value || 'No Promo'  // If promo_value is null, use 'No Promo'
                };
                acc.push(order);
            }

            order.items.push({
                dish_name,
                quantity,
                sub_total,
            });

            return acc;
        }, []);

        console.log(groupedOrders);
        res.json({ orders: groupedOrders });
    });
};


module.exports.updateOrderStatus = (req,res) => {
    const order_id = req.params.id;
    const status = req.body.status;
    console.log(order_id,status, " update hit");
    const q = 'UPDATE orders SET order_status = ? where order_id = ?';

    db.query(q,[status,order_id],(err,result) => {
        if(err){
            console.log("ERroor here");
            return res.status(500).json({error : err.message});
        }
        return res.status(200).json({message : "Order status updated"});
    })
}

module.exports.dispatchOrder = (req, res) => {
    const order_id = req.params.id;
    const { rider_id } = req.body; 
  
      const qq = "UPDATE Orders SET delivered_by_id = ? WHERE order_id = ?";
      db.query(qq, [rider_id, order_id], (error, result2) => {
        if (error) {
          console.log("Error updating order status:", error);
          return res.status(500).json({ error: error.message }); 
        }
        return res.status(200).json({ message: "order delivered by id set" });
      });
  };

module.exports.getDeliveryDetails = (req,res) => {
    const order_id = req.params.id;
    console.log('Delivery details hitt ',order_id);

    const q = `SELECT r.rider_id,r.rider_name,d.address
               from orders o join deliveryaddress d
               on o.address_id = d.address_id
               join delivery_rider r on r.rider_id = o.delivered_by_id
               where order_id = ?
               `;
    db.query(q,[order_id],(err,result) =>{
        if(err){
            res.status(500).json({error : err.message});
        }
        console.log(result);
        return res.status(200).json(result);
    })
}