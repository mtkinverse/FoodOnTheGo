const db = require('../db');


module.exports.PlaceOrder = (req, res) => {
    console.log('received', req.body);
    
    const { Customer_id, Menu_id, Address, NearbyPoint, items } = req.body;

    const q1 = 'select restaurant_id from restaurant where menu_Id = ?';
    db.query(q1, [Menu_id], (err, res) => {
        if (err) {
            res.status(500).json({ message: 'Invalid Menu id' });
        }
        else {
            const Restaurant_id = res[0];
            const query = 'CALL PLACEORDER (?,?,?,?, @Created_Order_id)';
            db.query(query, [Customer_id, Restaurant_id, Address, NearbyPoint], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Database query failed', details: err.message });
                } else {
                    const q2 = 'SELECT @Created_ORder_id as orderId';
                    db.query(q2, [], (err, result) => {
                        if (err) {
                            return res.status(500).json({ error: 'Database query failed', details: err.message });
                        } else {
                            
                            items.forEach(ele => {
                                const itemInsert = 'insert into ordered_items values (@Created_order_id, ?,?)';
                                db.query(itemInsert,[ele.Item_id,ele.quantity],(err,res) => {
                                    if(err){
                                        return res.status(500).json({message : 'Cannot insert an item'});
                                    }
                                })
                            });
                            return res.status(200).json({ success: true, message: 'Order placed successfully' });
                        }
                    })
                }
            })
        }
    })


}

module.exports.TrackOrder = (req, res) => {

}