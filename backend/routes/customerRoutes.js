const express = require('express');
const router = express.Router();
const { PlaceOrder,getAllOrders,cancelOrder, getLastOrder, reviewOrder } = require('../controllers/customerController');

router.post('/placeOrder',PlaceOrder);
router.get('/getAllOrders/:id',getAllOrders);
router.post('/cancelOrder/:id',cancelOrder);
router.get('/getLastOrder/:id',getLastOrder);
router.post('/reviewOrder/:id',reviewOrder);

module.exports = router;