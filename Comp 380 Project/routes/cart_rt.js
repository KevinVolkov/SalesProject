// cart_rt.js
// Router for managing cart operations, including viewing, adding, updating, and clearing cart items.

// Core modules
const express = require("express");
const path = require("path");

//third party modules
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config(); // Load environment variables


// Custom middleware
const verifyCartAccessToken = require("../middleware/verifyCartAccessToken");
const verifyLogin = require("../middleware/verifyLogin");

// Create a new router object
const router = express.Router();

// Middleware setup
router.use(express.static(path.join(__dirname, "public"))); // Serve static files
router.use(cookieParser()); // Parse cookies in request headers

// Utility functions
// Generate cart access token, valid for 1 day
const generateCartAccessToken = (cartData) => {
  return jwt.sign({ cart: cartData }, process.env.CART_ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

// Calculate time remaining for token expiration
function calculateTimeRemaining(timeInSecondsLeft) {
  const days = Math.floor(timeInSecondsLeft / (24 * 60 * 60));
  const hours = Math.floor((timeInSecondsLeft % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((timeInSecondsLeft % (60 * 60)) / 60);
  const seconds = timeInSecondsLeft % 60;
  return { days, hours, minutes, seconds };
}

// Routes

// Route to check cart access token expiration time
router.route("/token_status").get((req, res) => {
  const accessToken = req.cookies.cartAccessToken;
  if (!accessToken) {
    console.log("No cart access token found!"); // Log to terminal
    return res.status(403).json({ message: "No cart access token found!" });
  }

  try {
    const accessTokenPayload = jwt.verify(accessToken, process.env.CART_ACCESS_TOKEN_SECRET, { complete: true });
    const currentTime = Math.floor(Date.now() / 1000);
    const accessTokenSecondsLeft = accessTokenPayload.payload.exp ? accessTokenPayload.payload.exp - currentTime : 0; 

    const accessTokenTimeRemaining = calculateTimeRemaining(accessTokenSecondsLeft);

    const accessExpirationText = `Cart Access Token Expires In: ${accessTokenTimeRemaining.days} days ${accessTokenTimeRemaining.hours} hours ${accessTokenTimeRemaining.minutes} minutes ${accessTokenTimeRemaining.seconds} seconds`;


    console.log(accessExpirationText); // Log to terminal
    return res.status(200).json({ accessExpirationText });
  } catch (err) {
    return res.status(403).json({ message: "Invalid cart access token. Cannot display time remaining." });
  }
});

// Route to render cart page with EJS (GET request)
router.route("/").get(verifyLogin, verifyCartAccessToken, (req, res) => {
  const cart = req.cart || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0);
  const loggedIn = req.isLoggedIn;

  res.render("cart", {
    cart,
    totalItems,
    totalPrice,
    loggedIn,
    siteName: "Worst Buy",
  });
});

// Route to get cart items
router.route("/cartItems").get(verifyCartAccessToken, (req, res) => {
  try {
    const cart = req.cart || [];
    res.status(200).json({ cart });
  } catch (err) {
    console.error("Error getting cart items:", err); // Log to terminal
    res.status(400).json({ message: "Error getting cart items: " + err });
  }
});

// Route to add item to the cart
router.route("/add").post(verifyCartAccessToken, (req, res) => {
  const { productId, name, quantity, price, image_path } = req.body;
  const floatPrice = parseFloat(price);
  let cart = req.cart || [];

  try {
    const existingItem = cart.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ productId, name, quantity, price: floatPrice, image_path });
    }

    const accessToken = generateCartAccessToken(cart);
    res.cookie("cartAccessToken", accessToken, { httpOnly: true });
    console.log("Item added to cart!"); // Log to terminal
    res.status(200).json({ message: "Item added to cart successfully", cart });
  } catch (err) {
    console.error("Error adding item to cart:", err); // Log to terminal
    res.status(400).json({ message: "Error adding item to cart: " + err });
  }
});

// Route to update item quantity in the cart
router.route("/update").put(verifyCartAccessToken, (req, res) => {
  const { productId, quantity } = req.body;
  let cart = req.cart || [];

  try {
    const existingItem = cart.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity = quantity;
    }

    const accessToken = generateCartAccessToken(cart);
    res.cookie("cartAccessToken", accessToken, { httpOnly: true });
    console.log("Cart updated!"); // Log to terminal
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (err) {
    console.error("Error updating cart:", err); // Log to terminal
    res.status(400).json({ message: "Error updating cart: " + err });
  }
});

// Route to remove item from the cart
router.route("/remove").delete(verifyCartAccessToken, (req, res) => {
  const { productId } = req.body;
  let cart = req.cart || [];

  try {
    cart = cart.filter((item) => item.productId !== productId);
    const accessToken = generateCartAccessToken(cart);
    res.cookie("cartAccessToken", accessToken, { httpOnly: true });
    console.log("Item removed from cart!"); // Log to terminal
    res.status(200).json({ message: "Item removed from cart successfully", cart });
  } catch (err) {
    console.error("Error removing item from cart:", err); // Log to terminal
    res.status(400).json({ message: "Error removing item from cart: " + err });
  }
});

// Route to clear all items from the cart
router.route("/clear").delete(verifyCartAccessToken, (req, res) => {
  const cart = [];

  try {
    const accessToken = generateCartAccessToken(cart);
    res.cookie("cartAccessToken", accessToken, { httpOnly: true });
    console.log("Cart cleared!"); // Log to terminal
    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (err) {
    console.error("Error clearing cart:", err); // Log to terminal
    res.status(400).json({ message: "Error clearing cart: " + err });
  }
});

module.exports = router;
