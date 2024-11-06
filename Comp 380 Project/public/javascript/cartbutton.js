// Initiate the cart button functionality
document.addEventListener("DOMContentLoaded", () => {
  // View Cart button functionality
  const viewCartButton = document.getElementById("cart-button");

  viewCartButton.addEventListener("click", () => {
    window.location.href = "/cart"; // Redirect to cart page
  });
});
