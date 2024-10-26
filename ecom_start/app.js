const express = require('express');
//const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const stripe = require('stripe')('your_stripe_secret_key');
const bcrypt = require('bcryptjs');

const sequelize = require('./config/db');  // Ensure this points to the right file
const createDatabase = require('./config/createDatabase');
const populateItemsIfEmpty = require('./config/populateItems');

//new start **************************************************************

const Customer = require('./models/Customer');
const session = require('express-session');
const flash = require('connect-flash');

const customerRoutes = require('./routes/customers');

const app = express();

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true in production when using HTTPS
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.customer = req.session.customer || null; // `customer` is saved in session on login
  next();
});


const PORT = process.env.PORT || 3001;//3000 already in use, why?

async function startServer() {
  try {
    // Create the database if it doesn't exist
    await createDatabase();

    // Sync the Sequelize models with the database, No, it adds email_2, email_3
    //await sequelize.sync({ alter: true }); // `alter: true` ensures tables are updated
/* dod not do this, I do this before
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`My Server started on port ${PORT}`);
    });*/
  } catch (error) {
    console.error('Unable to connect to MySQL:', error);
  }
}

startServer();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));



app.use('/customers', customerRoutes);




// Set the view engine to ejs
app.set('view engine', 'ejs');

// Connect to MongoDB
//mongoose.connect('mongodb://localhost:27017/ecommerceDB', { useNewUrlParser: true, useUnifiedTopology: true });
/*
mongoose.connect('mongodb://localhost:27017/ecommerceDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB', err));
*/

// Routes
const itemsRoute = require('./routes/items');
const orderRoute = require('./routes/order');
app.use('/items', itemsRoute);
app.use('/order', orderRoute);
/*
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});*/

//for populating table if empty ******************
// Sync sequelize and then populate items if empty
sequelize.sync().then(async () => {
  console.log('Connected to MySQL');
  
  // Call the function to populate the items table if it's empty
  await populateItemsIfEmpty();
  
  // Start the server after population is complete
 // app.listen(3000, () => {      console.log('Server started on port 3000');  });
}).catch(err => {
  console.error('Unable to connect to MySQL:', err);
});


//end populating tablee if empty *********************
app.get('/', (req, res) => {
  res.render('index', {
      title: 'Welcome to ABC Sales',
      user: req.user // Pass user info if needed
  });
});

// Other middleware and configurations...
app.get('/checkout', (req, res) => {
  if (!req.session.customer) {
      return res.redirect('/customers/login'); // Redirect to login if not authenticated
  }
  res.render('checkout', 
    { 
      customer: req.session.customer,
      user: req.user // Pass user info if needed
    });
});

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

/*
app.get('/logout', (req, res) => {
  req.logout();  // Use this if Passport.js is being used
  res.render('logout',{
    user: req.user // Pass user info if needed
  });
});
*/
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.redirect('/');
  });
});


app.listen(3000, () => {
  console.log('Server started on port 3000');
});
