const express = require('express');
const router = express.Router();
const { getOrders, getRiders } = require('../controllers/adminController');

router.get('/getOrders/:id',getOrders);
router.get('/getAvaliableRiders/',getRiders);
module.exports = router;