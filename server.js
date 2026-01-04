// // Requirement: Use process.env to access .env variables [cite: 977]
// require('dotenv').config();
// const express = require('express');
// const { Pool } = require('pg');
// const cors = require('cors');

// const app = express();
// const port = 5001;

// app.use(cors());
// app.use(express.json());

// // Connection pool setup [cite: 618, 621]
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false }
// });

// // Requirement: GET /users to retrieve all users 
// app.get('/users', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM users'); // [cite: 938]
//     res.json(result.rows); // Requirement: Return JSON format 
//   } catch (err) {
//     res.status(500).send('Server Error');
//   }
// });

// app.listen(port, () => console.log(`Server running on ${port}`));

// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Import Supabase client library
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// Initialize Supabase client with environment variables
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_ANON_KEY
);

// Get all users using Supabase ORM instead of raw SQL
app.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get users joined with their profile information
app.get('/users/profiles', async (req, res) => {
  try {
    // Perform a relational query to join users and user_profiles tables
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        user_profiles (*)
      `);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));