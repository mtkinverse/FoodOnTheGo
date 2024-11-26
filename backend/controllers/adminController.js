const db = require('../db');


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

module.exports.getOrders = (req,res) => {
    const location_id = req.params.id;
    console.log('location id is ',location_id);
    
    const q = `
       select o.order_id,o.order_status,TIME(o.order_time) AS order_time,mm.dish_name,i.quantity,mm.item_price * i.quantity as sub_total ,d.address,o.delivered_by_id
       from orders o join deliveryaddress d on o.address_id = d.address_id
       join restaurant r on r.restaurant_id = o.restaurant_id
       join ordered_items i on i.order_id = o.order_id
       join menu_items mm on i.item_id = mm.item_id
       where r.location_id = ? and o.order_status IN ('Placed','Preparing','Out for delivery');
    `
    db.query(q, [location_id], (err, result) => {
        if (err) {
            console.error("Error fetching orders:", err);
            return res.status(500).send("Internal Server Error");
        }

        const groupedOrders = result.reduce((acc, row) => {
            const {order_id,order_status,order_time,dish_name,quantity,sub_total,address,delivered_by_id} = row;

            let order = acc.find(o => o.order_id === order_id);

            if (!order) {
                order = {order_id,time: order_time,address,status: order_status,items: [],total: 0,rider_id : delivered_by_id};
                acc.push(order);
            }

            order.items.push({
                dish_name,
                quantity,
                sub_total,
            });

            order.total += parseFloat(sub_total);
            return acc;
        }, []);
    console.log(groupedOrders);
        res.json({orders: groupedOrders});
    });
}

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