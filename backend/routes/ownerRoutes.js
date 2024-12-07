const express = require('express');
const router = express.Router();
const {addMenuItem,getOwnedRestaurants,AddRestaurant,deleteMenu,
      updateTimings,ChangeImage, addLocation, getLocations,
      deleteItem, updateItem, addAdmin,
      getAdmin,
      updateAdmin,getRestaurant,
      deleteRestaurant,getStats} = require('../controllers/ownerController');
const upload = require("../multerConfig");

const {getWeeklyRevenue} = require('../controllers/restaurantController');

router.post('/addMenuItem/:id',upload.single('image'),addMenuItem);
router.get('/ownedRestaurants',getOwnedRestaurants);
router.post('/addRestaurant',upload.single('Restaurant_image'),AddRestaurant);
router.post('/changeRestaurantImage/:id',upload.single('Restaurant_image'),ChangeImage);
router.post('/deleteMenu/:id',deleteMenu);
router.post('/updateTimings/:id',updateTimings);
router.post('/addLocation',addLocation);
router.get('/getLocations/:id',getLocations);
router.post('/deleteItem/:id',deleteItem)
router.post('/updateItem/:id',upload.single('image'),updateItem);
router.post('/addAdmin/:id',addAdmin);
router.get('/getAdmin/:id',getAdmin);
router.post('/updateAdmin',updateAdmin);
router.get('/getRestaurant/:id',getRestaurant);
router.post('/deleteRestaurant/:id',deleteRestaurant);
router.get('/getStats/:id',getStats);
router.get('/getWeeklyRevenue/:id',getWeeklyRevenue);
module.exports = router;
