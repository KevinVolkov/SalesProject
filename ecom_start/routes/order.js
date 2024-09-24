
//Kevin Volkov: routes/order.js , defines route to the controller
const express = require('express'); 
const router = express.Router(); 
const orderController = require('../controllers/orderController'); 
router.post('/', orderController.createOrder); 
module.exports = router;