/* 
Module name: Customer.js
Date of the code (latest update): 11/21/24
-----------------------------------------------------------------------------------------------
Programmer: Kevin Volkov /student, CSUN COMP 380, Group #6/
-----------------------------------------------------------------------------------------------
Description: describes DB schema for 'customers' table,  Customer Model
 * - Represents registered users (customers) and includes their name, email, password, and orders.
 * - defines custom getter and setter for handling serialized data (orders field).
 * - defines relationships between customers and orders/cart items.
 *
 * Key Fields:
 * - 'name': The customer's name.
 * - 'email': The customer's unique email address.
 * - 'password': The hashed (encrypted) password for login authentication.
 * - 'orders: A semicolon-separated very long string of orders details.
 */

//const mongoose = require('mongoose');//I am using  MySQL now, but keep for history
//const bcrypt = require('bcryptjs');//I do not need this encryption package here
const { DataTypes } = require('sequelize');//to work with SQL types in DB
const sequelize = require('../config/db');  // Import the db connection


const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,  //this is Primary Key of the "customers" table
    autoIncrement: true
},
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure this is defined only once
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true  // Allow null for guest checkout// Make this nullable for guest checkout
  },
  //  https://stackoverflow.com/questions/63335865/sequelize-error-on-datatypes-arraydatatypes-string
  //  https://stackoverflow.com/questions/41860792/how-can-i-have-a-datatype-of-array-in-mysql-sequelize-instance
  orders: {
    type: DataTypes.STRING,
    allowNull: true,
    get() { return this.getDataValue('orders').split(';')  },
    set(val) {   this.setDataValue('orders',val.join(';'));  },
  },
  
  isRegistered: {
    type: DataTypes.BOOLEAN, // MySQL BOOLEAN translates to TINYINT(1)
    defaultValue: false, // False for guest users
  }
  }, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['email'] // Ensure there is only one unique constraint
        }
    ]
});


module.exports = Customer;