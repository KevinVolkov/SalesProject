const { Sequelize } = require('sequelize');

// Connect to a default MySQL database (e.g., 'mysql')
const sequelize = new Sequelize('mysql://root:'+process.env.MYSQL_ROOT_PASS+'@localhost:3306/mysql',
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,  // Disable logging entirely
  }
); // Change 'mysql' to any valid database, I used sys

async function createDatabaseIfNotExists() {
  try {
    // Step 1: Connect to MySQL and authenticate
    await sequelize.authenticate();
    console.log('Connection to default database has been established successfully.');

    // Step 2: Check if the database exists
    const result = await sequelize.query("SHOW DATABASES LIKE 'ecommercedb'");
    if (result[0].length === 0) {
      // If the database doesn't exist, create it
      console.log('Database does not exist. Creating database...');
      await sequelize.query('CREATE DATABASE `ecommercedb`');
      console.log('Database created successfully!');
    } else {
      console.log('Database already exists.');
    }

    // Step 3: Now, use the newly created (or existing) database
    // Authenticate again using the actual database
    const sequelizeWithDB = new Sequelize('ecommercedb', 'root', process.env.MYSQL_ROOT_PASS, {  //
      host: 'localhost',
      dialect: 'mysql',
      logging: false,  // Disable logging entirely
    });

    await sequelizeWithDB.authenticate();
    console.log('Connection to the target database has been established successfully.');
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    // Step 4: Close the connection after operations
    //No do not close!!! Kevin await sequelize.close();
  }
}

// Call the function to check and create the database if it doesn't exist
createDatabaseIfNotExists();


module.exports = sequelize;
