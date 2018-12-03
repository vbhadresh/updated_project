var express = require('express');
var router = express.Router();
var payment= require('../routes/payment');

router.post('/payment',payment);

module.exports = router;