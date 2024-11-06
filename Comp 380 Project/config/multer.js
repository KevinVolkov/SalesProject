//multer.js
// config for multer which is a middleware for handling file uploads
const multer = require("multer");
const path = require("path");

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads")); // Set the upload destination
  },
  filename: (req, file, cb) => {
    // Save file with a unique name
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp to avoid filename collisions
  },
});

// Create a multer instance with the storage configuration which will be used to handle file uploads
const upload = multer({ storage: storage }); 


module.exports = upload; // Export the configured multer instance
