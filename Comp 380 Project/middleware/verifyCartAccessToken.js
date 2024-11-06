// middleware/verifyCartAccessToken.js
const jwt = require("jsonwebtoken"); // Import jsonwebtoken package

// Middleware to verify cart access token
const verifyCartAccessToken = (req, res, next) => {
    const accessToken = req.cookies.cartAccessToken;
  
    try {
      // Verify the access token
      const cartData = jwt.verify(
        accessToken,
        process.env.CART_ACCESS_TOKEN_SECRET
      );
      req.cart = cartData.cart; // Attach cart data to the request
    } catch (err) {
      req.cart = []; // If token is invalid or expired, set an empty cart
      console.log("Cart access token is invalid or expired. Please refresh the page. (Also cart data is set to empty)");
    }
  
    next(); // Proceed to the next middleware or route
  };

  //another middleware fn

module.exports = verifyCartAccessToken; // Export the middleware