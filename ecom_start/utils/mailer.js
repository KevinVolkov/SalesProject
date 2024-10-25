const nodemailer = require('nodemailer');

// Configure the email transport
const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use other services like 'Yahoo', 'Outlook', etc.
    auth: {
        user: 'your-email@gmail.com', // Your email address
        pass: 'your-email-password'   // Your email password (or app-specific password)
    }
});

const sendConfirmationEmail = (to, name, address) => {
    const mailOptions = {
        from: 'your-email@gmail.com', // Sender address
        to: to,                      // List of recipients
        subject: 'Order Confirmation', // Subject line
        text: `Dear ${name},\n\nThank you for your purchase! Your items will be shipped to: ${address}.\n\nBest regards,\nABC Sales Company`, // Plain text body
        html: `<p>Dear <strong>${name}</strong>,</p><p>Thank you for your purchase! Your items will be shipped to: <strong>${address}</strong>.</p><p>Best regards,<br>ABC Sales Company</p>` // HTML body
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendConfirmationEmail;
