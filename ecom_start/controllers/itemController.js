const Item = require('../models/Item');
const { Sequelize } = require('../config/db'); // Import Sequelize for using Op

//Kevin 11/16/24 start ****************************
const multer = require('multer');
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
