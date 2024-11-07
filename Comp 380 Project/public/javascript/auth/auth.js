//*** auth.js is the client side code that is SPECIFICALLY for to the login and registration forms.
document.addEventListener("DOMContentLoaded", () => {

  //DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
  // Get references to form elements from auth.ejs
  const loginForm = document.getElementById("login-form"); // Login form element
  const registerForm = document.getElementById("register-form"); // Register form element

  // Get references to buttons and links from auth.ejs
  const registerLink = document.getElementById("register-link"); // Link to switch to Register form
  const loginLink = document.getElementById("login-link"); // Link to switch to Login form

  // Get references to error messages from auth.ejs
  const loginErrorMessage = document.getElementById("login-error-message"); // Error message for login
  const registerErrorMessage = document.getElementById(
    "register-error-message"
  ); // Error message for registration

  //** automatically hide the sign in button from header.ejs because already on auth page
  const loginButton = document.getElementById("signin-button");
  loginButton.classList.add("hidden");



  // Switch to Register form when the register link is clicked
  registerLink.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    loginForm.classList.add("hidden"); // Hide the login form
    registerForm.classList.remove("hidden"); // Show the register form
  });

  // Switch to Login form when the login link is clicked
  loginLink.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    registerForm.classList.add("hidden"); // Hide the register form
    loginForm.classList.remove("hidden"); // Show the login form
  });

  // Handle login form submission
  loginForm.addEventListener("submit", async (e) => {
    //button functionality that communicates with the server.
    e.preventDefault(); // Prevent form from reloading the page
    const email = document.getElementById("login-email").value; // Get email input value from the login form
    const password = document.getElementById("login-password").value; // Get password input value from the login form


    // Send login data to the backend
    const response = await fetch("/auth/login_request", {
      //fetch is a function that sends a request to the server
      method: "POST", // HTTP method
      headers: { "Content-Type": "application/json" }, // Specify JSON content (headers are metadata that provide additional information about the request)
      body: JSON.stringify({ email, password }), // Convert data to JSON
    });

    // Parse response data
    const result = await response.json(); //the type of result is a promise, so we use await to wait for the promise to resolve.
    // a promise is an object that represents the eventual completion (or failure) of an asynchronous operation, and its resulting value.

    // Check if login was successful
    if (response.status === 200) {
      alert("SUCCESS: " + result.message); // Log the message from the response
      window.location.href = "/"; // Redirect to the home page
    } else {
      loginErrorMessage.textContent = result.message; // Show error message
      loginErrorMessage.classList.remove("hidden"); // Show login error message
    }
  });

  // Handle register form submission
  registerForm.addEventListener("submit", async (e) => {
    //button functionality that communicates with the server
    e.preventDefault(); // Prevent form from submitting so custom code can run
    const email = document.getElementById("register-email").value; // Get email input value
    const password = document.getElementById("register-password").value; // Get password input value

    try {
      // Send registration data to the backend
      const response = await fetch("/auth/register_request", {
        method: "POST", // HTTP method
        headers: { "Content-Type": "application/json" }, // Specify JSON content
        body: JSON.stringify({ email, password }), // Convert data to JSON
      });
      // Parse response data
      const result = await response.json(); //response.json() is a function that parses the JSON response from the server
      // a promise is an object that represents the eventual completion (or failure) of an asynchronous operation, and its resulting value.


      // Check if registration was successful
      if (response.status === 200) {
        alert("SUCCESS: " + result.message); // Log the message from the response
        registerForm.classList.add("hidden"); // Hide the register form
        loginForm.classList.remove("hidden"); // Show the login form
      } else {
        registerErrorMessage.textContent = result.message; // Show error message
        registerErrorMessage.classList.remove("hidden"); // Show register error message
      }
    } catch (error) {
      registerErrorMessage.textContent = "Error with backend"; // Handle network or server errors
      registerErrorMessage.classList.remove("hidden"); // Show register error message
    }
  });
});
