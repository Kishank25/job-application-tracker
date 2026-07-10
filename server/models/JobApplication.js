const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  companyName: {
    type: String,
    required: true
  },

  position: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied'
  },

  applicationDate: {
    type: Date,
    default: Date.now
  },

  salary: {
    type: String,
    default: 'Not specified'
  },

  notes: {
    type: String,
    default: ''
  }
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;