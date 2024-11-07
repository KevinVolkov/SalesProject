// server.js

// Core modules
const express = require("express");
const path = require("path");
const https = require("https");
const fs = require("fs");

// Third-party modules
const helmet = require("helmet");
require("dotenv").config();

//** Express app initialization
const app = express();

//** Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));

// Set up EJS as the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// custom utils
const { getPublicIP, getAllPrivateIPs } = require("./utils/networkUtils.js");

//** configs
const { verifyDatabase } = require("./config/dbconfig.js");
const sslOptions = require('./config/sslConfig');


//** Routers
const rootRouter = require("./routes/root_rt");
app.use("/", rootRouter);
const authRouter = require("./routes/auth_rt");
app.use("/auth", authRouter);
const shopRouter = require("./routes/shop_rt");
app.use("/shop", shopRouter);
const cartRouter = require("./routes/cart_rt");
app.use("/cart", cartRouter);
const checkoutRouter = require("./routes/checkout_rt");
app.use("/checkout", checkoutRouter);
const myprofileRouter = require("./routes/myprofile_rt");
app.use("/myprofile", myprofileRouter);



//** Start the HTTPS server
async function launchSite() {
  try {
    await verifyDatabase();

    const httpsServer = https.createServer(sslOptions, app); //sslOptions is imported from sslConfig.js
    const HOST = "0.0.0.0";
    const PORT = process.env.PORT || 443;
    const publicIP = await getPublicIP(); //getPublicIP is imported from networkUtils.js
    const privateIPs = await getAllPrivateIPs(); //getAllPrivateIPs is imported from networkUtils.js

    // Format the local/intranet IPs for display
    const localIPsDisplay = privateIPs.map(ip =>
      `https://${ip.address}:${PORT}     (IP Interface: ${ip.interface}, Subnet: ${ip.subnet})`
    ).join('\n');

    httpsServer.listen(PORT, HOST, () => {
      console.log(`
-----------------------------------------------------------------------------------------------------------------
Worst Buy HTTPS Server is running at:
-----------------------------------------------------------------------------------------------------------------
Internal (localhost or loopback IP 127.0.0.1):
***
  Accessible only on this machine
***
https://localhost:${PORT}         

Local/Intranet (Private IPs):
***
  Accessible over different devices connected to the same network and subnet.
***
${localIPsDisplay} 

Public/Internet (Public IP):

***
  Accessible over devices on different networks. 
  (Make sure Network Firewall allows Port ${PORT} for inbound connections)
***
https://${publicIP}:${PORT}   
-----------------------------------------------------------------------------------------------------------------
\n`);
    });
  } catch (error) {
    console.error("Site could not be launched!:", error);
  }
}

//** Driver code
launchSite();
