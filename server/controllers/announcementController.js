const pool = require('../config/db');

// Get all announcements
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await pool.query(
      'SELECT announcements.*, users.full_name as created_by_name FROM announcements JOIN users ON announcements.created_by = users.id ORDER BY announcements.created_at DESC'
    );
    res.json(announcements.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create announcement (admin only)
const createAnnouncement = async (req, res) => {
  const { title, description, category } = req.body;
  const created_by = req.user.id;

  try {
    const announcement = await pool.query(
      'INSERT INTO announcements (title, description, category, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, category, created_by]
    );
    res.status(201).json(announcement.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update announcement (admin only)
const updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;

  try {
    const updated = await pool.query(
      'UPDATE announcements SET title = $1, description = $2, category = $3 WHERE id = $4 RETURNING *',
      [title, description, category, id]
    );
    if (updated.rows.length === 0) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(updated.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete announcement (admin only)
const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await pool.query(
      'DELETE FROM announcements WHERE id = $1 RETURNING *', [id]
    );
    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };