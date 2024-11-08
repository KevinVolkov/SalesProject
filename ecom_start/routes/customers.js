const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

const bcrypt = require('bcryptjs');//const bcrypt = require('bcrypt');
const Customer = require('../models/Customer');

// Register
router.get('/register', (req, res) => res.render('register'));
//router.post('/register', customerController.register);

router.post('/register', async (req, res) => {
    const { name, email, password, address } = req.body;

    try {
        // Check if email already exists
        //let customer = await Customer.findOne({ email });
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

// Login
router.get('/login', (req, res) => res.render('login'));

// Handle login
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


// Logout
//router.get('/logout', customerController.logout);
// Logout Route

// customers/logout, not /logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log("Could not destroy session (/customers/logout)");
        return res.redirect('/');
      }
      console.log("Session destroyed successfully (/customers/logout)");
      res.redirect('/');
    });
  });
  

module.exports = router;
