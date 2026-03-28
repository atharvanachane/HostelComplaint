const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', require('./routes'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
