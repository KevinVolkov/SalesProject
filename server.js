const express = require('express'); // Import express
const app = express();              // Create an express app
const PORT = 3000;                  // Set the port

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
