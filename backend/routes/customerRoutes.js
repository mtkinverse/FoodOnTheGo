const express = require('express');
const router = express.Router();
const { PlaceOrder } = require('../controllers/customerController');

router.post('/placeOrder',PlaceOrder);

module.exports = router;