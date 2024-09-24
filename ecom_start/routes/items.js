
//Kevin Volkov: routes/items.js , defines route to the controller
const express = require('express'); 
const router = express.Router(); 
const itemController = require('../controllers/itemController'); 
router.get('/search', itemController.searchItems); 
module.exports = router; 