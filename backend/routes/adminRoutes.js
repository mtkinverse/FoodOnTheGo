const express = require('express');
const router = express.Router();
const { getOrders, getRiders, updateOrderStatus, dispatchOrder, getDeliveryDetails, 
    AddPromo,AddDiscount,getDeals, 
    deleteDeal} = require('../controllers/adminController');

router.get('/getOrders/:id',getOrders);
router.get('/getAvaliableRiders/:id',getRiders);
router.post('/updateOrder/:id',updateOrderStatus);
router.post('/dispatchOrder/:id',dispatchOrder);
router.get('/getDeliveryDetails/:id',getDeliveryDetails);
router.post('/addPromo/:id',AddPromo);
router.get('/getCurrentDeals/:id',getDeals);
router.post('/addDiscount/:id',AddDiscount);
router.post('/deleteDeal/:id',deleteDeal);

module.exports = router;