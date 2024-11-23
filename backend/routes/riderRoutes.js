const express = require('express');
const router = express.Router();
const { setVehicle, getRestaurantInfo } = require("../controllers/riderController");

router.post('/setVehicle/:id',setVehicle);
router.get('/getRestaurantInfo/:id',getRestaurantInfo);

module.exports = router;