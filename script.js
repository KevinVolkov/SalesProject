document.addEventListener('DOMContentLoaded', () => {
  // Forms
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const authContainer = document.getElementById('auth-container');
  
  // Buttons and links
  const loginButton = document.getElementById('login-button');
  const registerLink = document.getElementById('register-link');
  const loginLink = document.getElementById('login-link');

  // Error messages
  const loginErrorMessage = document.getElementById('login-error-message');
  const registerErrorMessage = document.getElementById('register-error-message');

  // Navigation links
  const homeLink = document.getElementById('home-link');
  const productsLink = document.getElementById('products-link');
  const contactLink = document.getElementById('contact-link');

  // Sections
  const homeSection = document.getElementById('home');
  const productsSection = document.getElementById('product-list');
  const contactSection = document.getElementById('contact');

  // Dummy credentials for login
  const correctEmail = '1@1';
  const correctPassword = '1';

  // Handle showing login/register form
  loginButton.addEventListener('click', () => {
    authContainer.classList.toggle('hidden');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  });

  // Handle switching to Register form
  registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  });

  // Handle switching to Login form
  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });

  // Handle Login Form Submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (email === correctEmail && password === correctPassword) {
      authContainer.classList.add('hidden');
      loginErrorMessage.classList.add('hidden');
    } else {
      loginErrorMessage.classList.remove('hidden');
    }
  });

  // Handle Register Form Submission
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Implement registration logic (e.g., save user data)
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });

  // Handle navigation links (no login required)
  productsLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(productsSection);
  });

  homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(homeSection);
  });

  contactLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(contactSection);
  });

  // Helper function to show the desired section and hide others
  function showSection(sectionToShow) {
    homeSection.classList.add('hidden');
    productsSection.classList.add('hidden');
    contactSection.classList.add('hidden');
    sectionToShow.classList.remove('hidden');
  }
});
