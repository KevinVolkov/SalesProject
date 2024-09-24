//Kevin Volkov: and this is orderControler
//Model–view–presenter (MVP) is a derivation of the model–view–controller (MVC) architectural pattern, 
//and is used mostly for building user interfaces.
const Customer = require('../models/Customer'); 
const nodemailer = require('nodemailer'); 
const stripe = require('stripe')('your_stripe_secret_key'); 
 
exports.createOrder = async (req, res) => { 
  // Assuming req.body contains customer and order data 
  const { name, email, address, items, totalAmount, token } = req.body; 
 
  // Process payment 
  try { 
    const charge = await stripe.charges.create({ 
      amount: totalAmount * 100, 
      currency: 'usd', 
      source: token, 
      description: `Purchase by ${name}` 
    }); 
 
    // Save customer and order to the database 
    const customer = new Customer({ name, email, address }); 
    await customer.save(); 
 
    // Send confirmation email 
    const transporter = nodemailer.createTransport({ 
      service: 'gmail', 
      auth: { 
        user: 'your_email@gmail.com', 
        pass: 'your_email_password' 
      } 
    }); 
 
    const mailOptions = { 
      from: 'your_email@gmail.com', 
      to: email, 
      subject: 'Order Confirmation', 
      text: `Thank you for your purchase! Your order is being processed.` 
    }; 
 
    transporter.sendMail(mailOptions, (error, info) => { 
      if (error) { 
        return console.log(error); 
      } 
      console.log('Email sent: ' + info.response); 
    }); 
 
    res.redirect('/confirmation.html'); 
  } catch (err) { 
    console.error(err); 
    res.status(500).send('Error processing order'); 
  } 
};