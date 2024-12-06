/*
Module name: ../routes/admin.js
Date of the code (latest update): 12/03/24
-----------------------------------------------------------------------------------------------
Programmer: Kevin Volkov /student, CSUN COMP 380, Group #6/
-----------------------------------------------------------------------------------------------
Description:  Middleware Items Routes Module for actions performed by 'admin'
 * - Handles requests fr adding, updating, or deleting items and customers.
*/



//const express = require('express');
//const router = express.Router();
//const { Customer, Item } = require('../models'); // Assuming you have models defined for Customer and Item


const express = require('express');
const router = express.Router();
//no need //not using //const adminMiddleware = require('../middleware/adminMiddleware');
const Item = require('../models/Item');
const Customer = require('../models/Customer');



/* 
 @function: isAdmin
 @purpose:  checking if a customer is 'admin', allow or deny access
 @called_from: middleweare route
 @input: req,res,next (web request and response structures)
 @output: none, but redirecting to next view
 @algorithm: customer is 'admin' if it's name is 'admin'. 
             explanation: Only one 'admin' is allowed in the system
*/


// Middleware to check if the user is "admin"
function isAdmin(req, res, next) {
    if (req.session.customer && req.session.customer.name === 'admin') {
        next(); // Proceed if the user is "admin"
    } else {
        return res.status(403).send('Access denied. Admins only.');
    }
}
/*
// Admin dashboard route
router.get('/dashboard', isAdmin, (req, res) => {
    res.render('admin/dashboard'); // Create a dashboard view for admin operations
}); */

/* 
 @function: router.get('/dashboard'...
 @purpose:  Admin dashboard route
 @called_from: middleweare route
 @input: req,res,(web request and response structures)
 @output: none, but redirecting to next view (depending if the customer is 'admin')
 @algorithm: customer is 'admin' if it's name is 'admin'. 
             explanation: Only one 'admin' is allowed in the system
*/
// Ensure this route is only accessible by admin
router.get('/dashboard', (req, res) => {
    if (req.session.customer && req.session.customer.name === 'admin') {
      return res.render('admin/dashboard');
    } else {
      return res.redirect('/');
    }
  });
//******************************************* */




// View all items
/* 
 @function: router.get('/items'
 @purpose:  Admin dashboard route to '/items'
 @called_from: middleweare route
 @input: req,res,(web request and response structures)
 @output: none, but redirecting to admin/items'
 @algorithm: redirecting to View all items 
*/
router.get('/items', isAdmin, async (req, res) => {
    const items = await Item.findAll();
    res.render('admin/items', { items });
});


//The description of other functions is simillar to the above and obvious

// Add an item (form)
router.get('/items/add', isAdmin, (req, res) => {
    res.render('admin/additem');//Kevin addItem -> additem to work in linux correctly
});

// Add an item (submission)
router.post('/items/add', isAdmin, async (req, res) => {
    const { name, price, description, stock, itemImage } = req.body;//Kevin added stock and itemImage
    await Item.create({ name, price, description, stock, itemImage });//kevin addes stock
    res.redirect('/admin/items');
});

// Delete an item
router.post('/items/delete/:id', isAdmin, async (req, res) => {
    await Item.destroy({ where: { id: req.params.id } });
    res.redirect('/admin/items');
});

// View all customers
router.get('/customers', isAdmin, async (req, res) => {
    const customers = await Customer.findAll();
    res.render('admin/customers', { customers });
});

// Delete a customer
router.post('/customers/delete/:id', isAdmin, async (req, res) => {
    await Customer.destroy({ where: { id: req.params.id } });
    res.redirect('/admin/customers');
});

module.exports = router;
