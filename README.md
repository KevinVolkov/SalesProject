Kevin's comment for this commit:
10/29/24 This change contains a real email password for abcsales.everything@gmail.com . It will allow you
to send confirmation emails even from your locally-running version of the software.

Changes: 
  1. file ../utils/mailer.js 
  2. file ../controllers/orderController.js  
 Please look for the lines commented with: "Mason see this line"

IMPORTANT: please do not "leak" the password to anyone, otherwise if it is "leaked" and used for
spamming or some other "illegal" activity - I am responsible and it is really serious. 
----------------------------------------------------------------------------------------------------

The same code is currently running on my free VPS (on internet):
You can reach it 24x7:   

https://abcsales.duckdns.org

To download all the directory structure from GitHUB as one "zip"  file select SalesProject/KevinBranch (top-left),
find the green rectangle choice-box "Code" (top-right), select "Download Zip"
To run locally in Windows: from the root directory issue
   
node app.js

It will start secure HTTPS server on the port 443 (whichis default https)

To access locally point your web browser to:
https://localhost   or https://127.0.0.1

IMPORTANT: your web browser will warn you that the site is not secure. This is because the certificate does not
correspond to your local site (as I wrote above it correspond to https://abcsales.duckdns.org ), But
please ignore this warning and continue, browser WILL allow it. And:  it is still encrypted https.

Also see  howtostartwith_mysql_db.txt file (in the root dir) how to start with MySQL and
generate "fake" db;

-----------------------------------------------------------------------------------------------------
History of changes.
----------------------------------------------------------------------------------------------------
10/27/24 Working with "https" and <cart> button in the menu with number of items in the cart.
10/26/24 Working version with MySQL and Login/Registering customers. Full purchase checkout.
Still no "admin" functions. 
