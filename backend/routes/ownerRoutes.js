const express = require('express');
const router = express.Router();
const {addMenu,addMenuItem,getOwnedRestaurants,AddRestaurant} = require('../controllers/ownerController');
const upload = require("../multerConfig");

router.post('/addMenu/:id',addMenu);
router.post('/addMenuItem/:id',addMenuItem);
router.get('/ownedRestaurants',getOwnedRestaurants);
router.post('/addRestaurant',upload.single('Restaurant_image'),AddRestaurant);

module.exports = router;