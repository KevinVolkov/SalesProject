document.addEventListener("DOMContentLoaded", () => {
  // Go to profile page when the profile button is clicked
  const profileButton = document.getElementById("myprofile-button"); // Profile button
  profileButton.addEventListener("click", () => {

    //redirect to myprofile page
    window.location.href = "/myprofile"; // Redirect to the profile page
  });
});
