const express = require('express');
const JobApplication = require('../models/JobApplication');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// MIDDLEWARE - Check if user is logged in
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];  // Extract token

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;  // Store user info in request
    next();  // Continue to next step
  });
};

// ADD JOB APPLICATION
// URL: POST http://localhost:5000/api/applications
// Headers: Authorization: Bearer [token]
// Body: { companyName: "Google", position: "SDE", status: "Applied", salary: "50000" }
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { companyName, position, status, salary, notes } = req.body;
    const userId = req.user.userId;

    const newApplication = new JobApplication({
      userId,
      companyName,
      position,
      status,
      salary,
      notes
    });

    await newApplication.save();

    res.status(201).json({ 
      message: 'Application added successfully',
      application: newApplication 
    });

  } catch (error) {
    res.status(500).json({ message: 'Error adding application', error: error.message });
  }
});

// GET ALL APPLICATIONS (for logged-in user)
// URL: GET http://localhost:5000/api/applications
// Headers: Authorization: Bearer [token]
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const applications = await JobApplication.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ 
      message: 'Applications retrieved successfully',
      applications 
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// UPDATE APPLICATION
// URL: PUT http://localhost:5000/api/applications/[applicationId]
// Headers: Authorization: Bearer [token]
// Body: { status: "Interview" }
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await JobApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }  // Return updated document
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ 
      message: 'Application updated successfully',
      application 
    });

  } catch (error) {
    res.status(500).json({ message: 'Error updating application', error: error.message });
  }
});

// DELETE APPLICATION
// URL: DELETE http://localhost:5000/api/applications/[applicationId]
// Headers: Authorization: Bearer [token]
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ 
      message: 'Application deleted successfully' 
    });

  } catch (error) {
    res.status(500).json({ message: 'Error deleting application', error: error.message });
  }
});

module.exports = router;