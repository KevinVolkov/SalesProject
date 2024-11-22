/*
Module name: items.js
Date of the code (latest update): 11/21/24
-----------------------------------------------------------------------------------------------
Programmer: Kevin Volkov /student, CSUN COMP 380, Group #6/
-----------------------------------------------------------------------------------------------
Description:  Middleware Items Routes Module for actions performed for items
 * - Defines routes for managing and interacting with items in the store.
 * - Handles requests for viewing, adding, updating, or deleting items.
 * - Helps 'search' view and 'admin' item management ('admin' functions to be done yet).
 * - entry point for item-related controllers.
*/

//import required packages
const express = require('express');//import required package for 'expess' app
const router = express.Router();//get the router structure/object 
const itemController = require('../controllers/itemController');//get itemControler object/structure


/* 
 @function: router.get, setting routing to  rendering `/search' view
 @purpose:  setting routing to  rendering `/search' view
 @called_from: middlewear route
 @input: req,res (web request and response structures)
 @output: none, but rendering the `/search' view
 @algorithm: GET request GET `/search` - Retrieves a list of all items.
*/
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

//Kevin's comment 11/11/24 for the future 'admin' functions: later I will also put here 
// - POST `/admin/additem` - Allows the admin to add a new item.

module.exports = router;
