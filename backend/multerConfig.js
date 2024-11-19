const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createRestaurantFolder = (restaurantId) => {
  const restaurantFolder = `./images/${restaurantId}`;
  console.log('i am here');
  if (!fs.existsSync(restaurantFolder)) {
    fs.mkdirSync(restaurantFolder, { recursive: true }); 
    console.log('created folder',restaurantFolder)
  }

  return restaurantFolder;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'Restaurant_image') {
      cb(null, './images'); 
    } 
    else {
      const restaurantId = req.params.id;  
      const restaurantFolder = createRestaurantFolder(restaurantId); 
      cb(null, restaurantFolder); 
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix); 
  },
});

const upload = multer({ storage });
console.log('configuring multer for restaurant-specific and cover images');

module.exports = upload;
