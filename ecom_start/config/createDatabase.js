const mysql = require('mysql2/promise');

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root', //Kevin: dod not change, it is allways 'root'
    password: 'meta', // Kevin's comment: Update with your MySQL password 
  });

  const dbName = 'ecommercedb'; // Database name

  // Check if the database exists and create it if it doesn't
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
  console.log(`Database "${dbName}" checked/created successfully.`);

  await connection.end();
}

module.exports = createDatabase;
