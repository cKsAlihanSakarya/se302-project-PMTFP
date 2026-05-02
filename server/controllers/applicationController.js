const pool = require('../config/db');

// Apply to project
const applyToProject = async (req, res) => {
  const { project_id } = req.body;
  const applicant_id = req.user.id;

  try {
    // Check if already applied
    const alreadyApplied = await pool.query(
      'SELECT * FROM project_applications WHERE project_id = $1 AND applicant_id = $2',
      [project_id, applicant_id]
    );
    if (alreadyApplied.rows.length > 0) {
      return res.status(400).json({ message: 'Already applied to this project' });
    }

    const application = await pool.query(
      'INSERT INTO project_applications (project_id, applicant_id) VALUES ($1, $2) RETURNING *',
      [project_id, applicant_id]
    );
    res.status(201).json(application.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get applications for a project (project owner sees this)
const getProjectApplications = async (req, res) => {
  const { project_id } = req.params;
  const user_id = req.user.id;

  try {
    // Check if user is project owner
    const project = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND owner_id = $2',
      [project_id, user_id]
    );
    if (project.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await pool.query(
      'SELECT project_applications.*, users.full_name, users.email, users.department FROM project_applications JOIN users ON project_applications.applicant_id = users.id WHERE project_id = $1',
      [project_id]
    );
    res.json(applications.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Accept or reject application
const updateApplication = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user_id = req.user.id;

  try {
    // Check if user is project owner
    const application = await pool.query(
      'SELECT project_applications.*, projects.owner_id FROM project_applications JOIN projects ON project_applications.project_id = projects.id WHERE project_applications.id = $1',
      [id]
    );
    if (application.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }
    if (application.rows[0].owner_id !== user_id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await pool.query(
      'UPDATE project_applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(updated.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { applyToProject, getProjectApplications, updateApplication };