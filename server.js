// Load environment variables from .env file
// Requirement: "Use process.env to access your .env variables from your JavaScript code" 
require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
// Requirement: "Safely store sensitive information... Store database credentials in an .env file" 
const port = process.env.PORT || 5001;

// Middleware setup
app.use(cors());
app.use(express.json());

// Database connection setup using connection pool for efficiency
// Requirement: "Use 'Pool' class from node-postgres package to maintain set of live connections" [cite: 618, 621]
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Requirement: "GET /users: Retrieve all users from the database" 
app.get('/users', async (req, res) => {
  try {
    // SQL Command: SELECT * FROM users; [cite: 938]
    const result = await pool.query('SELECT * FROM users');
    
    // Requirement: "Return the full list of users in JSON format" 
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});