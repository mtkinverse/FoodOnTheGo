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

