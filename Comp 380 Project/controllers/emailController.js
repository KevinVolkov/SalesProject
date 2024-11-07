// emailController.js

// Import Brevo SDK for automated email sending
const SibApiV3Sdk = require("sib-api-v3-sdk");
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;


send = async (emailData) => {

    try {
        const response = await apiInstance.sendTransacEmail(emailData);
        console.log("Email sent successfully: ", response);
    } catch (error) {
        console.error("Error sending email: ", error);
        throw error; //throw the error to the calling function
    }
}

// Export the send function
module.exports = {
    send,
};
