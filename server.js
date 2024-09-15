const express = require('express'); // Import express library for handling HTTP requests
const mysql = require('mysql2/promise'); // Import mysql2 library for database interaction
const path = require('path'); // Import path module to resolve file paths
require('dotenv').config(); // Import dotenv module to read environment variables from a .env file

// Initialize Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Create a MySQL connection pool which will manage the connections automatically even if there are
//multiple simultaneous requests
//host, user, password, and database are read from environment variables in .env to avoid hardcoding sensitive information
const pool = mysql.createPool({ //database for user accounts
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB1_NAME
});



// Handle login requests
// Handle login requests
app.post('/login_request', async (req, res) => { // route not used for a HTML form
  console.log("login post request");
  const { email, password } = req.body; // Extract email and password from the request body
  try {
    // Query the database to find matching user credentials
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (rows.length > 0) {
      res.status(200).json({ message: 'Login successful!' }); // Send success response if credentials are correct
    } else {
      console.error("Invalid credentials MASON WROTE THIS WOW U SEEE ITTT");
      res.status(401).json({ message: 'INVALID Masonic credentials' }); // Send error response if credentials are incorrect
    }
  } catch (error) {
    console.error("An error occurred:", error); // Log the error for debugging
    res.status(500).json({ message: 'Error occurred' }); // Send error response if an exception occurs
  }
});


// Handle register requests
app.post('/register_request', async (req, res) => {
  console.log("register post request")
  const { email, password } = req.body; // Extract email and password from the request body
  try {
    // Insert new user into the database
    await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
    res.status(200).json({ message: 'Registration successful!' }) // Send success response
  } catch (error) {
    res.status(500).json({ message: 'Error occurred' }) // Send error response if an exception occurs
  }
});

// Serve rootindex.html for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'rootindex.html'))
});




// Start the server and specify the domain of your website and the port number
const HOST = '0.0.0.0'; // Listens on all network interfaces
const PORT = process.env.PORT || 3000; // Use environment port or default to 3000

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`)
});

