document.addEventListener("DOMContentLoaded", () => {
  const signinButton = document.getElementById("signin-button"); // Login button
  // Go to register/login screen (auth.ejs) when the login/register button is clicked
  signinButton.addEventListener("click", () => {
    window.location.href = "/auth"; // Redirect to the auth page
  });
});
