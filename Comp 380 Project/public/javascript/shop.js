
document.addEventListener("DOMContentLoaded", () => {

  // Handle adding a new product
  if(document.querySelector(".add-product-form") !== null) { //** this is ALWAYS null unless isAdmin is true
  const addProductForms = document.querySelector(".add-product-form"); //add to cart 

  addProductForms.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newProductId = document.querySelector(".new-product-id-input").value;
    const newProductName = document.querySelector(".new-product-name-input").value;
    const newProductPrice = document.querySelector(".new-product-price-input").value;
    const newProductDescription = document.querySelector(".new-product-description-input").value;
    const newProductImage = document.querySelector(".new-product-image-input").files[0];

    // Create FormData object to hold the form data
    const formData = new FormData();
    formData.append("product_id", newProductId); 
    formData.append("name", newProductName);
    formData.append("price", newProductPrice);
    formData.append("description", newProductDescription);
    formData.append("productImage", newProductImage); // Add the image file

    const response = await fetch("/shop/add_product", {
      method: "POST",
      body: formData, // Send FormData directly
    });

    result = await response.json();

    if (response.status === 200) { //** response contains the status code, result contains the JSON response
      console.log("SUCCESS: Product added to shop!");
      window.location.reload(); // Reload to see the new product
    } else {
      alert("Failed to add product: " + result.message);
    }
  });
}

if(document.querySelector(".edit-product-form") !== null) { //** this is ALWAYS null unless isAdmin is true
  // Handle editing a product
  const editProductForms = document.querySelectorAll(".edit-product-form");

  editProductForms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const productId = form.querySelector(".current-product-id").value; // Original ID
      const newProductId = form.querySelector(".updated-product-id").value; // New ID
      const productName = form.querySelector(".edit-product-name-input").value;
      const productPrice = form.querySelector(".edit-product-price-input").value;
      const productDescription = form.querySelector(".edit-product-description-input").value;
      const productImage = form.querySelector("input[type='file']").files[0]; // Get new image if uploaded

      const formData = new FormData();
      formData.append("product_id", productId); // ID you're updating
      formData.append("new_id", newProductId); // New ID to set
      formData.append("name", productName);
      formData.append("price", productPrice);
      formData.append("description", productDescription);
      formData.append("productImage", productImage); // Include new image if available

      const response = await fetch("/shop/edit_product", {
        method: "PUT",
        body: formData, // Send FormData directly
      });

      result = await response.json(); // Parse the JSON response

      if (response.status === 200) {
        console.log("SUCCESS: Product updated!");
        window.location.reload(); // Reload to see the updated product
      } else {
        alert("Failed to update product: " + result.message);
      }
    });
  });
}

if(document.querySelector(".delete-product-form") !== null) { //** this is ALWAYS null unless isAdmin is true
  // Handle deleting a product
  const deleteProductForms = document.querySelectorAll(".delete-product-form");

  deleteProductForms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const productId = form.querySelector(".delete-product-button").value;

      const response = await fetch("/shop/delete_product", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
        }),
      });

      result = await response.json();

      if (response.status === 200) {
        console.log("SUCCESS: Product deleted!");
        window.location.reload(); // Reload to see the updated list
      } else {
        alert("Failed to delete product: " + result.message);
      }
    });
  });

}

  // Add to cart functionality
  // ** add to cart button should never be null
  document.querySelectorAll(".add-to-cart").forEach((button) => { 
    button.addEventListener("click", async(e) => {

      e.preventDefault(); // Prevent form submission so it listens to this code instead of the form submission

      //alert("Add to Cart button clicked"); // Log when the button is clicked
      const productId = button.dataset.productId; // Get the product ID from the button
      const name = button.dataset.name; // Get the product name from the button
      const quantity = parseInt(document.querySelector(`#quantity-${productId}`).value);
      const price = parseFloat(button.dataset.price);
      const image_path = button.dataset.image_path;

      const response = await fetch("/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, name, quantity, price, image_path }),
      });

      result = await response.json();

      if (response.status === 200) {
        console.log("SUCCESS: " + result.message);
        window.location.reload(); // Reload the page to update the cart
      } else {
        console.log("ERR: " + result.message);
        alert("ERR: " + result.message);
      }

    });
  });
});
