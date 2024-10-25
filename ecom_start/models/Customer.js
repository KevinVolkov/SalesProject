const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
   
  password: {
    type: String, // Not required for guest checkout
    required: function() { return this.isRegistered; } ,// Only required for registered users
    unique: false,//true  // Ensures email must be unique in the collection
    maxlength: 60 //should help per https://github.com/kelektiv/node.bcrypt.js/issues/906
  },
  
  
  address: String,
  orders: [{
    items: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    }],


    isRegistered: {
      type: Boolean,
      default: false // True for registered users, false for guest users
    },

    total: Number,
    date: { type: Date, default: Date.now }
  }]
});

// Hash password before saving
customerSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('Customer', customerSchema);
