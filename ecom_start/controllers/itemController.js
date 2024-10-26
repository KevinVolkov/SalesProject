const Item = require('../models/Item');
const { Sequelize } = require('../config/db'); // Import Sequelize for using Op

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
