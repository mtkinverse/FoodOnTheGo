const express = require('express');
const router = express.Router();
const {addMenu,addMenuItem} = require('../controllers/ownerController');


router.post('/addMenu/:id',addMenu);
router.post('/addMenuItem/:id',addMenuItem);

module.exports = router;