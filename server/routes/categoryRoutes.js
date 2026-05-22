const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyToken } = require('../middleware/authMiddleware');

// Tüm kategorileri getir
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM project_categories ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Yeni kategori ekle (sadece admin)
router.post('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
  const { name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO project_categories (name) VALUES ($1) RETURNING *',
      [name.toLowerCase()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Kategori sil (sadece admin)
router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM project_categories WHERE id = $1', [id]);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;