const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
const register = async (req, res) => {
  const { full_name, email, password, role, department } = req.body;

  try {
    // Check if email already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const newUser = await pool.query(
      'INSERT INTO users (full_name, email, password, role, department) VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, email, role',
      [full_name, email, hashedPassword, role, department]
    );

    res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    );
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.rows[0].id, full_name: user.rows[0].full_name, email: user.rows[0].email, role: user.rows[0].role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update student profile
const updateStudentProfile = async (req, res) => {
  const { year, skills, interests, github_url, linkedin_url, bio } = req.body;
  const user_id = req.user.id;

  try {
    // Check if profile exists
    const existing = await pool.query(
      'SELECT * FROM student_profiles WHERE user_id = $1', [user_id]
    );

    if (existing.rows.length > 0) {
      // Update
      const updated = await pool.query(
        'UPDATE student_profiles SET year = $1, skills = $2, interests = $3, github_url = $4, linkedin_url = $5, bio = $6 WHERE user_id = $7 RETURNING *',
        [year, skills, interests, github_url, linkedin_url, bio, user_id]
      );
      res.json(updated.rows[0]);
    } else {
      // Insert
      const newProfile = await pool.query(
        'INSERT INTO student_profiles (user_id, year, skills, interests, github_url, linkedin_url, bio) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [user_id, year, skills, interests, github_url, linkedin_url, bio]
      );
      res.status(201).json(newProfile.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get student profile
const getStudentProfile = async (req, res) => {
  const user_id = req.user.id;

  try {
    const profile = await pool.query(
      'SELECT users.full_name, users.email, users.department, student_profiles.* FROM users LEFT JOIN student_profiles ON users.id = student_profiles.user_id WHERE users.id = $1',
      [user_id]
    );
    res.json(profile.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, updateStudentProfile, getStudentProfile };