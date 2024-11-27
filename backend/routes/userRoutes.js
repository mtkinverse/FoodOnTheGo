const express = require('express');
const router = express.Router();
const {logoutUser,updateAccount} = require('../controllers/userController');

router.post('/updateAccount',updateAccount);
router.post('/logout',logoutUser);

module.exports = router;