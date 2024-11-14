const express = require('express');
const router = express.Router();
const {addMenu} = require('../controllers/ownerController');


router.post('/addMenu/:id',addMenu);

module.exports = router;