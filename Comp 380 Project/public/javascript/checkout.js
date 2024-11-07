// checkout.js
document.addEventListener("DOMContentLoaded", () => {
  const paymentMethodSelect = document.getElementById("payment-method");
  const paymentFields = document.getElementById("payment-fields");
  const creditCardFields = document.getElementById("credit-card-fields");
  const paypalFields = document.getElementById("paypal-fields");
  const bankTransferFields = document.getElementById("bank-transfer-fields");


  // Function to show/hide payment fields based on the selected payment method
  const togglePaymentFields = () => {
      const selectedPaymentMethod = paymentMethodSelect.value;

      // Reset all fields
      paymentFields.style.display = 'none';
      creditCardFields.style.display = 'none';
      paypalFields.style.display = 'none';
      bankTransferFields.style.display = 'none';

      if (selectedPaymentMethod) {
          paymentFields.style.display = 'block'; // Show payment fields
          if (selectedPaymentMethod === "credit-card") {
              creditCardFields.style.display = 'block';
          } else if (selectedPaymentMethod === "paypal") {
              paypalFields.style.display = 'block';
          } else if (selectedPaymentMethod === "bank-transfer") {
              bankTransferFields.style.display = 'block';
          }
      }
  };

  //******** Attach change event listener to payment method select
  paymentMethodSelect.addEventListener("change", togglePaymentFields);


  // Existing event listener for checkout form submission
  document.getElementById("checkout-form").addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);

      const data = Object.fromEntries(formData.entries()); // Convert form data to object
      const paymentInfo = {
          method: data['payment-method'],
          details: {}  // object to store payment details based on the selected method
      };

      // Collect input fields based on the selected payment method
      if (paymentInfo.method === "credit-card") {
          paymentInfo.details.cardNumber = data['card-number'];
          paymentInfo.details.cardExpiry = data['card-expiry'];
          paymentInfo.details.cardCVC = data['card-cvc'];
      } else if (paymentInfo.method === "paypal") {
          paymentInfo.details.paypalEmail = data['paypal-email'];
      } else if (paymentInfo.method === "bank-transfer") {
          paymentInfo.details.bankName = data['bank-name'];
          paymentInfo.details.accountNumber = data['account-number'];
          paymentInfo.details.routingNumber = data['routing-number'];
      }
      else {
          alert("Please select a payment method!");
          return;
      }

      // Send a POST request to the server to complete the checkout process
      try {
          const response = await fetch("/checkout", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ data, paymentInfo }), // checkout and payment info in the request body
          });

          const result = await response.json();
          document.getElementById("message").textContent =
              result.message || "Checkout completed!";

          if (response.ok) {
              alert(
                  `Checkout completed!
                  Total price: $${result.price}
                  Order details: ${result.cartData
                     .map((item) => `${item.name} x ${item.quantity}`)
                     .join(", ")}
                  Shipping info:
                  Name: ${result.checkoutData.name}
                  Address: ${result.checkoutData.address}
                  City: ${result.checkoutData.city}
                  State: ${result.checkoutData.state}
                  Zip: ${result.checkoutData.zip}
                  Email: ${result.checkoutData.email}
                  Shipping method: ${result.checkoutData["shipping-method"]}
                  Payment method: ${result.paymentData.method}
                  Payment details: ${JSON.stringify(paymentInfo.details, null, 2)}` //**not from the server
              );
          } else {
              alert("ERROR: " + result.message);
          }

          // Reload page
          window.location.reload();
      } catch (error) {
          console.error("Error:", error);
          document.getElementById("message").textContent =
              "There was an error during checkout.";
      }
  });
});
