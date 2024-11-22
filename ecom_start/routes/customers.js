/*
Module name: customers.js
Date of the code (latest update): 11/21/24
-----------------------------------------------------------------------------------------------
Programmer: Kevin Volkov /student, CSUN COMP 380, Group #6/
-----------------------------------------------------------------------------------------------
Description:  Middleware Customer Routes Module for actions performed by or for customers
* - Defines routes for customer management: registration, login, and logout.
* - Manages web requests to view and update customer information.
* - entry point for customer-related controllers.
*/

//import required packages
const express = require('express');//import package for 'express' apps
const router = express.Router();//get the router structure/object 
const customerController = require('../controllers/customerController');//get/import customerController

const bcrypt = require('bcryptjs');//for one-way encryptions of passwords in DB const bcrypt = require('bcrypt');
const Customer = require('../models/Customer');//get the Customer structure as class/type

/* 
 @function: router.get, setting routing to  rendering the 'register' view
 @purpose:  setting routing to  rendering the 'register' view
 @called_from: middlewear route
 @input: req,res (web request and response structures)
 @output: none, but rendering the register view
 @algorithm: GET request `/register` - Registers a new customer.
*/
router.get('/register', (req, res) => res.render('register'));

/* 
 @function: router.post, setting routing to  register a new customer.
 @purpose:  setting routing to  'register' function'
 @called_from: middlewear route
 @input: req,res (web request and response structures)
 @output: none, but rendering the login view
 @algorithm: POST request `/register` - Registers a new customer, see also comments below, it hashes the
             password before saving the new cucustome's before saving it in the database
*/
//router.post('/register', customerController.register);//commented for history: we need the one with params
//POST `/register` - Registers a new customer.
router.post('/register', async (req, res) => {
    const { name, email, password, address } = req.body;

    try {
        // Check if email already exists
        //let customer = await Customer.findOne({ email });//this worked with MongoDB, by not with MySQL
          let customer = await Customer.findOne({ 
            where: { email } // Proper use of 'where' clause
        });


        if (customer) {
            //return res.status(400).send('Customer with this email already exists.');
            return res.render('register', { errorMessage: 'Customer with this email already exists.' });
            //res.redirect('/register');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new customer
        customer = new Customer({
            name,
            email,
            password: hashedPassword, // Save the hashed password
            address
        });

        await customer.save();
        //req,flash is not a function//req.flash('success_msg', 'You are now registered, so you can log in');
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


/* // Login
 @function: router.get, setting routing to  rendering the login view
 @purpose:  setting routing to  rendering the 'login' view
 @called_from: middlewear route
 @input: req,res (web request and response structures)
 @output: none, but rendering the login view
 @algorithm: GET request `/login` - Login  a customer (previousely registered).
*/
router.get('/login', (req, res) => res.render('login'));


/*  
 @function: router.post, setting routing to  login a previousely registred customer.
 @purpose:  setting routing to  'login' function'
 @called_from: middlewear route
 @input: req,res (web request and response structures)
 @output: none, but rendering the main (index.ejs) view with updated menu "Welcome [user1]"
 @algorithm: Handle login. POST request '/login' - Login a ustomer, see also comments below, it checks if  the
             customer has been registred, shows error if not
*/
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    try {
        // Find the customer by email
        const customer = await Customer.findOne({ where: { email } });//const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(400).send('No user found with that email.');
        }

        // Check if the password field is present
        if (!customer.password) {
            return res.status(400).send('Password not set for this user.');
        }

        console.log("Password entered='"+password+"'");
        console.log("Password from DB='"+customer.password+"'");

        // Compare password with hash
        //const isMatch = await(password==customer.password);//bcrypt.compare(password, customer.password);
        const isMatch = await bcrypt.compare(password, customer.password);

        console.log(`Password entered='${password}', Password from DB='${customer.password}', isMatch=${isMatch}`);

        if (isMatch) 
        {
            // Authentication successful
            /*req.login(customer, (err) => {
                if (err) return next(err);
                res.redirect('/profile'); // or wherever you want to redirect
            });*/
            // Manually set session or login state
          req.session.customer = {
            id: customer.id,
            name: customer.name,
            email: customer.email
         };

          res.redirect('/'); // Redirect to homepage or other page on successful login

        } 
        else 
        {
            // Authentication failed
            //res.status(400).send('Incorrect password...');
            return res.render('login', { errorMessage: 'Incorrect password!' });
       
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});



/* 
 @function: router.get, setting routing to  logout 
 @purpose:  setting routing to 'logout' 
 @called_from: middlewear route
 @input: req,res (web request and response structures)
 @output: none, but rendering the updated main view  '/' view (views/index.ejs)
 @algorithm: GET request '/logout' - logs out the current customer, rendering the main '/' view (views/index.ejs)
 */

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect('/');
      }
      res.redirect('/');
    });
  });
  

module.exports = router;
