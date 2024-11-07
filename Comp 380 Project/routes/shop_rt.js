//*** shop_rt.js is the main router for handling the shop page, 
//*** including product search, add, edit, and delete functionality.

// Core modules
const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

// Third-party modules
const cookieParser = require("cookie-parser");
const upload = require("../config/multer"); // Multer config for file upload
require("dotenv").config();


// Imported custom middleware
const verifyCartAccessToken = require("../middleware/verifyCartAccessToken.js");
const verifyLogin = require("../middleware/verifyLogin.js");

// Create a new router object
const router = express.Router();

// Middleware setup
router.use(express.static(path.join(__dirname, "public"))); // Serve static files
router.use(cookieParser());

//** Database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Routes

//** Route for the shop page - Renders products with search functionality
router.route("/").get(verifyLogin, verifyCartAccessToken, async (req, res) => {
  let searchTerm = req.query.search || ""; // Get search term
  const loggedIn = req.isLoggedIn;
  const cart = req.cart || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Calculate total items in cart

  let isAdmin = false; // Set isAdmin to false by default


  try {
    // Fetch products from database
    const [products] = await pool.query("SELECT * FROM products");

    // Filter products based on the search term
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loggedIn) {
      const user = req.user;

      // Check if user is an admin (the query will return an empty array if the user is not an admin)
      const [rows] = await pool.query("SELECT * FROM users WHERE email = ? AND is_admin = 1", [user.email]);
      isAdmin = rows.length > 0; // Set isAdmin to true if user is found, otherwise false
      if(!isAdmin) {
        console.log("User is logged in but not an admin.");
      }
    }

    //if not logged in, isAdmin will always be false (why isAdmin set to false by default)

    // Render shop page with relevant data
    res.render("shop", {
      title: "Shop",
      siteName: "Worst Buy",
      products: filteredProducts,
      searchTerm,
      isAdmin,
      loggedIn,
      totalItems,
      error: null,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.render("shop", {
      title: "Shop",
      siteName: "Worst Buy",
      products: [],
      searchTerm,
      isAdmin,
      loggedIn,
      totalItems,
      error: "Error fetching products from the database.",
    });
  }
});

//** Route to add a new product with file upload
router.route("/add_product").post(upload.single("productImage"), async (req, res) => {
  const { name, price, description } = req.body;
  const image_path = req.file ? req.file.path : null;

  try {
    if (!image_path) {
      console.error("Image upload failed. (/add_product:POST)");
      return res.status(400).json({ message: "Image upload failed, please try again." });
    }

    const relativeImagePath = "/" + path.relative(path.join(__dirname, "../public"), image_path).replace(/\\/g, "/");
    // Insert product into database
    await pool.query("INSERT INTO products (name, price, description, image_path) VALUES (?, ?, ?, ?)", [
      name,
      price,
      description,
      relativeImagePath,
    ]);

    console.log("Product added successfully!");
    res.status(200).json({ message: "Product added successfully!" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: error.message + " (/add_product:POST)" || "Error undefined" });
  }
});

//** Route to edit an existing product with optional file upload
router.route("/edit_product").put(upload.single("productImage"), async (req, res) => {
  const { new_id, name, price, description, product_id } = req.body;

  try {
    // get the image path of the product
    const [rows] = await pool.query("SELECT image_path FROM products WHERE id = ?", [product_id]);

    if (rows.length === 0) {
      console.error("Product to update not found in database. (/edit_product:PUT)");
      return res.status(404).json({ message: "Product to update not found in database." });
    }

    // if req.file is defined, use the new image path, otherwise use the existing image path
    const image_path = req.file ? req.file.path : rows[0].image_path;
    const relativeImagePath = "/" + path.relative(path.join(__dirname, "../public"), image_path).replace(/\\/g, "/");

    const [result] = await pool.query("UPDATE products SET id = ?, name = ?, price = ?, description = ?, image_path = ? WHERE id = ?", [
      new_id,
      name,
      price,
      description,
      relativeImagePath,
      product_id,
    ]);

    // result.affectedRows will be 0 if the product was not found
    if (result.affectedRows === 0) {
      console.error("Product could not update. (/edit_product:PUT)");
      return res.status(404).json({ message: "Product could not update." });
    }

    console.log("Product updated successfully!");
    res.status(200).json({ message: "Product updated successfully!" });
  } catch (error) {
    console.error("Error editing product:", error);
    res.status(500).json({ message: error.message || "Error undefined" });
  }
});

//** Route to delete a product
router.route("/delete_product").delete(async (req, res) => {
  const { product_id } = req.body;

  try {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [product_id]);

    if (result.affectedRows === 0) { 
      console.error("Product to delete does not exist in DB (/delete_product:DELETE).");
      return res.status(404).json({ message: "Product to delete does not exist in DB." });
    }

    console.log("Product deleted successfully!");
    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: error.message + " (/delete_product:DELETE)" || "Error undefined" });
  }
});

// Export the router object
module.exports = router;
