//Kevin Volkov: 10/08/24 This is the main app.js file which start everything: connects to DB, etc ....
//backend

const express = require('express');//express is node.js web app infrastructure
const mongoose = require('mongoose');/still mongo will be passing to MySQL Soon
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const stripe = require('stripe')('your_stripe_secret_key');
const bcrypt = require('bcryptjs');

//new start **************************************************************

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Customer = require('./models/Customer');
const session = require('express-session');
const flash = require('connect-flash');

const customerRoutes = require('./routes/customers');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));



app.use('/customers', customerRoutes);
//***
// Setup session middleware
app.use(session({ secret: 'yourSecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Passport Local Strategy for login
// /config/passport.js (or equivalent)
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
      try {
          const customer = await Customer.findOne({ email });

          if (!customer) {
              return done(null, false, { message: 'No user found with that email.' });
          }

          // Ensure customer.password is not undefined
          if (!password || !customer.password) {
              return done(null, false, { message: 'Invalid credentials.' });
          }

          // Compare password
          const isMatch = await bcrypt.compare(password, customer.password);

          if (isMatch) {
              return done(null, customer);
          } else {
              return done(null, false, { message: 'Incorrect password!' });
          }
      } catch (err) {
          return done(err);
      }
  }
));
// Serialize and deserialize customer
passport.serializeUser((customer, done) => done(null, customer.id));
passport.deserializeUser(async (id, done) => {
  try {
    const customer = await Customer.findById(id);
    done(null, customer);
  } catch (error) {
    done(error);
  }
});
//new end *****************************************************************



// Set the view engine to ejs
app.set('view engine', 'ejs');
//Kevin: still mongo will be passing to MySQL Soon
// Connect to MongoDB
//mongoose.connect('mongodb://localhost:27017/ecommerceDB', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect('mongodb://localhost:27017/ecommerceDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB', err));



// Routes
const itemsRoute = require('./routes/items');
const orderRoute = require('./routes/order');
app.use('/items', itemsRoute);
app.use('/order', orderRoute);
/*
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});*/

app.get('/', (req, res) => {
  res.render('index', {
      title: 'Welcome to ABC Sales',
      user: req.user // Pass user info if needed
  });
});

// Other middleware and configurations...

// Include routes for login, register, and logout
app.get('/login', (req, res) => {
 // res.render('login');
 res.render('login', {
  title: 'Please Login to ABC Sales',
  user: req.user // Pass user info if needed
});
});

app.get('/register', (req, res) => {
   res.render('register', {
   title: 'Please Register with ABC Sales',
   user: req.user // Pass user info if needed
 });
 });


app.get('/logout', (req, res) => {
  req.logout();  // Use this if Passport.js is being used
  res.render('logout');
});


app.listen(3000, () => {
  console.log('Server started on port 3000');
});
