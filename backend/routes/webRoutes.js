const express = require('express');
const router = express.Router();
const {getTopRestaurants} = require('../controllers/topController');
const {getRestaurants,getSpecificRestaurant} = require('../controllers/restaurantController');

router.get('/home',getTopRestaurants);
router.get('/restaurants',getRestaurants);
router.get('/restaurants/:id',getSpecificRestaurant);

module.exports = router;