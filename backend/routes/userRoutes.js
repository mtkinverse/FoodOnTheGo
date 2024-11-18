const express = require('express');
const router = express.Router();
const {registerUser,loginUser,logoutUser,getMenu} = require('../controllers/userController');

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);
router.get('/menu/:id',getMenu);

module.exports = router;