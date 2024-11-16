/*const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number
});

module.exports = mongoose.model('Item', itemSchema);
*/
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  itemImage: {
    type: DataTypes.STRING, //Kevin on 11/16/24: maybe later I want to use BLOB if I want to store binary data.
                            //this is for now image path or URL
    allowNull: true         //it may be empty
  }
});

module.exports = Item;
