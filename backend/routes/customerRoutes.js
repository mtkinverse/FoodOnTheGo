const express = require('express');
const router = express.Router();
const { PlaceOrder,getAllOrders,cancelOrder } = require('../controllers/customerController');

router.post('/placeOrder',PlaceOrder);
router.get('/getAllOrders/:id',getAllOrders);
router.post('/cancelOrder/:id',cancelOrder);
module.exports = router;