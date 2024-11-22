/*
Module name: Item.js
Date of the code (latest update): 11/21/24
-----------------------------------------------------------------------------------------------
Programmer: Kevin Volkov /student, CSUN COMP 380, Group #6/
-----------------------------------------------------------------------------------------------
Description: describes DB schema for 'items' table,  Customer Model, manages the store's inventory
 * - Represents products available for purchase in the app
 * - The filelds in the 'tems' are: name, price, description, and optional image data (path to the image on local drive)
 * - 'name': The item's name.
 * - 'price': The price of the item.
 * - `description`: description of the item.
 * - 'itemImage': The name/path of the image file associated with the item (optional).
*/

/*
Kevin's comment: the below  was for "MongoDB", I am using now MySQL but keep this for history
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number
});

module.exports = mongoose.model('Item', itemSchema);
*/
const { DataTypes } = require('sequelize');//to work with SQL types in DB
const sequelize = require('../config/db');// Import the db connection

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
                            //this is for now image path or URL (locally /public/uploads directory)
    allowNull: true         //it may be empty
  }
});

module.exports = Item;
