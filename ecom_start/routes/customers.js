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
        let customer = await Customer.findOne({ email });
        if (customer) {
            return res.status(400).send('Customer with this email already exists.');
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
        const customer = await Customer.findOne({ email });

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
        const isMatch = await bcrypt.compare(password, customer.password);
        console.log(`Password entered='${password}', Password from DB='${customer.password}', isMatch=${isMatch}`);

        if (isMatch) {
            // Authentication successful
            req.login(customer, (err) => {
                if (err) return next(err);
                res.redirect('/profile'); // or wherever you want to redirect
            });
        } else {
            // Authentication failed
            res.status(400).send('Incorrect password...');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});


// Logout
router.get('/logout', customerController.logout);

module.exports = router;
