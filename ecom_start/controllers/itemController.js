//Kevin Volkov: and this is itemControler
//Model–view–presenter (MVP) is a derivation of the model–view–controller (MVC) architectural pattern, 
//and is used mostly for building user interfaces.
const Item = require('../models/Item'); 
exports.searchItems = async (req, res) => { 
const searchQuery = req.query.q; 
const items = await Item.find({ name: new RegExp(searchQuery, 'i') }); 
res.render('search', { items });  // Rendering search.ejs with data 
}; 