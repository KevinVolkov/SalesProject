const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const Item = require('../models/Item');//this is correct path notice '..'



//router.post('/add-to-cart', orderController.addToCart);
//start mysql changes **********************
// Add to Cart route
//router.post('/cart/add', async (req, res) => {
router.post('/add-to-cart', async (req, res) => {
    const itemId = req.body.itemId; // the ID of the item being added
    const quantity = parseInt(req.body.quantity) || 1; // default quantity to 1 if not provided

    try {
        console.log("Selected itemId=["+itemId+"]");
        const item = await Item.findByPk(itemId); // find the item using Sequelize

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Check if the cart exists in session, if not create it
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Add item to cart
        const cartItem = {
            itemId: item.id,
            name: item.name,
            price: item.price,
            quantity: quantity
        };

        req.session.cart.push(cartItem); // add item to the session's cart array

        res.redirect('/order/cart'); // redirect to the cart view
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while adding item to cart" });
    }
});


//end mysql changes ************************

router.get('/cart', orderController.viewCart);
router.post('/checkout', orderController.checkout);

//kevin start
// View Cart
//router.get('/cart', orderController.viewCart);

// Proceed to Checkout
router.get('/checkout', (req, res) => {
    res.render('checkout');
});

//Kevin end
//Kevin Volkov 10/27/24 start ****************
// Clear Cart route in routes/order.js
router.post('/clear-cart', (req, res) => {
    req.session.cart = []; // Clear the cart by setting it to an empty array
    res.redirect('/order/cart'); // Redirect back to the cart page or any other page you prefer
  });

//Kevin Volkov 10/27/24 end ******************
module.exports = router;
