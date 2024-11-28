const express = require('express');
const router = express.Router();
const { getOrders, getRiders, updateOrderStatus, dispatchOrder, getDeliveryDetails, AddPromo } = require('../controllers/adminController');
const { getPromos } = require('../controllers/customerController');

router.get('/getOrders/:id',getOrders);
router.get('/getAvaliableRiders/:id',getRiders);
router.post('/updateOrder/:id',updateOrderStatus);
router.post('/dispatchOrder/:id',dispatchOrder);
router.get('/getDeliveryDetails/:id',getDeliveryDetails);
router.post('/addPromo/:id',AddPromo);
router.post('/getAvailablePromos/:id',getPromos);

module.exports = router;