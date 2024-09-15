document.addEventListener('DOMContentLoaded', () => {
  // Get references to form elements
  const loginForm = document.getElementById('login-form'); // Login form element
  const registerForm = document.getElementById('register-form'); // Register form element
  const authContainer = document.getElementById('auth-container'); // Container holding login/register forms

  // Get references to buttons and links
  const loginButton = document.getElementById('login-button'); // Login button
  const registerLink = document.getElementById('register-link'); // Link to switch to Register form
  const loginLink = document.getElementById('login-link'); // Link to switch to Login form

  // Get references to error messages
  const loginErrorMessage = document.getElementById('login-error-message'); // Error message for login
  const registerErrorMessage = document.getElementById('register-error-message'); // Error message for registration

  // Get references to navigation links
  const homeLink = document.getElementById('home-link'); // Link to home section
  const productsLink = document.getElementById('products-link'); // Link to products section
  const contactLink = document.getElementById('contact-link'); // Link to contact section

  // Get references to sections
  const homeSection = document.getElementById('home'); // Home section
  const productsSection = document.getElementById('product-list'); // Products section
  const contactSection = document.getElementById('contact'); // Contact section

  // Show the login form and hide the register form when login button is clicked
  loginButton.addEventListener('click', () => {
    authContainer.classList.toggle('hidden'); // Show the auth container
    loginForm.classList.remove('hidden'); // Show the login form
    registerForm.classList.add('hidden'); // Hide the register form
  });

  // Switch to Register form when the register link is clicked
  registerLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    loginForm.classList.add('hidden'); // Hide the login form
    registerForm.classList.remove('hidden'); // Show the register form
  });

  // Switch to Login form when the login link is clicked
  loginLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    registerForm.classList.add('hidden'); // Hide the register form
    loginForm.classList.remove('hidden'); // Show the login form
  });

  // Handle login form submission
  loginForm.addEventListener('submit', async (e) => { //button functionality that communicates with the server
    e.preventDefault(); // Prevent form from reloading the page
    const email = document.getElementById('login-email').value; // Get email input value
    const password = document.getElementById('login-password').value; // Get password input value

    try {
      // Send login data to the backend
      const response = await fetch('/login_request', {
        method: 'POST', // HTTP method
        headers: { 'Content-Type': 'application/json' }, // Specify JSON content
        body: JSON.stringify({ email, password }) // Convert data to JSON
      });

      // Parse response data
      const result = await response.json();

      // Check if login was successful
      if (response.ok) {
        authContainer.classList.add('hidden'); // Hide the auth container
        loginErrorMessage.classList.add('hidden'); // Hide login error message
        loginButton.classList.add('hidden'); // Hide login button
        // Optionally show profile button or redirect to another page
      } else {
        loginErrorMessage.textContent = result.message; // Show error message
        loginErrorMessage.classList.remove('hidden'); // Show login error message
      }
    } catch (error) {
      loginErrorMessage.textContent = 'An error occurred'; // Handle network or server errors
      loginErrorMessage.classList.remove('hidden'); // Show login error message
    }
  });

  // Handle register form submission
  registerForm.addEventListener('submit', async (e) => { //button functionality that communicates with the server
    e.preventDefault(); // Prevent form from reloading the page
    const email = document.getElementById('register-email').value; // Get email input value
    const password = document.getElementById('register-password').value; // Get password input value

    try {
      // Send registration data to the backend
      const response = await fetch('/register_request', {
        method: 'POST', // HTTP method
        headers: { 'Content-Type': 'application/json' }, // Specify JSON content
        body: JSON.stringify({ email, password }) // Convert data to JSON
      });
      // Parse response data
      const result = await response.json();

      // Check if registration was successful
      if (response.ok) {
        registerForm.classList.add('hidden'); // Hide the register form
        loginForm.classList.remove('hidden'); // Show the login form
      } else {
        registerErrorMessage.textContent = result.message; // Show error message
        registerErrorMessage.classList.remove('hidden'); // Show register error message
      }
    } catch (error) {
      registerErrorMessage.textContent = 'An error occurred'; // Handle network or server errors
      registerErrorMessage.classList.remove('hidden'); // Show register error message
    }
  });

  // Handle navigation link clicks
  productsLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    showSection(productsSection); // Show the products section
  });

  homeLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    showSection(homeSection); // Show the home section
  });

  contactLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    showSection(contactSection); // Show the contact section
  });

  // Helper function to show a specific section and hide others
  function showSection(sectionToShow) {
    homeSection.classList.add('hidden'); // Hide the home section
    productsSection.classList.add('hidden'); // Hide the products section
    contactSection.classList.add('hidden'); // Hide the contact section
    sectionToShow.classList.remove('hidden'); // Show the desired section
  }
});
