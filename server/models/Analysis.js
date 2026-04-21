const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  overallScore: {
    type: Number,
    required: true
  },
  atsScore: {
    type: Number,
    required: true
  },
  strengths: [String],
  weaknesses: [String],
  missingKeywords: [String],
  sectionFeedback: {
    summary: String,
    experience: String,
    education: String,
    skills: String
  },
  topImprovements: [String],
  jobDescription: String,
  jobMatchScore: Number,
  resumeText: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);
