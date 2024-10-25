const bcrypt = require('bcryptjs');
const Customer = require('../models/Customer');

exports.register = async (req, res) => {
   // const { name, email, password } = req.body;
   const { name, email, password, address } = req.body;

    try {

 // Check if a user with the same email already exists
 let existingCustomer = await Customer.findOne({ email });
 if (existingCustomer) {
     return res.status(400).render('register', { error: 'This Email is already registered.' });
 }

// Hash the password before saving
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

        // Hash the password before saving
       // const hashedPassword = await bcrypt.hash(password, 10);

         // Create a new customer
         const newCustomer = new Customer({
            name,
            email,
            password: hashedPassword, // Store hashed password
            address
        });
        // Save the customer to the database
        await newCustomer.save();

        // Redirect to login page after successful registration
        req.flash('success_msg', 'You are now registered and can log in!');
        //res.redirect('/customers/login');
        res.redirect('/login');
        
    } catch (err) {
        console.error(err);

        if (err.code === 11000) {
            // If there's a Mongo duplicate key error, send an error message
            return res.status(400).render('register', { error: 'Email already exists. Please use a different email.' });
        }
        res.status(500).send('Server error.');
    }
};
