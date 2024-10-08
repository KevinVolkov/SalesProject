//Kevin Volkov: This is the main app.js file which start everything: connects to DB, etc ....
//backend 
const express = require('express'); //express is node.js web app infrastructure
const mongoose = require('mongoose'); //still mongo will be passing to MySQL Soon
const bodyParser = require('body-parser'); 
const nodemailer = require('nodemailer'); 
const stripe = require('stripe')('your_stripe_secret_key'); 
const app = express(); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public')); 
// Set the view engine to ejs 
app.set('view engine', 'ejs'); 
// Connect to MongoDB ,Kevin Volkov: new way to avoid warnings

app.use(express.static(__dirname + '/public'));//Kevin: to fix styles, so they are found

mongoose.connect('mongodb://localhost:27017/ecommerceDB') 
.then(() => console.log('Connected to MongoDB')) 
.catch(err => console.log('Failed to connect to MongoDB', err)); 



// Routes 
const itemsRoute = require('./routes/items'); 
const orderRoute = require('./routes/order'); 
app.use('/items', itemsRoute); 
app.use('/order', orderRoute); 
app.get('/', (req, res) => { 
res.sendFile(__dirname + '/views/index.html'); 
}); 
app.listen(3000, () => { 
console.log('Server started on port 3000'); 
}); 