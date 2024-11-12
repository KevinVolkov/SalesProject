const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ecommerceDB', 'root', 'meta', { //kevin's comment change 'meta' to your MySQL password
  host: 'localhost',
  dialect: 'mysql',
  //logging: console.log,
  logging: false, // Disable logging if you prefer
  //sync: { alter: true } // Enables synchronization but ensures no unnecessary modifications

});

//******************************************************************************* */
sequelize.authenticate()
  .then(() => {
    console.log('Connected to MySQL via Sequelize');
  })
  .catch(err => {

    if(err.message.indexOf("Unknown database")!=-1)
      console.log("Error!!! No database, but it will be created after the first run. So, do CTRL-C");
    else
     console.error('Unable to connect to MySQL:', err);
  });

module.exports = sequelize;