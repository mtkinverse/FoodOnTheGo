const express = require('express');
const router = express.Router();
const {addMenu,addMenuItem,getOwnedRestaurants,AddRestaurant,deleteMenu,updateTimings,ChangeImage, addLocation, getLocations} = require('../controllers/ownerController');
const upload = require("../multerConfig");

router.post('/addMenu/:id',addMenu);
router.post('/addMenuItem/:id',upload.single('image'),addMenuItem);
router.get('/ownedRestaurants',getOwnedRestaurants);
router.post('/addRestaurant',upload.single('Restaurant_image'),AddRestaurant);
router.post('/changeRestaurantImage/:id',upload.single('Restaurant_image'),ChangeImage);
router.post('/deleteMenu/:id',deleteMenu);
router.post('/updateTimings/:id',updateTimings);
router.post('/addLocation/:id',addLocation);
router.get('/getLocations/:id',getLocations);

module.exports = router;
