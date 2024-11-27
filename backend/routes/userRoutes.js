const express = require('express');
const router = express.Router();
const {logoutUser,updateAccount,deleteAccount} = require('../controllers/userController');

router.post('/updateAccount',updateAccount);
router.post('/logout',logoutUser);
router.post('/deleteAccount/:id',deleteAccount);
module.exports = router;