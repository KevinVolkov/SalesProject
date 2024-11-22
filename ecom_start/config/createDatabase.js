/*
Module name: createDatabase.js
Date of the code (latest update): 11/21/24
-----------------------------------------------------------------------------------------------
Programmer: Kevin Volkov /student, CSUN COMP 380, Group #6/
-----------------------------------------------------------------------------------------------
Description: creates MySQL database if it does not exist (first-time run)
            
*/

const mysql = require('mysql2/promise');//get mysql package object to create connection to the DB

/*
 @function: createDatabase 
 @purpose:  creates MySQL database if it does not exist (first-time run)
 @called_from: app.js
 @input: none
 @output: creates 'items' table if it is empty (first-time run)
 @algorithm: runs SQL request 'CREATE DATABASE IF NOT EXISTS ecommercedb'
*/

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root', //Kevin: dod not change, it is allways 'root'
    password: process.env.MYSQL_ROOT_PASS,//'meta', // Kevin's comment this is the password from .env
  });

  const dbName = 'ecommercedb'; // Database name, kevin 11/09/24 fixed allways use lower case, easier

  // Check if the database exists and create it if it doesn't
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
  console.log(`Database "${dbName}" checked/created successfully.`);

  await connection.end();//Kevin: OK created, let us close the connection after creation, later will open another
}

module.exports = createDatabase;
