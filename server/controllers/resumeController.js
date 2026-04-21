const Analysis = require('../models/Analysis');
const { parseResume } = require('../utils/parser');
const { analyzeResumeWithAI, chatAboutResume } = require('../utils/ai');

// @desc    Upload and analyze resume
// @route   POST /api/resume/upload
// @access  Private
const uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: 'Please upload a resume file' });
    }

    const resumeFile = req.files.resume[0];

    // 1. Parse file content
    const textContent = await parseResume(resumeFile.buffer, resumeFile.mimetype);

    if (!textContent || textContent.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from the file' });
    }

    // 2. Send to AI
    let jobDescription = req.body.jobDescription || '';
    
    // If a job description file was uploaded, parse it and use its text
    if (req.files && req.files.jobDescriptionFile) {
      const jdFile = req.files.jobDescriptionFile[0];
      const jdText = await parseResume(jdFile.buffer, jdFile.mimetype);
      if (jdText) {
        jobDescription = jdText;
      }
    }

    const aiAnalysis = await analyzeResumeWithAI(textContent, jobDescription);

    // 3. Save to database
    const analysisRecord = await Analysis.create({
      userId: req.user._id,
      fileName: resumeFile.originalname,
      overallScore: aiAnalysis.overallScore || 0,
      atsScore: aiAnalysis.atsScore || 0,
      strengths: aiAnalysis.strengths || [],
      weaknesses: aiAnalysis.weaknesses || [],
      missingKeywords: aiAnalysis.missingKeywords || [],
      sectionFeedback: aiAnalysis.sectionFeedback || {},
      topImprovements: aiAnalysis.topImprovements || [],
      jobDescription: jobDescription,
      jobMatchScore: aiAnalysis.jobMatchScore || null,
      resumeText: textContent
    });

    res.status(201).json(analysisRecord);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during analysis', error: error.message });
  }
};

// @desc    Get user's analysis history
// @route   GET /api/resume/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const history = await Analysis.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get specific analysis details
// @route   GET /api/resume/analysis/:id
// @access  Private
const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Make sure user owns this analysis
    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this analysis' });
    }

    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Chat about a specific resume
// @route   POST /api/resume/analysis/:id/chat
// @access  Private
const chatWithResume = async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Make sure user owns this analysis
    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this analysis' });
    }

    // Call AI to chat
    const reply = await chatAboutResume(analysis.resumeText, message, history);
    
    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during chat', error: error.message });
  }
};

module.exports = {
  uploadAndAnalyze,
  getHistory,
  getAnalysisById,
  chatWithResume
};
