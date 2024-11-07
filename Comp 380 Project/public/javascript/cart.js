document.addEventListener("DOMContentLoaded", () => {
  // Function to check token status and display the remaining time
  async function checkTokenStatus() {
    const response = await fetch("/cart/token_status");
    const result = await response.json(); // Parse the JSON response

    if (response.status === 200) { // Check if response is 200
      console.log(result); // Log the result to the console
    } else {
      console.error("Error getting Cart access token status:", result.message);
    }
  }

  // Call the function on page load
  checkTokenStatus();

  // Update an item in the cart (PUT)
  document.querySelectorAll(".update-cart").forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault(); // Prevent form submission

      const productId = button.dataset.productId;
      const quantity = parseInt(
        document.querySelector(`#quantity-${productId}`).value
      );

      try {
        const response = await fetch("/cart/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, quantity }),
        });
        const result = await response.json(); // Parse the JSON response
        if (response.status === 200) {
          window.location.reload(); // Reload the page to update cart
        } else {
          alert("Error updating item:", result.message);
        }
      } catch (error) {
        console.error("Error updating item:", error);
      }
    });
  });

  // Remove an item from the cart (DELETE)
  document.querySelectorAll(".remove-from-cart").forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault(); // Prevent form submission
      const productId = button.dataset.productId;

      try {
        const response = await fetch("/cart/remove", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });
        const result = await response.json(); // Parse the JSON response
        if (response.status === 200) {
          window.location.reload(); // Reload the page to update cart
        } else {
          alert("Error removing item:", result.message);
        }
      } catch (error) {
        alert("Error removing item:", error);
      }
    });
  });

  // Clear the entire cart (DELETE)
  if (document.querySelector(".clear-cart") != null) { //if
  document.querySelector(".clear-cart").addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      const response = await fetch("/cart/clear", {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.status === 200) {
        alert("Cart cleared successfully!");
        window.location.reload(); // Reload the page to update cart
      } else {
        alert("Error clearing cart:", result.message);
      }
    } catch (error) {
      alert("Error clearing cart:", error);
    }
  });
  }

  // Proceed to checkout (POST)
  document.querySelector(".checkout-cart")?.addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent form submission
    // Redirect to checkout page
    window.location.href = "/checkout";
  });
});
