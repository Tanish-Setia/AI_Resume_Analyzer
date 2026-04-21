const express = require('express');
const multer = require('multer');
const { uploadAndAnalyze, getHistory, getAnalysisById, chatWithResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf, .docx, and .txt formats allowed!'), false);
    }
  }
});

router.post('/upload', protect, upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'jobDescriptionFile', maxCount: 1 }
]), uploadAndAnalyze);
router.get('/history', protect, getHistory);
router.get('/analysis/:id', protect, getAnalysisById);
router.post('/analysis/:id/chat', protect, chatWithResume);

module.exports = router;
