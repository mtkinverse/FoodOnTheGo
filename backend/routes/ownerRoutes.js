const express = require('express');
const router = express.Router();
const {addMenu,addMenuItem,getOwnedRestaurants} = require('../controllers/ownerController');


router.post('/addMenu/:id',addMenu);
router.post('/addMenuItem/:id',addMenuItem);
router.post('/ownedRestaurants',getOwnedRestaurants);

module.exports = router;