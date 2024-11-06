//***

document.addEventListener("DOMContentLoaded", () => {
  const homebutton = document.getElementById("home-button"); // Home button

  //go to home page
  homebutton.addEventListener("click", () => {
    //redirect to the home page
    window.location.href = "/"; // Redirect to the home page
  });
});
