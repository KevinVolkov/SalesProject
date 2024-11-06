// sslConfig.js is used to load the SSL certificates from the certs folder 
// and export them to be used in the server.js file.

const fs = require('fs');
const path = require('path');

let sslOptions;
try {
  sslOptions = {
    key: fs.readFileSync(path.join(__dirname, "../certs", "privkey3.pem")),
    cert: fs.readFileSync(path.join(__dirname, "../certs", "cert3.pem")),
    ca: fs.readFileSync(path.join(__dirname, "../certs", "chain3.pem")),
  };
  console.log("SSL certificates for https server loaded successfully.");
} catch (error) {
  console.error("Failed to load SSL certificates:", error);
  process.exit(1);
}


module.exports = sslOptions;
