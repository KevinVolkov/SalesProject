//*** search.js is the client side code that is SPECIFICALLY for the search bar's functionality.
//*** this will be used for ALL .ejs files that have a search bar

document.addEventListener('DOMContentLoaded', () => {

  const searchButton = document.getElementById('search-button'); // Link to products section
  const search = document.getElementById('search-bar'); // Search input

  // Go to shop page
  searchButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    console.log(search.value); //wont see because page redirects (logs only from previous page)
    //**  Redirect to shop page with search query so that the shop page can filter products
    window.location.href = `/shop?search=${search.value}`; // Redirect to shop page with search query


  });
});