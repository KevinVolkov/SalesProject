/*
Module name: mailer.js
Date of the code (latest update): 11/21/24
-----------------------------------------------------------------------------------------------
Programmers: Kevin Volkov, Joaquin Banting /students, CSUN COMP 380, Group #6/
-----------------------------------------------------------------------------------------------
Description: Middle-Tier Utility module. Handles email notifications after checkout.
*/


const nodemailer = require('nodemailer');//get nodemailer static object

// Create and configure the email transport: it was hard!!!
const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use other services like 'Yahoo', 'Outlook', etc.
    auth: {
        user: 'abcsales.everything@gmail.com', // My email address, I specifically created at google'your-email@gmail.com', // Your email address
        pass: 'qfhbpuxpayrswldg',//'your-email-password'   (or app-specific password)
    }
});

/* 
 @function: sendConfirmationEmail 
 @purpose:  sends email after checkout 
 @called_from: /controllers/orderController.js /checkout function/
 @input: to, name, address, cart, total, last4Digits
 @output: sends email
 @algirithm: clear from the code and comments below, notice both text and html email strings provided
*/

const sendConfirmationEmail = (to, name, address, cart, total, last4Digits) => {//added cart parameter 11/14/24
    ///////////////11/14/24/////////////////////////////
    let cartDetails = cart.map(item =>  
        `${item.name} (Qty: ${item.quantity}) - $${item.price * item.quantity}` 
        ).join('<br>');
    //////////////////////////////////////////////////////


        
    const mailOptions = {
        from: 'abcsales.everything@gmail.com',//'abcsales.everything@gmail.com', // Sender address
        to: to,                      // List of recipients
        subject: 'Order Confirmation', // Subject line
        text: `Dear ${name},\n\nThank you for your purchase! Your items will be shipped to: ${address}.\nThe items you ordered are: \n${cartDetails}\nYour total is: $${total}\nYour card's last 4 digits are: ${last4Digits}\n\nest regards,\nABC Sales Company`, // Plain text body
        html: `<p>Dear <strong>${name}</strong>,</p><p>Thank you for your purchase! Your items will be shipped to: <strong>${address}</strong>.</p><p>The items you ordered are:</p><p><strong>${cartDetails}</strong></p><p>Your total is: <strong>$${total}</strong></p><p>Your card's last 4 dgits are: <strong>${last4Digits}</strong></p><p>Best regards,<br>ABC Sales Company</p>` // HTML body
    };

    return transporter.sendMail(mailOptions);
};



module.exports = sendConfirmationEmail;
