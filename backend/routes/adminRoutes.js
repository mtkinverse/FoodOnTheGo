const express = require('express');
const router = express.Router();
const { getOrders, getRiders, updateOrderStatus, updateRiderStatus } = require('../controllers/adminController');

router.get('/getOrders/:id',getOrders);
router.get('/getAvaliableRiders/:id',getRiders);
router.post('/updateOrder/:id',updateOrderStatus);
router.post('/updateRiderStatus/:id',updateRiderStatus);
module.exports = router;