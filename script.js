// script.js 
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const mainContent = document.getElementById('main-content');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const loginErrorMessage = document.getElementById('login-error-message');
    const registerErrorMessage = document.getElementById('register-error-message');
  
    // Show Register Form
    registerLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
    });
  
    // Show Login Form
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
    });
  
    // Dummy credentials for login (for demonstration purposes)
    const correctEmail = '1@1';
    const correctPassword = '1';
  
    // Handle Login Form Submission
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
  
      if (email === correctEmail && password === correctPassword) {
        loginForm.classList.add('hidden');
        mainContent.classList.remove('hidden');
      } else {
        loginErrorMessage.classList.remove('hidden');
      }
    });
  
    // Handle Register Form Submission
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault(); 
      // Implement registration logic here (e.g., save user data to a server)
  
      // For now, just hide the register form and show the login form
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
    });

    // Show home, products, and contact when pressing their respective links
    const productList = document.getElementById('product-list');
    const productsLink = document.getElementById('products-link');
    const home = document.getElementById('home');
    const homeLink = document.getElementById('home-link');
    const contact = document.getElementById('contact');
    const contactLink = document.getElementById('contact-link');

    // Show products when pressing the "Products" link
    productsLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        productList.classList.remove('hidden'); // Show the product list
        home.classList.add('hidden'); // Hide the home content
        contact.classList.add('hidden'); // Hide the contact form
    });

    // Show home when pressing the "Home" link
    homeLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        home.classList.remove('hidden'); // Show the home content
        productList.classList.add('hidden'); // Hide the product list
        contact.classList.add('hidden'); // Hide the contact form
    });

    // Show contact form when pressing the "Contact" link
    contactLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        contact.classList.remove('hidden'); // Show the contact form
        home.classList.add('hidden'); // Hide the home content
        productList.classList.add('hidden'); // Hide the product list
    });
  });
