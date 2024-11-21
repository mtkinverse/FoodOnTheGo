const express = require('express');
const router = express.Router();
const { setVehicle } = require("../controllers/riderController");

router.post('/setVehicle/:id',setVehicle);
module.exports = router;