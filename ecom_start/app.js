// app.js
// Built-in Modules
const express = require('express'); // Web framework
const bodyParser = require('body-parser'); // Middleware for parsing request bodies
const fs = require('fs'); // File system module
const path = require('path'); // Path utilities
const https = require('https'); // HTTPS server

// Third-Party Modules
const nodemailer = require('nodemailer'); // Email sending library
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key'); // Stripe payment gateway
const bcrypt = require('bcryptjs'); // Password hashing library
const session = require('express-session'); // Session management middleware
const flash = require('connect-flash'); // Flash messages middleware

// Database and Model Imports
const sequelize = require('./config/db'); // Database connection
const createDatabase = require('./config/createDatabase'); // Database creation function
const populateItemsIfEmpty = require('./config/populateItems'); // Populate items function
const Customer = require('./models/Customer'); // Customer model
const customerRoutes = require('./routes/customers'); // Customer routes
const itemsRoute = require('./routes/items'); // Items routes
const orderRoute = require('./routes/order'); // Order routes

// SSL Configuration
sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'privkey1.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert1.pem')),
  ca: fs.readFileSync(path.join(__dirname, 'certs', 'chain1.pem')),
};


// Initialize Express App
const app = express();

//app configuration middleware
app.use(express.static('public')); // Serve static files from the 'public' directory
app.set('view engine', 'ejs'); // Set view engine to EJS
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Session and Middleware Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey', // Use environment variable for session secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true in production with HTTPS
}));
app.use(flash());


// Middleware to Set Local Variables
app.use((req, res, next) => {
  res.locals.customer = req.session.customer || null;
  res.locals.cartCount = (req.session.cart || []).length;
  next();
});

// Route Handlers
app.use('/customers', customerRoutes);
app.use('/items', itemsRoute);
app.use('/order', orderRoute);

// Main Routes
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Welcome to ABC Sales',
    user: req.user,
    cartCount: res.locals.cartCount
  });
});

app.get('/checkout', (req, res) => {
  if (!req.session.customer) {
    return res.redirect('/customers/login');
  }
  res.render('checkout', {
    customer: req.session.customer,
    user: req.user
  });
});

app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Please Login to ABC Sales',
    user: req.user
  });
});

app.get('/register', (req, res) => {
  res.render('register', {
    title: 'Please Register with ABC Sales',
    user: req.user
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.redirect('/');
    res.redirect('/');
  });
});

// Database Initialization
async function initializeDatabase() {
  try {
    console.log('Creating database...');
    await createDatabase();

    console.log('Starting database synchronization...');
    await sequelize.sync({ alter: { drop: false } });

    console.log('Populating items if empty...');
    await populateItemsIfEmpty();

    console.log('initializeDatabase() COMPLETE: MySQL database initialized successfully!');
  } catch (error) {
    console.error('initializeDatabase() FAILED: Unable to connect to MySQL:', error);
  }
}

// Launch Site Function
async function launchSite() {
  await initializeDatabase();

  try {
    const server = https.createServer(sslOptions, app);
    const PORT = process.env.PORT || 443; // Use environment variable for port
    server.listen(PORT, () => {
      console.log(`Server started on https://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    // end the server
    process.exit(1);
  }
}

// Driver Code
launchSite();
