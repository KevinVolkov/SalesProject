
/*
Module name: order.js
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
const express = require('express');//import package for 'express' apps
const router = express.Router();//get the router structure/object 
const orderController = require('../controllers/orderController');//get/importorderController
const Item = require('../models/Item');//this is correct path notice '..' //import/get Item type/class/structure from DB


//router.post('/add-to-cart', orderController.addToCart);
//start mysql changes **********************
// Add to Cart route


/* 
 @function: router.post, setting routing to  /add-to-cart function.
 @purpose:  setting routing to  '/add-to-cart' function'
 @called_from: middlewear route
 @input: req,res (web request and response structures)
 @output: none, but redirecting to '/cart' view
 @algorithm: POST request `/add-to-cart` - adds an item to the cart, see also comments below, it finds the
             item in DB via primary key findByPk (itemId) before adding
*/
 router.post('/add-to-cart', async (req, res) => {
    const itemId = req.body.itemId; // the ID of the item being added
    const quantity = parseInt(req.body.quantity) || 1; // default quantity to 1 if not provided

    try {
        console.log("Selected itemId=["+itemId+"]");
        const item = await Item.findByPk(itemId); // find the item using Sequelize

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Check if the cart exists in session, if not create it
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Add item to cart
        const cartItem = {
            itemId: item.id,
            name: item.name,
            price: item.price,
            itemImage: item.itemImage, //Kevin's comment: show itemImage in cart! //11/16/24
            quantity: quantity
        };

        req.session.cart.push(cartItem); // add item to the session's cart array

        res.redirect('/order/cart'); // redirect to the cart view
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while adding item to cart" });
    }
});
//end  changes for mysql ************************

/* 
 @function: router.get, setting routing to  rendering `/cart' view
 @purpose:  setting routing to  rendering `/cart' view
 @called_from: middlewear route
 @input: req,res (web request and response structures)
 @output: none, but rendering the `/cart' view
 @algorithm: GET request GET `/cart` - Retrieves a list of all items.
*/
router.get('/cart', orderController.viewCart);


/* 
 @function: router.get, setting routing to  '/checkout'
 @purpose:  POST `/checkout` - Processes customer checkout and saves order details.
 @called_from: middlewear route
 @input: req,res (web request and response structures)
 @output: none, but rendering the `/checkout' view
 @algorithm: POST `/checkout` - customer checkout route, also saves order details.
*/   
router.post('/checkout', orderController.checkout);


/* 
 @function: router.get, setting routing to  rendering `/checkout' view
 @purpose:  setting routing to  rendering `/checkout' view
 @called_from: middlewear route
 @input: req,res (web request and response structures)
 @output: none, but rendering the `/checkout' view
 @algorithm: GET request GET `/checkout` render '/checkout' view : Proceed to Checkout
*/
router.get('/checkout', (req, res) => {
    res.render('checkout');
});

//Kevin Volkov 10/27/24 start ****************

/* 
 @function: router.post, setting routing to  /clear-cart function.
 @purpose:  setting routing to  '/clear-cart' function'
 @called_from: middlewear route
 @input: req,res (web request and response structures)
 @output: none, but clears the cart and redirects to '/cart' view
 @algorithm: POST request `/clear-cart` - clears the cart, see also comments below, 
*/
router.post('/clear-cart', (req, res) => {
    req.session.cart = []; // Clear the cart by setting it to an empty array
    res.redirect('/order/cart'); // Redirect back to the cart page or any other page you prefer
  });

//Kevin Volkov 10/27/24 end ******************
module.exports = router;
