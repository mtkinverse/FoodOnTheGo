const express = require('express');
const router = express.Router();
const {addMenu,addMenuItem,getOwnedRestaurants,AddRestaurant,deleteMenu,
      updateTimings,ChangeImage, addLocation, getLocations,
      deleteItem, updateItem, addAdmin,
      getAdmin,
      updateAdmin} = require('../controllers/ownerController');
const upload = require("../multerConfig");

router.post('/addMenu/:id',addMenu);
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
module.exports = router;
