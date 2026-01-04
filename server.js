// Requirement: Use process.env to access .env variables [cite: 977]
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// Connection pool setup [cite: 618, 621]
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Requirement: GET /users to retrieve all users 
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users'); // [cite: 938]
    res.json(result.rows); // Requirement: Return JSON format 
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => console.log(`Server running on ${port}`));