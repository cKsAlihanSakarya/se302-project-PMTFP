const pool = require('../config/db');

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await pool.query(
      'SELECT projects.*, users.full_name as owner_name FROM projects JOIN users ON projects.owner_id = users.id ORDER BY projects.created_at DESC'
    );
    res.json(projects.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single project
const getProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await pool.query(
      'SELECT projects.*, users.full_name as owner_name FROM projects JOIN users ON projects.owner_id = users.id WHERE projects.id = $1',
      [id]
    );
    if (project.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create project
const createProject = async (req, res) => {
  const { title, description, project_type, required_skills, team_size, roles_needed, advisor_needed } = req.body;
  const owner_id = req.user.id;

  try {
    const newProject = await pool.query(
      'INSERT INTO projects (owner_id, title, description, project_type, required_skills, team_size, roles_needed, advisor_needed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [owner_id, title, description, project_type, required_skills, team_size, roles_needed, advisor_needed]
    );
    res.status(201).json(newProject.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const project = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (project.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.rows[0].owner_id !== user_id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProjects, getProject, createProject, deleteProject };