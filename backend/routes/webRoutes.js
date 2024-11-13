const express = require('express');
const router = express.Router();
const {getTopRestaurants} = require('../controllers/topController');
const {getRestaurants} = require('../controllers/restaurantController');

router.get('/home',getTopRestaurants);
router.get('/restaurants',getRestaurants)

module.exports = router;