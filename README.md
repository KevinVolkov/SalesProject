Kevin's comments/history fo KevinBranch

-----------------------------------------------------------------------------------------------------------------

12/07/24 Fixed bugs: 1. Orders string was too small in DB for multiple orders (../models/Customer.js). 
                        DB schema changed, deleteing previous 'ecommercedb' is required before next run.
                     2. Confirmation email should show the total with only 2 digits after '.' 
					    (../controllers/orderController.js)
         Added "shipping method" to the checkout view: it was requirement of the assignment.  
		 (../views/checkout.ejs and ..public/css/styles.css)

-----------------------------------------------------------------------------------------------------------------

12/06/24 Integrated latest Irvin's fixes for admin functions (not in ../additem.ejs - there was some crash 
         when adding an item)

12/03/24 Added 'admin' functions. Some more work is needed, probably, if we have time (or not)

12/02/24 Added Jtest (JavaScript Testing Framework) automated unit tests modules per assignment of 12/02/24
         latest fixes from Irvin and Joaquin
	
11/23/24 Integrated Irvin's latest fix to the 'Clear Cart' button. Fixed misspelling in Irvin Merino's last
         name in comments. Sorry.

11/21/24 Removed unused files . Put multiple comments to explain algorithms for possible future maintenance.

11/21/24 11:28pm Integrated latest Joaquin's changes for the detailed confirmation email.

11/20/24 8:12pm Integrated latest Irvin's fixes Restored "Clear Cart" button in /views/cart.ejs again.

11/19/24 7:43pm Restored "Clear Cart" button in /views/cart.ejs which was somehow loast after Irvin's changes

11/19/24 commit Integrated Irvins front end changes! see Irvin's Jira SAL-35 Sal-37 through Sal-41

11/16/24 commit See SAL-43 in Jira:added Pictures (Images) to every item: needs to be verified, see my email how to verify.

11/16/24 commit: See SAL-42 in Jira Improving diagnostics for the first run errors we saw on Irvin's PC

11/11/24 commit: still fixing first time error when creating DB and populating with dummy(fictive) 100 products
         and some other changes
		 
------------------------------------------------------------------------------------------------------------------
11/09/24 Guys, I restored my original code, which Mason deleted first time, see Jira. Please join me in working on 
         this branch. It currenly has less functions for now. But it is just for now. The VPS web site will follow soon.
------------------------------------------------------------------------------------------------------------------
11/09/24 Using .env file in the root directory to keep MySQL root password (I use 'meta'). 
         See also: ../config/createDatabase.js and ../config/db.js ('meta' replaced with process.env.MYSQL_ROOT_PASS
         Fixed error when creating/populating the DB first time.

10/27/24 Working with "https" and <cart> button in the menu with number of items in the cart.
The same code will be running on the free VPS (on internet): You will be able to see it 24x7 (not now)

https://abcsales.duckdns.org


To download all the directory structure from GitHUB as one "zip"  file select SalesProject/KevinBranch (top-left),
find the green rectangle choice-box "Code" (top-right), select "Download Zip"
To run locally in Windows: from the root directory issue
   
node app.js

It will start secure HTTPS server on the port 443 (whichis default https)

To access locally point your web browser to: https://localhost   

IMPORTANT: your web browser will warn you that the site is not secure. This is because the certificate does not
correspond to your local site (as I wrote above it correspond to https://abcsales.duckdns.org ), But
please ignore this warning and continue, browser WILL allow it. And:  it is still encrypted https.

Also see  howtostartwith_mysql_db.txt file (in the root dir) how to start with MySQL and
generate "fake" db;

ABC Sales: Major commit 10/26/24 . Working version with MySQL and Login/Registering customers. Full purchase checkout.
Still no "admin" functions. 

----------------------------------------------------------------------------------------------------

ABC Sales: Major commit 09/23/24 . Major commit (with some bugs though), but working version with MongoDB 'customers' and 'items' tables
 
----------------------------------------------------------------------------------------------------

