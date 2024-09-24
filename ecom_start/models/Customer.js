//Kevin Volkov: models/Customer.js , defines customerSchema which contains reference the orders table
const mongoose = require('mongoose'); 
const customerSchema = new mongoose.Schema({ 
name: String, 
email: String, 
address: String, 
orders: [{ 
type: mongoose.Schema.Types.ObjectId, 
ref: 'Order' 
}] 
}); 
module.exports = mongoose.model('Customer', customerSchema);