/*
Module name: orderController.js
Date of the code (latest update): 11/21/24
-----------------------------------------------------------------------------------------------
Programmers: Kevin Volkov, Joaquin Banting /students, CSUN COMP 380, Group #6/
-----------------------------------------------------------------------------------------------
Description: MIddle-Tier module. Handles checkout, saving orders, and interacting with the cart
             and orders for the customer. Calls sendConfirmationEmail function to send confirmation 
             email to the customer.
*/

const Customer = require('../models/Customer'); // get Customer schema/structure as a type/class
const Item = require('../models/Item'); //get Item schema/structure as a type/class

const sendConfirmationEmail = require('../utils/mailer'); // get sendConfirmationEmail

let cart = [];//cart is empty array initialy (global)

/* 
 @function: viewCart 
 @purpose:  provides View Cart algorithm in web interface to render cart contents
 @called_from: /routes/order.js
 @input: req,res (web request and response structures)
 @output: calls to render cart (effectievely calling /views/cart.ejs passing cart structure as a parameter
 @algorithm: clear from the code and comments below
*/
exports.viewCart = (req, res) => {
    const cart = req.session.cart || []; // retrieve the cart from session, or default to empty array

    if (cart.length === 0) {
        return res.render('cart', { cart, message: "Your cart is empty." });
    }

    res.render('cart', { cart, message: null });
};


/* 
 @function: checkout 
 @purpose:  provides checkout algorithm in web interface to render checkout view
 @called_from: /routes/order.js
 @input: req,res (web request and response structures)
 @output: calls to render cart (effectievely calling /views/confirmation.ejs passing name, address, email, cart 
          as parameters. Finally calls sendConfirmationEmail to send the confirmation email
 @algorithm: clear from the code and comments below
*/

exports.checkout = async (req, res) => {
    const { name, email, address, creditCard } = req.body;

    // Ensure cart is initialized as an array
    const cart = req.session.cart || [];

    try {
        // Check if the customer is already registered
        //let customer = await Customer.findOne({ email });//Kevin's comment: it did not work this way
        let customer = await Customer.findOne({ where: { email } });

        if (!customer) {
            // Create a new guest customer if they don't exist
            customer = new Customer({
                name,
                email,
                address,
                isRegistered: false // Guest checkout
            });
        } else {
            // Update existing customer details
            customer.name = name;
            customer.address = address;
            await customer.save();
        }

        // Process the order here...

        // Ensure cart is not undefined before calling map
        if (cart.length > 0) {
            // If there are items in the cart, you can process them
            // Example: Extracting item names
           // const itemNames = cart.map(item => item.name); // Adjust according to your cart structure
            //console.log('Items in cart:', itemNames);
                       
            
            
            
            //Kevin 12/03/24 start ********** saving new orders in db fors  registered (or not)  customer
            // Prepare the order data
        const orderData = cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        }));

        // Append the serialized order data to the customer's orders
        const existingOrders = customer.orders || [];
        existingOrders.push(JSON.stringify(orderData));

        // Update the customer's orders in the database
        customer.orders = existingOrders;
        await customer.save();


            //send email here?? //Kevin 10/24/24 10/29/24

            //Kevin 11/09/24: I will add later here cart contents, but probably I'll ask Irvin/Joaquin
            // to add it to make the email more detailed. Kevin 11/21/24 : done by Joaquin

            // Calculate the total price 11/14/24
            const total = (cart.reduce((sum, item) => sum + item.price * item.quantity, 0)).toFixed(2);
            // Extract the last 4 digits of the credit card 11/14/24
            const last4Digits = creditCard.slice(-4); 

            console.log("about to send email in orderController, total="+total+" 4digits="+last4Digits);//12/07/24

            await sendConfirmationEmail(email,name,address,cart,total,last4Digits); // Kevin 10/29/24,  see this line
           //await sendConfirmationEmail(email,name,address); // Kevin 10/29/24, see this line
           console.log('Email has been sent:');


        } else {
            console.log('Cart is empty');
        }

        req.session.cart = []; // I store the cart in the session, clean the cart? Kevin 10/27/24

        // Render confirmation page with name, address, email, and cart
        res.render('confirmation', { name, address, email, cart });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing order/checkout');//Kevin: ugly, but hopefully will never happen
    }
};
