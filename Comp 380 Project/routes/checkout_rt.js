// checkout_rt.js
// This file contains the route for the checkout page, which renders the checkout page with cart data

// Core modules
const express = require("express");
const path = require("path");

// Third-party modules
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Imported controllers
const { send } = require("../controllers/emailController.js");

// Import custom middleware
const verifyCartAccessToken = require("../middleware/verifyCartAccessToken.js");

// Initialize router
const router = express.Router();
router.use(express.static(path.join(__dirname, "public")));
router.use(cookieParser());

// Utility function to generate a new cart access token after checkout
const generateCartAccessToken = (cartData) => {
  return jwt.sign({ cart: cartData }, process.env.CART_ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

// Route to render the checkout page with cart data
router.route("/")
  .get(verifyCartAccessToken, (req, res) => {
    const cart = req.cart || [];

    if (cart.length === 0) {
      return res.redirect("/cart"); // Redirect if cart is empty
    }

    res.render("checkout", {
      cart,
      siteName: "Worst Buy",
    });
  })

  // Route to handle checkout process (POST request)
  .post(verifyCartAccessToken, async (req, res) => {
    const cartData = req.cart || [];
    const checkoutData = req.body.data;
    const paymentData = req.body.paymentInfo;

    if (cartData.length === 0) {
      return res.status(400).json({ message: "Cart is empty!" });
    }

    // Calculate total price for checkout
    const totalPrice = cartData.reduce(
      (sum, item) => sum + item.quantity * parseFloat(item.price),
      0
    );

    // Prepare email data
    const emailData = {
      sender: { email: process.env.WORSTBUY_SENDER_EMAIL },
      to: [{ email: checkoutData.email }],
      subject: 'Worstbuy Checkout Successful!',
      htmlContent: `
        <strong>Your checkout was successful!</strong><br>
        Total price: $${totalPrice.toFixed(2)}<br>
        Order details:<br>
        <ul>
          ${cartData.map(item => `
            <li>${item.name} x${item.quantity} - $${(item.quantity * parseFloat(item.price)).toFixed(2)}</li>
          `).join("")}
        </ul>
        Name: ${checkoutData.name}<br>
        Address: ${checkoutData.address}<br>
        City: ${checkoutData.city}<br>
        State: ${checkoutData.state}<br>
        Zip: ${checkoutData.zip}<br>
        Shipping method: ${checkoutData["shipping-method"]}<br>
        Payment method: ${paymentData.method}<br>
        Total Price: $${totalPrice.toFixed(2)}<br>
      `,
    };

    // Send the email and handle checkout
    try {
      await send(emailData); // Send the email using the email controller
      console.log("Email sent successfully");

      // Clear the cart after successful checkout
      const emptyCart = [];
      const accessToken = generateCartAccessToken(emptyCart);
      res.cookie("cartAccessToken", accessToken, { httpOnly: true });

      res.status(200).json({
        message: "Checkout successful!",
        price: totalPrice.toFixed(2),
        cartData,
        checkoutData,
        paymentData,
      });

    } catch (error) {
      console.error("Error sending email: ", error);
      res.status(500).json({ message: "Error during checkout." });
    }
  });

// Export the router
module.exports = router;
