const db = require('../db');


module.exports.getMyTips = (req, res) => {
    const rider_id = req.params.id;
      const q = 'SELECT tips FROM rider_tips WHERE rider_id = ? AND DATE(tip_date) = CURRENT_DATE';
  
    db.query(q, [rider_id], (err, result) => {
      if (err) {
        console.log('Error fetching tips:', err); 
        return res.status(400).json({ message: 'Error fetching tips' });
      }
  
      if (result.length === 0) {
        return res.status(200).json({ tips: 0 });
      }
  
      
      return res.status(200).json({ tips: result[0].tips });
    });
  };
  
module.exports.updateStatus =(req,res) => {
    
    const q = 'UPDATE delivery_rider set available = ? where rider_id = ?';
    db.query(q,[req.body.status,req.params.id,],(err,result) => {
        if(err){
            console.log('error ',err.message);
            res.status(500).json({error : err.message});
        }
        
        res.status(200).json({message : "marked" + req.body.status});
    })

}

module.exports.setVehicle = (req,res) => {
    
    const rider_id = req.params.id;
    const bikeNo = req.body.bikeNo;
    
    const q = 'UPDATE Delivery_Rider SET BikeNo = ? where Rider_id = ? ';
    db.query(q,[bikeNo,rider_id],(err,result) => {
        if(err) {
            res.status(400).json({ error: 'Database query failed', details: err.message });
        }
        else res.status(200).json({message: "Vehicle registered"});
    })
}

module.exports.getRestaurantInfo = (req,res) => {
    
    const rider_id = req.params.id;
    const q =  `
      SELECT r.restaurant_name,l.address,l.location_id 
      from delivery_rider d 
      join restaurant r on d.restaurant_id = r.restaurant_id
      join locations l on r.location_id = l.location_id
      where d.rider_id = ?
    `

    db.query(q,[rider_id],(err,result) => {
        if(err){
            return res.status(500).json({error : err.message});
        }
        
        return res.status(200).json(result);
    })
}

module.exports.getPendingOrders = (req,res) =>{    
    const q = 'SELECT o.*,d.*,c.Customer_Name FROM Orders o NATURAL JOIN Customer c NATURAL JOIN DeliveryAddress d WHERE Delivered_by_id = ? AND Order_status = \'Out for delivery\'';
    db.query(q,[req.params.id], (err,result) => {
        if (err) console.log(err);

        if(err || result.length <= 0) res.status(500).json({message : 'Cannot get pending orders'})
        else res.status(200).json({orders : result})
    })
}

module.exports.getHistory = (req,res) => {
    
    const q = 'SELECT * FROM Orders WHERE Delivered_by_id = ? and Order_Status = ? ';
    db.query(q,[req.params.id,'Delivered'], (err,result) => {
        if(err) res.status(500).json({message : 'Cannot get History'})
        console.log(result);        
        res.status(200).json({orders : result})
    })
}

module.exports.markOrderDelivered = (req,res) => {
    const {Order_id, Rider_id} = req.body;
    
    const q = 'UPDATE Orders SET Order_Status = \'Delivered\' WHERE Order_id = ?';
    db.query(q,[Order_id], (err,result) => {
        if(err || result.length <= 0) res.status(500).json({message : 'Cannot mark as delivered'});
        else {
            const q2 = 'Update Delivery_Rider set Available = true where rider_id = ?';
            db.query(q2,[Rider_id], (err,result) => {

                if(err) res.status(500).json({message : 'Failed to update the status of rider'})
                else res.status(200).json({success : true});
            })
        }
    })
}