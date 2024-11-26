const express = require('express');
const router = express.Router();
const { getOrders, getRiders, updateOrderStatus, dispatchOrder, getDeliveryDetails } = require('../controllers/adminController');

router.get('/getOrders/:id',getOrders);
router.get('/getAvaliableRiders/:id',getRiders);
router.post('/updateOrder/:id',updateOrderStatus);
router.post('/dispatchOrder/:id',dispatchOrder);
router.get('/getDeliveryDetails/:id',getDeliveryDetails);

module.exports = router;