const mysql = require('mysql2/promise');

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root', //Kevin: dod not change, it is allways 'root'
    password: process.env.MYSQL_ROOT_PASS,//'meta', // Kevin's comment: Update with your MySQL password 
  });

  const dbName = 'ecommercedb'; // Database name, kevin 11/09/24 fixed allways use lower case, easier

  // Check if the database exists and create it if it doesn't
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
  console.log(`Database "${dbName}" checked/created successfully.`);

  await connection.end();//Kevin: OK created, let us close the connection after creation, later will open another
}

module.exports = createDatabase;
