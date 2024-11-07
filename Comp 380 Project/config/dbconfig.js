//dbconfig.js is a module that verifies the database and initializes it if it doesn't exist.
// It also checks the integrity of the tables in the database and creates them if they don't exist.

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

// Function to run the schema.sql on a db connection
async function applySchema(conn) {
  try {
    // Read schema from file
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, "../schema.sql"), // Go back one directory and read schema.sql
      "utf-8"
    );
    await conn.query(schemaSQL);
    console.log("Database schema applied.");

    //hash the passwords of all default schema accounts 
    // Fetch all users' passwords
    const [users] = await conn.query("SELECT id, password FROM users");

    // loop through all default schema users and hash their passwords
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10); // Hash the password
      await conn.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, user.id]); // Update the password
      console.log(`Password for user ${user.id} has been encrypted.`);
    }
    console.log("All default schema accounts' passwords have been encrypted.");

  } catch (error) {
    console.error("ERROR while applying schema:", error);
    throw error; // Re-throw the error for further handling
  }
}

// Function to verify if a table exists
async function checkTableExists(conn, table) {
  const [result] = await conn.query("SHOW TABLES LIKE ?", [table]);
  return result.length > 0; // Return true if table exists
}

// Function to verify tables (used when db exists but unsure if it has necessary tables)
async function verifyTables(conn, verifyCount = 0) {
  const tables = ["users", "products"]; // Tables used in the schema

  for (const table of tables) {
    try {
      const tableExists = await checkTableExists(conn, table); // Check if table exists

      if (tableExists) {
        console.log(`Table '${table}' exists.`);
      } else {
        console.log(`Table '${table}' does not exist. Assuming db has invalid data. Running full schema...`);
        await applySchema(conn); // Apply schema to rebuild all db data using schema.sql

        // Verify table again after applying schema
        if (verifyCount >= 1) {
          throw new Error("Table verification failed TWICE. Please check the database or schema.");
        }
        await verifyTables(conn, verifyCount + 1); // Recursively verify table if verified once or less
      }
    } catch (error) {
      console.error(`Error verifying table '${table}':`, error);
      throw error; // Re-throw the error to propagate it to the outer catch block
    }
  }
}

// Main function to verify and initialize the database
async function verifyDatabase() {
  console.log("Initializing database...");

  const pool = mysql.createPool({
    // Create a connection pool
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    multipleStatements: true //**  Allow multiple statements to be executed (needed for schema.sql)

  });

  let conn; // Connection variable

  try {
    conn = await pool.getConnection(); // Get a connection from the pool

    // Check if the database exists
    const [databases] = await conn.query("SHOW DATABASES LIKE ?", [
      process.env.DB_NAME,
    ]);

    if (databases.length > 0) {
      // If database already exists, verify tables
      console.log(`Database '${process.env.DB_NAME}' already exists.`);
      await conn.query(`USE ${process.env.DB_NAME}`); // Use the database to verify tables

      // Check integrity of tables in the database
      await verifyTables(conn);
    } else {
      // Create the database if it doesn't exist
      await conn.query(`CREATE DATABASE ${process.env.DB_NAME}`); // Create the database
      console.log(`Database '${process.env.DB_NAME}' has been created.`);
      await conn.query(`USE ${process.env.DB_NAME}`); // Use the database to run schema.sql on it

      // Run schema to create tables
      await applySchema(conn);
    }
    console.log("Database has been SUCCESSFULLY verified and is ready.");
  } catch (error) {
    console.error("ERROR initializing database:", error);
    throw error; // Re-throw the error to propagate it to the outer catch block (launchSite in server.js)
  } finally {
    if (conn) conn.release(); // Release the connection back to the pool
  }
}



// Export the main function for use in server.js
module.exports = { verifyDatabase };

