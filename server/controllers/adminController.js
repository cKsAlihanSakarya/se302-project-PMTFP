const pool = require('../config/db');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await pool.query(
      'SELECT id, full_name, email, role, department, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Change user role
const changeUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const updated = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, full_name, email, role',
      [role, id]
    );
    if (updated.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updated.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Deactivate user (delete)
const deactivateUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all categories (project types summary)
const getStats = async (req, res) => {
  try {
    const users = await pool.query('SELECT COUNT(*) FROM users');
    const projects = await pool.query('SELECT COUNT(*) FROM projects');
    const instructors = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['instructor']);
    const announcements = await pool.query('SELECT COUNT(*) FROM announcements');

    res.json({
      total_users: users.rows[0].count,
      total_projects: projects.rows[0].count,
      total_instructors: instructors.rows[0].count,
      total_announcements: announcements.rows[0].count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUsers, changeUserRole, deactivateUser, getStats };