// middleware/verifyLogin.js
const jwt = require("jsonwebtoken");

//middleware to verify if logged in
const verifyLogin = (req, res, next) => {

    req.user = null; // Initialize the user object in the request
    
    // Check if the user is logged in
    if (!req.cookies.accessToken) { // If there is no access token in the cookies
      req.isLoggedIn = false; // Not logged in
      return next(); // Proceed to the next middleware or route
    }
  
    // Verify the access token
    jwt.verify(req.cookies.accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        req.isLoggedIn = false; // Not logged in if token is invalid
      } else {
        req.isLoggedIn = true; // User is logged in
        req.user = user; // Attach the user object to the request
      }
      next(); // Proceed to the next middleware or route
    });
  };

module.exports = verifyLogin; // Export the middleware