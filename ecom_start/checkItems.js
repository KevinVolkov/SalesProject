const mongoose = require('mongoose');
const Item = require('./models/Item');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerceDB')
  .then(() => {
    console.log('Connected to MongoDB');
    return Item.find();  // Find all items
  })
  .then(items => {
    console.log('Items:', items);  // Log all items
    mongoose.connection.close();  // Close the connection after retrieving data
  })
  .catch(err => console.error('Error:', err));
