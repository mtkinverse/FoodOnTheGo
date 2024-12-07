const express = require('express');
const router = express.Router();
const {getTopRestaurants} = require('../controllers/topController');
const {getRestaurants,getSpecificRestaurant,getRestaurantMenu, getReviews, getPopularItems} = require('../controllers/restaurantController');
const {getMenu,loginUser,registerUser,isEmailUnique} = require('../controllers/userController');
const { handleSendOTP,handleVerifyOTP } = require('../services/emailService');


router.get('/home',getTopRestaurants);
router.get('/restaurants',getRestaurants);
router.get('/restaurants/:id',getRestaurantMenu);
router.post('/login',loginUser);
router.get('/is-email-unique',isEmailUnique)
router.post('/register',registerUser);
router.get('/menu/:id',getMenu);
router.get('/getPopularItems/:id',getPopularItems);
router.get('/getRestaurant/:id',getSpecificRestaurant);
router.get('/getReviews/:id',getReviews);
router.post('/send-otp',handleSendOTP);
router.post('/verify-otp',handleVerifyOTP)
router.post('/resend-otp',handleSendOTP);

module.exports = router;