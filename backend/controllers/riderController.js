const db = require('../db');

module.exports.setVehicle = (req,res) => {
    console.log('Hit add/update Vehicle');
    const rider_id = req.params.id;
    const bikeNo = req.body.bikeNo;
    console.log(bikeNo);
    const q = 'UPDATE Delivery_Rider SET BikeNo = ? where Rider_id = ? ';
    db.query(q,[bikeNo,rider_id],(err,result) => {
        if(err) {
            res.status(400).json({ error: 'Database query failed', details: err.message });
        }
        else res.status(200).json({message: "Vehicle registered"});
    })
}

module.exports.getRestaurantInfo = (req,res) => {
    console.log('get restaurant info hit');
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
        console.log(result);
        return res.status(200).json(result);
    })
}