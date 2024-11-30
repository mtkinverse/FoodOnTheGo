const express = require('express');
const router = express.Router();
const {getTopRestaurants} = require('../controllers/topController');
const {getRestaurants,getSpecificRestaurant,getRestaurantMenu, getReviews} = require('../controllers/restaurantController');
const {getMenu,loginUser,registerUser} = require('../controllers/userController');


router.get('/home',getTopRestaurants);
router.get('/restaurants',getRestaurants);
router.get('/restaurants/:id',getRestaurantMenu);
router.post('/login',loginUser);
router.post('/register',registerUser);
router.get('/menu/:id',getMenu);
router.get('/getRestaurant/:id',getSpecificRestaurant);
router.get('/getReviews/:id',getReviews);

module.exports = router;