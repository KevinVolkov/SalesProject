/**
 * Module name: app.js
 *  Date of the code (latest update): 11/21/24
 *  -----------------------------------------------------------------------------------------------
 *  Programmers: Kevin Volkov, Irvin Merino, Joaquin Banting /students, CSUN COMP 380, Group #6/
 * ------------------------------------------------------------------------------------------------
 *  Description:  Main application entry point for our app. 
 * - Sets up and configures the Express server.
 * - Connects to the MySQL DB and ensures it is initialized (and populated after the first start).
 * - Configures middleware to handle requests, parsing data, sessions (cookies!!!)  authentication.
 * - Defines the routes structure to handle user actions (Kevin: later we will add actions!)
 * - Errors handling (could be better, but now time for now)
 * - Starts the https server on TCP Port 443, and listens for incoming requests.
 * This is the the backbone of the whole application, handling interactions between 
 * controllers, views, models, and utilities.
 *
 * Usage:
 * Run this file using Node.js to start the application:
 *   'node app.js'
 * 
 * what helped a lot:
 * https://buttercms.com/blog/nodejs-ecommerce-how-to-build-a-shopping-app-with-buttercms/ and 
 * https://dev.to/jamesoyanna/developing-a-fullstack-e-commerce-application-with-typescript-4ni6
 * https://medium.com/geekculture/how-i-built-an-e-commerce-api-with-nodejs-express-and-mongodb-7b42b5253ffb
 * https://taglineinfotechus.medium.com/mastering-node-js-a-step-by-step-guide-to-building-a-powerful-ecommerce-app-d6cc7df69c12
 * https://www.prioxis.com/blog/nodejs-ecommerce-app
 * however our code is complitely original written line by line
 */

// import the required external libraries (node.js packages)
const express = require('express');//this is "express" framework app
//const mongoose = require('mongoose');
const bodyParser = require('body-parser');//web request response body parser
const nodemailer = require('nodemailer');//utility to send emails
const stripe = require('stripe')('your_stripe_secret_key');//stripe API for server-side 
const bcrypt = require('bcryptjs');//to one-way encoding passwords

require('dotenv').config();//to use process.env vars .env is in the root dir. we only keep there MySQL root package

//Kevin 10/27/24 start want https
const fs = require('fs');//object to use local file system functions
const path = require('path');//object to use 'path'' functions
const https = require('https');//will use this object to start https server with the help of "https" package

// Load SSL certificates (This one self signed, but replace with the paths to my SSL certificate and key when have)
const options = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),  // private key
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem')) // certificate
};//Kevin 10/27/24 end want https

//try to do it after const sequelize = require('./config/db');  // Ensure this points to the right file
const createDatabase = require('./config/createDatabase');//create DB if does not exist
const sequelize = require('./config/db');  // Ensure this points to the right file


const populateItemsIfEmpty = require('./config/populateItems');//populate items table with fake items (if not populated)

//new start **************************************************************

const Customer = require('./models/Customer');// get Customer schema/structure as a type/class
const session = require('express-session');// get session structure as a type/class
const flash = require('connect-flash');

const customerRoutes = require('./routes/customers');//route to customers

const app = express();
//This is what used for cookies, kept in browser
app.use(session({
  secret: 'KevinMyVerySecretKey',//cookie key in browser!
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } //Kevin's comment: I will set it to true in production on my AWS VPS (if succeed)
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.customer = req.session.customer || null; // `customer` is saved in session on login
  //Kevin 10/27/24 start
  const cart = req.session.cart || [];
  res.locals.cartCount = cart.length;
  //Kevin 10/27/24 end
  next();
});


/* 
 @function: startServer() , the name is misnomer , but we did not change it , for understanding the history
 @purpose:  provides checkout algorithm in web interface to render checkout view
 @called_from: app.js initialisation
 @input: none
 @output: none, but creates DB if does not exist (it used to start http/https server in the past, that is why such a name)
 @algorithm: clear from the code and comments below. Process first-time run errors to give better diagnstics.
*/

//Kevin 10/27/24, I declare below for https //const PORT = process.env.PORT || 3001;//3000 was already in use, why?

