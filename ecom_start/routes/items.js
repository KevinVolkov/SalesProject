const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/search', itemController.searchItems);
/*
router.get('/search', (req, res) => {
    //if (!req.session.customer) {
    //    return res.redirect('/login'); // Redirect to login if not authenticated
    //}
    res.render('search', 
      { 
        customer: req.session.customer,
        user: req.user // Pass user info if needed
      });
  });
*/
module.exports = router;
