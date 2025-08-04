
const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

const predefinedUsers = {
  admin1: 'admin',
  admin2: 'admin',
  user1: 'user',
  user2: 'user',
};

router.post('/login', async (req, res) => {
  const { username } = req.body;
  const role = predefinedUsers[username];
  if (!role) return res.status(401).json({ message: 'Unauthorized' });

  const result = await pool.query(
    `INSERT INTO users (username, role)
     VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET role = EXCLUDED.role
     RETURNING *`,
    [username, role]
  );

  const user = result.rows[0];

  // Fetch updated user with assigned_topics
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );

  const token = jwt.sign({
    id: rows[0].id,
    role: rows[0].role,
    assigned_topics: rows[0].assigned_topics || []
  }, process.env.JWT_SECRET);

  res.json({ token, role });
});


module.exports = router;