async function startServer() {
  try {
    // Create the database if it doesn't exist
    await createDatabase();

    // Sync the Sequelize models with the database, No, it adds email_2, email_3
    //await sequelize.sync({ alter: true }); // `alter: true` ensures tables are updated
/* do not do this, I do this before
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`My Server started on port ${PORT}`);
    });*/
  } catch (error) {

    if(error.code=="ECONNREFUSED") //Kevin 11/12/23 This happened to Irvin, so I just show such message, not error
      console.log("Error!!! ECONNREFUSED 1, probably MySQL Service is not running on this computer");
    else //old case
      console.error('1 Unable to connect to MySQL:', error);
  }
}

startServer();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//Route to 'customerRoutes'
app.use('/customers', customerRoutes);


// Set the view engine to ejs
app.set('view engine', 'ejs');

// Connect to MongoDB, Kevin: but I do not use MongoDB any longer...keeping the comment for history
//mongoose.connect('mongodb://localhost:27017/ecommercedb', { useNewUrlParser: true, useUnifiedTopology: true });
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

  if(err.message.indexOf("Unknown database")!=-1)
    console.log("Error!!! No database, 2nd message, but it will be created after the first run. So, do CTRL-C and run 'node app.js' again");
  else
  if(err.toString().indexOf("ConnectionRefusedError")!=-1) //Kevin 11/12/23 This happened to Irvin, so I just show such message, not error
    console.log("Error!!! ConnectionRefusedError 2, probably MySQL Service is not running on this computer");
  else //old case
    console.error('2 Unable to connect to MySQL:', err);
});


//end populating table if empty *********************
/* 
 @function: app.get, setting routing to  rendering the main page /views/index.ejs
 @purpose:  setting routing to  rendering the page /views/index.ejs
 @called_from: app.js initialisation
 @input: req,res (web request and response structures)
 @output: rendering main page
 @algorithm: clear from the code and comments below. 
*/

app.get('/', (req, res) => {
  const cartCount = req.session.cart ? req.session.cart.length : 0;
  res.render('index', {
      title: 'Welcome to ABC Sales',
      user: req.user, // Pass user info if needed
      cartCount: cartCount,//Kevin fix 10/27/24
  });
});


/* 
 @function: app.get setting routing to  rendering /views/checkout.ejs
 @purpose:  routing to  rendering /views/checkout.ejs
 @called_from: app.js initialization
 @input: req,res (web request and response structures)
 @output: rendering checkout page
 @algorithm: clear from the code and comments below. 
*/
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
/* 
 @function: app.get setting routing to  /views/login.ejs
 @purpose:  provides setting routing to  /views/login.ejs
 @called_from: app.js initialization
 @input: req,res (web request and response structures)
 @output: rendering login page
 @algorithm: clear from the code and comments below. 
*/
app.get('/login', (req, res) => {
 // res.render('login');
 res.render('login', {
  title: 'Please Login to ABC Sales',
  user: req.user // Pass user info if needed
});
});


/* 
 @function: app.get setting routing to  /views/register.ejs
 @purpose:  provides setting routing to  /views/register.ejs
 @called_from: app.js initialization
 @input: req,res (web request and response structures)
 @output: rendering 'register' page view
 @algorithm: clear from the code and comments below. 
*/

app.get('/register', (req, res) => {
   res.render('register', {
   title: 'Please Register with ABC Sales',
   user: req.user // Pass user info if needed
 });
 });

 /* 
 @function: app.get setting routing to  logout path
 @purpose:  provides setting routing to  logout path 
 @called_from: app.js initialization
 @input: req,res (web request and response structures)
 @output: originally wanted rendering 'logout page view', but it is not seen at all because the algorithm
          immedeately redirects it to the main page
 @algorithm: simply destroy the session and redirect to the main page
*/

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.redirect('/');
  });
});


//Kevin for "admin" 12/03/24 start
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);
//Kevin for ""admin" 12/03/24 end

/* Kevin Volkov's comment: I now do https , but started from http, keep for history
app.listen(3000, () => {
  console.log('Server started on port 3000');
});*/
const server = https.createServer(options, app);//finally create and run the https server.
// Start the server on port 3000 (or another port)
//already above const PORT = process.env.PORT || 3000;
const PORT = 443;//3000;//process.env.PORT;// || 3001;//3000 already in use, why?
server.listen(PORT, () => {
    console.log(`Server running securely (https) on port ${PORT}`);
});
//Kevin fix: 10/30/24 start
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Perform cleanup, logging, or other actions
  process.exit(1); // Exit the process gracefully
});//10/30/24