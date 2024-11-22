const express = require('express');
const router = express.Router();
const {registerUser,loginUser,logoutUser,getMenu,updateAccount} = require('../controllers/userController');

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);
router.get('/menu/:id',getMenu);
router.post('/updateAccount',updateAccount);

module.exports = router;