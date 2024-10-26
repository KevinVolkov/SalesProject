const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ecommerceDB', 'root', 'meta', { //kevin's comment change 'meta' to your MySQL password
  host: 'localhost',
  dialect: 'mysql',
  //logging: console.log,
  logging: false, // Disable logging if you prefer
  //sync: { alter: true } // Enables synchronization but ensures no unnecessary modifications

});

/*
// Sync all models with the database
// Add this in your models' sync call
sequelize.sync({ alter: { drop: false } })  // Prevent repeated key alterations
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch(error => {
    console.error('Error synchronizing the database:', error);
  });
*/


sequelize.authenticate()
  .then(() => {
    console.log('Connected to MySQL via Sequelize');
  })
  .catch(err => {
    console.error('Unable to connect to MySQL:', err);
  });

module.exports = sequelize;
