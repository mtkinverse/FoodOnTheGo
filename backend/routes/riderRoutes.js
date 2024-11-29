const express = require('express');
const router = express.Router();
const { setVehicle, getRestaurantInfo, getPendingOrders,
        getHistory, markOrderDelivered, updateStatus, 
        getMyTips} = require("../controllers/riderController");

router.post('/setVehicle/:id',setVehicle);
router.get('/getRestaurantInfo/:id',getRestaurantInfo);
router.get('/getOrdersToDeliver/:id',getPendingOrders);
router.get('/getRiderHistory/:id',getHistory);
router.post('/markDelivered',markOrderDelivered);
router.post('/updateMyStatus/:id',updateStatus);
router.get('/getTips/:id',getMyTips);

module.exports = router;