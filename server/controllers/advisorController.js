const pool = require('../config/db');

// Get all instructors
const getInstructors = async (req, res) => {
  try {
    const instructors = await pool.query(
      'SELECT users.id, users.full_name, users.department, instructor_profiles.academic_title, instructor_profiles.areas_of_expertise, instructor_profiles.research_interests, instructor_profiles.previous_project_types, instructor_profiles.is_available FROM users JOIN instructor_profiles ON users.id = instructor_profiles.user_id WHERE users.role = $1',
      ['instructor']
    );
    res.json(instructors.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send advisor request
const sendAdvisorRequest = async (req, res) => {
  const { project_id, instructor_id } = req.body;
  const student_id = req.user.id;

  try {
    // Check if already sent
    const alreadySent = await pool.query(
      'SELECT * FROM advisor_requests WHERE project_id = $1 AND instructor_id = $2',
      [project_id, instructor_id]
    );
    if (alreadySent.rows.length > 0) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    const request = await pool.query(
      'INSERT INTO advisor_requests (project_id, student_id, instructor_id) VALUES ($1, $2, $3) RETURNING *',
      [project_id, student_id, instructor_id]
    );
    res.status(201).json(request.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get advisor requests (instructor sees this)
const getAdvisorRequests = async (req, res) => {
  const instructor_id = req.user.id;

  try {
    const requests = await pool.query(
      'SELECT advisor_requests.*, projects.title as project_title, projects.project_type, users.full_name as student_name FROM advisor_requests JOIN projects ON advisor_requests.project_id = projects.id JOIN users ON advisor_requests.student_id = users.id WHERE advisor_requests.instructor_id = $1',
      [instructor_id]
    );
    res.json(requests.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Accept or reject advisor request
const updateAdvisorRequest = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const instructor_id = req.user.id;

  try {
    const request = await pool.query(
      'SELECT * FROM advisor_requests WHERE id = $1 AND instructor_id = $2',
      [id, instructor_id]
    );
    if (request.rows.length === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const updated = await pool.query(
      'UPDATE advisor_requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    // If accepted, assign advisor to project
    if (status === 'accepted') {
      await pool.query(
        'UPDATE projects SET advisor_id = $1 WHERE id = $2',
        [instructor_id, request.rows[0].project_id]
      );
    }

    res.json(updated.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get instructor profile
const getInstructorProfile = async (req, res) => {
  const user_id = req.user.id;
  try {
    const profile = await pool.query(
      'SELECT users.full_name, users.email, users.department, instructor_profiles.* FROM users LEFT JOIN instructor_profiles ON users.id = instructor_profiles.user_id WHERE users.id = $1',
      [user_id]
    );
    res.json(profile.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update instructor profile
const updateInstructorProfile = async (req, res) => {
  const { academic_title, areas_of_expertise, research_interests, previous_project_types, is_available } = req.body;
  const user_id = req.user.id;

  try {
    const existing = await pool.query(
      'SELECT * FROM instructor_profiles WHERE user_id = $1', [user_id]
    );

    if (existing.rows.length > 0) {
      const updated = await pool.query(
        'UPDATE instructor_profiles SET academic_title = $1, areas_of_expertise = $2, research_interests = $3, previous_project_types = $4, is_available = $5 WHERE user_id = $6 RETURNING *',
        [academic_title, areas_of_expertise, research_interests, previous_project_types, is_available, user_id]
      );
      res.json(updated.rows[0]);
    } else {
      const newProfile = await pool.query(
        'INSERT INTO instructor_profiles (user_id, academic_title, areas_of_expertise, research_interests, previous_project_types, is_available) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [user_id, academic_title, areas_of_expertise, research_interests, previous_project_types, is_available]
      );
      res.status(201).json(newProfile.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getInstructors, sendAdvisorRequest, getAdvisorRequests, updateAdvisorRequest, getInstructorProfile, updateInstructorProfile };