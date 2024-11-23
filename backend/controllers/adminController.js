const db = require('../db');


module.exports.getRiders = (req,res) => {
    const q = 'Select * from delivery_rider where Available = true';
    db.query(q,[],(error,result) => {
        if(error){
            res.status(500).json({message : error.message});
        }
        else {
            let sendData = [];
            if(result.length > 0)
            sendData = result.map(({ Email_address,Account_Password, ...rest }) => rest);            
            res.status(200).json({riders : sendData});
        }
    })
}

module.exports.getOrders = (req,res) => {
    const Branch_id = req.params.id;
    console.log('branch id is ',Branch_id);
    
    const q1 = 'Select restaurant_id from Branch where Branch_id = ?';
    db.query(q1,[Branch_id],(err,result) => {
        if(err || result.length == 0){
            console.log('error occured for admin getting order');
            return res.status(500).json({message : result.length == 0 ? 'No restaurant found!': err.message});
        }
        else{
            const q2 = 'select Customer_id,Order_id, Order_time,Order_status, Restaurant_id, address_id,Address,a.phoneNo , Delivered_by_id, Customer_name from orders natural join customer natural join deliveryAddress a where restaurant_id = ?';
            console.log('result is ', result);
            
            db.query(q2,[result[0].restaurant_id],(err2,result2) => {
                if(err2){
                    console.log('cannot fetch the orders for restaurant ', result[0].restaurant_id);
                    return res.status(500).json({message : err2.message});
                }
                else{
                    console.log('orders are ', result2);
                    
                    return res.status(200).json({orders : result2});
                }
            })
        }
    })
}