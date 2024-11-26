const express = require('express');
const router = express.Router();
const { setVehicle, getRestaurantInfo, getPendingOrders, getHistory, markOrderDelivered } = require("../controllers/riderController");

router.post('/setVehicle/:id',setVehicle);
router.get('/getRestaurantInfo/:id',getRestaurantInfo);
router.get('/getOrdersToDeliver/:id',getPendingOrders);
router.get('/getRiderHistory/:id',getHistory);
router.post('/markDelivered',markOrderDelivered);

module.exports = router;