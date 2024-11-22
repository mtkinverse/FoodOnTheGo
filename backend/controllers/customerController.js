const db = require('../db');

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

module.exports.TrackOrder = (req, res) => {

}