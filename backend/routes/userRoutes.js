const express = require('express');
const router = express.Router();
const {registerUser,loginUser,logoutUser,getMenu,updateAccount} = require('../controllers/userController');
const { PlaceOrder } = require('../controllers/customerController');

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);
router.get('/menu/:id',getMenu);
router.post('/updateAccount',updateAccount);
router.post('/placeOrder',PlaceOrder);

module.exports = router;