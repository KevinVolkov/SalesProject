/*
Module name: itemController.js
Date of the code (latest update): 11/21/24
-----------------------------------------------------------------------------------------------
Programmer: Kevin Volkov /student, CSUN COMP 380, Group #6/
-----------------------------------------------------------------------------------------------
Description: Middle-Tier module. Manages item-related actions like fetching item details or processing searches.
             also uses package 'multer' functions to handle images on the disk (the pathes are in DB as strings)
*/

const Item = require('../models/Item');// get Item schema/structure as a type/class
const { Sequelize } = require('../config/db'); // Import Sequelize for using Op

//Kevin 11/16/24 start get/configure static objects for multer to handle picture on the disk*********
const multer = require('multer');//this package is for pictures handling on the disk, not in DB
const path = require('path');
// Set up multer storage and file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Path to save uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


/* 
 @function: addItem   
 @purpose:  provides Add Item algorithm in web interface 
 @called_from: /routes/order.js . Will also use it in admin functions later
 @input: req,res (web request and response structures)
 @output: redirects to the item view after adding a new item
 @algorithm: clear from the code and comments below
*/
// Handle adding a new item
exports.addItem = [
  upload.single('itemImage'),
  async (req, res) => {
    try {
      const { name, description, price, stock} = req.body;//kevin added stock 11/16/24
      const itemImage = req.file ? `/uploads/${req.file.filename}` : null;

      await Item.create({
        name,
        description,
        price,
        stock,//Kevin added 11/16/24
        itemImage
      });

      res.redirect('/admin/items');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error adding item');
    }
  }
];
//Kevin 11/16/24 end *******************************************************

/* 
 @function: searchItems   
 @purpose:  provides search Items algorithm in web interface 
 @called_from: /routes/items.js . 
 @input: req,res (web request and response structures)
 @output: items array (per criteria) passed to be rendered /views/search.ejs
 @algorithm: uses Sequelize instead of SQL to simplify DB search, also see the comments below
*/

exports.searchItems = async (req, res) => {
  const searchQuery = req.query.q;
  //const items = await Item.find({ name: new RegExp(searchQuery, 'i') });
  try {
    // Use Sequelize's findAll method with a where clause for a case-insensitive search
    const items = await Item.findAll({
      where: {
        name: {
          [Sequelize.Op.like]: `%${searchQuery}%` // Case-insensitive search using LIKE
        }
      }
    });
  
 
  res.render('search', { items });  // Rendering search.ejs with data
} 
catch (error) {
  console.error('Error while searching items:', error);
  res.status(500).send('Error while searching items');
 }
};
