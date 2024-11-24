const express = require('express');
const router = express.Router();
const { setVehicle, getRestaurantInfo, getPendingOrders } = require("../controllers/riderController");

router.post('/setVehicle/:id',setVehicle);
router.get('/getRestaurantInfo/:id',getRestaurantInfo);
router.get('/getOrdersToDeliver/:id',getPendingOrders);

module.exports = router;