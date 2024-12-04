const express = require('express');
const router = express.Router();
const {getTopRestaurants} = require('../controllers/topController');
const {getRestaurants,getSpecificRestaurant,getRestaurantMenu, getReviews} = require('../controllers/restaurantController');
const {getMenu,loginUser,registerUser} = require('../controllers/userController');
const { handleSendOTP,handleVerifyOTP } = require('../services/emailService');


router.get('/home',getTopRestaurants);
router.get('/restaurants',getRestaurants);
router.get('/restaurants/:id',getRestaurantMenu);
router.post('/login',loginUser);
router.post('/register',registerUser);
router.get('/menu/:id',getMenu);
router.get('/getRestaurant/:id',getSpecificRestaurant);
router.get('/getReviews/:id',getReviews);
router.post('/send-otp',handleSendOTP);
router.post('/verify-otp',handleVerifyOTP)
router.post('/resend-otp',handleSendOTP);

module.exports = router;