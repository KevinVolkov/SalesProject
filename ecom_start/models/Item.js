
//Kevin Volkov: models/Customer.js , defines itemSchema which describing "items" table" (name, desc, price, stock avail)
const mongoose = require('mongoose'); 
const itemSchema = new mongoose.Schema({ 
name: String, 
description: String, 
price: Number, 
stock: Number 
}); 
module.exports = mongoose.model('Item', itemSchema); 