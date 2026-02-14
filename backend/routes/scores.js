const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /scores?difficulty=medium&limit=10
// Returns top scores for a given difficulty
router.get('/', async (req, res) => {
  const difficulty = req.query.difficulty || 'medium';
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);

  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({ error: 'Invalid difficulty' });
  }

  try {
    const result = await pool.query(
      `SELECT name, time_seconds, created_at
       FROM scores
       WHERE difficulty = $1
       ORDER BY time_seconds ASC
       LIMIT $2`,
      [difficulty, limit]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /scores
// Body: { name, time_seconds, difficulty }
router.post('/', async (req, res) => {
  const { name, time_seconds, difficulty } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 32) {
    return res.status(400).json({ error: 'Invalid name (max 32 chars)' });
  }
  if (!Number.isInteger(time_seconds) || time_seconds <= 0) {
    return res.status(400).json({ error: 'Invalid time_seconds' });
  }
  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({ error: 'Invalid difficulty' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO scores (name, time_seconds, difficulty)
       VALUES ($1, $2, $3)
       RETURNING id, name, time_seconds, difficulty, created_at`,
      [name.trim(), time_seconds, difficulty]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
