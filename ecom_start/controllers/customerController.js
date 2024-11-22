/*
Module name: customerController.js
Date of the code (latest update): 11/21/24
-----------------------------------------------------------------------------------------------
Programmer: Kevin Volkov /student, CSUN COMP 380, Group #6/
-----------------------------------------------------------------------------------------------
Description: Middle-Tier module. Handles authentication-related actions like login, registration, and logout.
*/


const Customer = require('../models/Customer');// get Customer schema/structure as a type/class
const bcrypt = require('bcryptjs');;// get bcryptjs object for one-way encryption functions

/* 
 @function: register 
 @purpose:  provides register algorithm in web interface to register new Customer
 @called_from: /routes/customer.js
 @input: req,res (web request and response structures)
 @output: calls to render Login View (effectievely calling /views/login.ejs) if succesfull or Register View
          (/views/register.ejs) if registration fails.
 @algirithm: saves new registred customer in the database, see also comments below
*/
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
      const hashedPassword = await bcrypt.hash(password, 10);//one-way hashing

      const newCustomer = new Customer({
          name,
          email,
          password: hashedPassword
      });

      await newCustomer.save();//saves the new registred customer in the database
      req.flash('success_msg', 'You are now registered and can log in');
      res.redirect('/login');
  } catch (err) {
      console.error(err);//show him the error this simple way
      res.redirect('/register');//no luck, do it again, the Register View is registered
  }
};


/* 
 @function: login 
 @purpose:  provides login algorithm in web interface to login a Customer
 @called_from: /routes/customer.js
 @input: req,res (web request and response structures)
 @output: calls to render the main page , if login is OK.
 @algirithm: takes a password from the web request body , hashes it and checks with the one in DB. 
             Redirects to the main view (/vews/index.ejs). See also comments below
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
      // Find the customer by email
      const customer = await Customer.findOne({  where: { email }  });
      if (!customer) {
          return res.status(400).render('login', { error: 'Email not found. Please register first.' });
      }

      console.log("Password entered='"+password+"'");
      console.log("Password from DB='"+customer.password+"'");

      // Compare the entered password with the stored hashed password
      const isMatch = await (password==customer.password);//await bcrypt.compare(password, customer.password);
      if (!isMatch) {
          return res.status(400).render('login', { error: 'Incorrect password!!!' });
      }

      // Password matched, proceed with login
      req.session.customerId = customer._id; // Store customer ID in session
      res.redirect('/');
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error.');
  }
};

/* 
 @function: logout 
 @purpose:  provides logout algorithm in web interface to logout a Customer
 @called_from: /routes/customer.js
 @input: req,res (web request and response structures)
 @output: calls to render the main page , after invouking req.logout() function (part of session)
 @algirithm: takes a password from the web request body , hashes it and checks with the one in DB. 
             Redirects to the main view (/vews/index.ejs). See also comments below
 */
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};
