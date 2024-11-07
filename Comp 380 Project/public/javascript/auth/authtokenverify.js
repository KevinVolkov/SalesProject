//***authtokenverify.js is client-side code that verifies the access token and refresh token
//***and logs the status of the access/refresh token
// Wait for the page to load
document.addEventListener("DOMContentLoaded", () => {
  // Get the login and profile buttons

  // Function to refresh the access token
  async function refreshAccessToken() {
    const response = await fetch("auth/restart_token", {
      method: "POST",
      credentials: "include", // Include cookies
    });

    // Parse JSON result from response
    const result = await response.json();

    // if access token is still valid (200) or if access token is refreshed (202)
    if (response.status === 200 || response.status === 202) {
      
      if (response.status === 202) {  //if access token was refreshed
        //reload the page
        window.location.reload();
      }
      console.log(result.message);

      // Fetch user object stored in the access token
      const userObjResponse = await fetch("auth/restart_token", {
        method: "GET",
        credentials: "include",
      });

      // Parse JSON result from response
      const userObjResult = await userObjResponse.json();

      if (userObjResponse.ok) {

        // Log the user object returned from the server
        console.log(userObjResult);
      } else {
        // Log the error message from the server
        console.log(userObjResult.message);
      }
    }
    else {
      // Log the error message to the console
      console.log(result.message);
    }
  }

  //log token status
  async function logTokenStatus() {

    const response = await fetch("auth/token_status", {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (response.status === 200) {
      console.log(result);
    } else {
      console.log(result.message);
    }

  }

  // Call this function every time the page is loaded or refreshed
  //this will attempt to refresh the access token and log the token status
  window.addEventListener("load", () => {
    refreshAccessToken(); // Refresh the access token on page load
    logTokenStatus(); // Log the token status on page load
  });
});
