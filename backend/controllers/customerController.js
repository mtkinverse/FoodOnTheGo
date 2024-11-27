const db = require('../db');

module.exports.getPromos = (req,res) => {
    const restaurant_id = req.params.id;

    const q = 'SELECT * from promos where restaurant_id = ? and status = ? ';

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
       SELECT o.order_id,r.restaurant_name,r.restaurant_id
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

module.exports.PlaceOrder = (req, res) => {
    console.log('received', req.body);

    const { Customer_id, Menu_Id, Address, NearbyPoint, items } = req.body;
    console.log(Menu_Id);
    const q1 = 'SELECT Restaurant_id FROM restaurant WHERE menu_id = ?';
    db.query(q1, [Menu_Id], (err, result) => {
        if (err) {
            console.log('invalid menu id error');
            return res.status(500).json({ message: 'Invalid Menu id' });
        }

        const Restaurant_id = result[0].Restaurant_id;
        console.log(Restaurant_id);
        const query = 'CALL PLACEORDER (?, ?, ?, ?, @Created_Order_id)';
        db.query(query, [Customer_id, Restaurant_id, Address, NearbyPoint], (err1) => {
            if (err1) {
                return res.status(500).json({ error: 'Database query failed', details: err1.message });
            }

            const q2 = 'SELECT @Created_Order_id AS orderId';
            db.query(q2, [], (err2, result2) => {
                if (err2) {
                    return res.status(500).json({ error: 'Database query failed', details: err2.message });
                }

                const Order_id = result2[0].orderId;
                console.log(Order_id);
                let itemsAdded = 0;
                let error_flag = false;  

                items.forEach((ele) => {                    
                    if (error_flag) return; 
                    const itemInsert = 'INSERT INTO ordered_items VALUES (?, ?, ?)';
                    db.query(itemInsert, [Order_id, ele.Item_id, ele.quantity], (err3) => {
                        if (err3) {
                            error_flag = true; 
                            return res.status(500).json({ message: 'Cannot insert an item', details: err3.message });
                        }

                        itemsAdded += 1;
                        if (itemsAdded === items.length && !error_flag) {
                            return res.status(200).json({ success: true, message: 'Order placed successfully' });
                        }
                    });
                });
            });
        });
    });
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

module.exports.getAllOrders = (req,res) => {
    const Customer_id = req.params.id;
    console.log('get orders hit ',Customer_id);
    const q = `
      select o.order_id,o.order_status,d.address,r.restaurant_name,o.customer_id,DATE(o.order_time) AS order_date, 
             TIME(o.order_time) AS order_time,i.item_id,i.dish_name,oo.quantity,i.item_price * oo.quantity AS sub_total
      from orders o 
      join deliveryaddress d on o.address_id = d.address_id
      join restaurant r on o.restaurant_id = r.restaurant_id
      join ordered_items oo on o.order_id = oo.order_id  
      join menu_items i on oo.item_id = i.item_id        
      where o.customer_id = ?
      order by order_date DESC;
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
                        status:curr.order_status,
                        order_date: curr.order_date,
                        order_time: curr.order_time,
                        customer_id: curr.customer_id,
                        restaurant_name: curr.restaurant_name,
                        total_amount: 0,
                        items: []
                    };
                }
                acc[curr.order_id].items.push({
                    item_id: curr.item_id,
                    dish_name: curr.dish_name,
                    quantity: curr.quantity,
                    sub_total: curr.sub_total
                });
                acc[curr.order_id].total_amount += curr.sub_total;
                return acc;
            }, {})
        );
        console.log(groupedOrders);
        res.status(200).json(groupedOrders);
    });
}