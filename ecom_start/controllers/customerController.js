const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');


exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newCustomer = new Customer({
          name,
          email,
          password: hashedPassword
      });

      await newCustomer.save();
      req.flash('success_msg', 'You are now registered and can log in');
      res.redirect('/login');
  } catch (err) {
      console.error(err);
      res.redirect('/register');
  }
};



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

// Logout
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};
