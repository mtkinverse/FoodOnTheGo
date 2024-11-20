const express = require('express');
const router = express.Router();
const { setVehicle } = require("../controllers/riderController");

router.post('/addVehicle/:id',setVehicle);
router.post('/updateVehicle/:id',setVehicle);
module.exports = router;