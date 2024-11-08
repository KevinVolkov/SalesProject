Kevin's comment:
11/08/24 I restored my original code, which Mason deleted first time, see Jira. Please join me in working on this branch 
         It currenly has less functions for now. But it is just for now. The VPS web site will follow soon.
10/27/24 Working with "https" and <cart> button in the menu with number of items in the cart.
The same code is currently running on my free VPS (on internet):
You can reach it 24x7:   

https://abcsales.duckdns.org

To download all the directory structure from GitHUB as one "zip"  file select SalesProject/KevinBranch (top-left),
find the green rectangle choice-box "Code" (top-right), select "Download Zip"
To run locally in Windows: from the root directory issue
   
node app.js

It will start secure HTTPS server on the port 443 (whichis default https)

To access locally point your web browser to:
https://localhost   or http://127.0.0.1

IMPORTANT: your web browser will warn you that the site is not secure. This is because the certificate does not
correspond to your local site (as I wrote above it correspond to https://abcsales.duckdns.org ), But
please ignore this warning and continue, browser WILL allow it. And:  it is still encrypted https.

Also see  howtostartwith_mysql_db.txt file (in the root dir) how to start with MySQL and
generate "fake" db;

----------------------------------------------------------------------------------------------------
ABC Sales: Major commit 10/26/24 . Working version with MySQL and Login/Registering customers. Full purchase checkout.
Still no "admin" functions. 
