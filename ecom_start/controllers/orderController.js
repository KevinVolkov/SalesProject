const Customer = require('../models/Customer'); // Adjust path as necessary
const Item = require('../models/Item'); // Adjust path as necessary

const sendConfirmationEmail = require('../utils/mailer'); // Adjust path as necessary

let cart = [];

exports.addToCart = async (req, res) => {
    const itemId = req.body.itemId;
    const item = await Item.findById(itemId);

    if (item) {
        cart.push(item);
    }

    res.redirect('/order/cart');
};


exports.viewCart = (req, res) => {
  res.render('cart', { cart });  // Render the 'cart.ejs' view and pass the cart array to it
};


exports.checkout = async (req, res) => {
    const { name, email, address, creditCard } = req.body;

    // Ensure cart is initialized as an array
    const cart = req.session.cart || [];

    try {
        // Check if the customer is already registered
        let customer = await Customer.findOne({ email });

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
            const itemNames = cart.map(item => item.name); // Adjust according to your cart structure
            console.log('Items in cart:', itemNames);
        } else {
            console.log('Cart is empty');
        }

        // Render confirmation page with name, address, email, and cart
        res.render('confirmation', { name, address, email, cart });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing order');
    }
};
