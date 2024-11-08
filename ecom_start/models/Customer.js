//const mongoose = require('mongoose');
//const bcrypt = require('bcryptjs');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  // Import the db connection


const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
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