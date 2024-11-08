const { Sequelize } = require('sequelize');  // Import the Sequelize class

const sequelize = new Sequelize('ecommerceDB', 'root', 'bigbutt40', { //kevin's comment change 'meta' to your MySQL password
  host: 'localhost',
  dialect: 'mysql',
  //logging: console.log,
  logging: false, // Disable logging if you prefer
  //sync: { alter: true } // Enables synchronization but ensures no unnecessary modifications

});

// add call to sync() to log the results of the sync process
sequelize.sync({ alter: { drop: false } })  // if a new column is no longer present in the model, it will not be removed from the table
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch(error => {
    console.error('Error synchronizing the database:', error);
  });

/*
Whenever you call methods that require a connection to the database, such as sequelize.sync(), 
it checks if the connection to the database is valid. If the connection is not established, 
it will internally invoke sequelize.authenticate() to try to connect to the database. 
If authenticate() fails, it throws an error, which is caught by your catch block, 
and you will see the corresponding error message printed.
*/
sequelize.authenticate()
  .then(() => {
    console.log('Connected to MySQL via Sequelize');
  })
  .catch(err => {
    console.error('Unable to connect to MySQL:', err);
  });

module.exports = sequelize; //export the sequelize object (connection) to be used in other files
