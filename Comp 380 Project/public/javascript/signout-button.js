document.addEventListener("DOMContentLoaded", () => {
  const signoutButton = document.getElementById("signout-button"); // Login button

  signoutButton.addEventListener("click", () => {
    logout();
  });
});

// backend call to myprofile/logout

async function logout() {
  const response = await fetch("/myprofile/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json(); // Parse the JSON from the response

  if (response.ok) {
    alert("SUCCESS: " + result.message + "| Status code: " + response.status);
    window.location.href = "/"; // Redirect to home page after signout
  } else {
    alert("ERROR: " + result.message + "| Status code: " + response.status);
  }
}
