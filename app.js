const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const recipeRoutes = require("./routes/recipeRoutes");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Register the recipe routes
app.use('/api/recipes', recipeRoutes);

// You might want to define the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
