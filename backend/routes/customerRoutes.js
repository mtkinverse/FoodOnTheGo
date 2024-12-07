const express = require('express');
const router = express.Router();
const { PlaceOrder,getAllOrders,cancelOrder, getLastOrder, reviewOrder, 
    getPromos, verifyPromo, orderAgain,notifyDispatch, 
    LodgeComplaint} = require('../controllers/customerController');


router.post('/placeOrder',PlaceOrder);
router.get('/getAllOrders/:id',getAllOrders);
router.post('/cancelOrder/:id',cancelOrder);
router.get('/getLastOrder/:id',getLastOrder);
router.post('/reviewOrder/:id',reviewOrder);
router.get('/getPromos/:id',getPromos);
router.get('/verifyPromo/:id',verifyPromo);
router.get('/orderAgain/:id',orderAgain);
router.post('/send-status-email',notifyDispatch)
router.post('/lodgeComplaint',LodgeComplaint);
module.exports = router;