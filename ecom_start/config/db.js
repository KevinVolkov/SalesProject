const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ecommercedb', 'root', process.env.MYSQL_ROOT_PASS, { //kevin's comment change 'meta' to your MySQL password
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
    if(err.toString().indexOf("ConnectionRefusedError")!=-1) //Kevin 11/12/23 This happened to Irvin, so I just show such message, not error
      console.log("Error!!! ConnectionRefusedError 0, probably MySQL Service is not running on this computer");
    else //old case
      console.error('0 Unable to connect to MySQL:', err);
  });

module.exports = sequelize;