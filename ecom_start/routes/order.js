const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');



router.post('/add-to-cart', orderController.addToCart);
router.get('/cart', orderController.viewCart);
router.post('/checkout', orderController.checkout);

//evfix start
// View Cart
//router.get('/cart', orderController.viewCart);

// Proceed to Checkout
router.get('/checkout', (req, res) => {
    res.render('checkout');
});

//evfix end

module.exports = router;
