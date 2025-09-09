const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const pdf = require('pdf-parse');
const { extract } = require('docx-parser');
const openaiService = require('../services/openaiService');

// Load bank data for education loan comparisons
const loadBankData = () => {
  try {
    const bankDataPath = path.join(__dirname, '../data/bankData.json');
    if (fs.existsSync(bankDataPath)) {
      return JSON.parse(fs.readFileSync(bankDataPath, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading bank data:', error);
  }
  return null;
};

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Extract text from uploaded file
async function extractTextFromFile(filePath, mimetype) {
  try {
    if (mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const text = await extract(filePath);
      return text;
    }
    throw new Error('Unsupported file type');
  } catch (error) {
    throw new Error(`Failed to extract text: ${error.message}`);
  }
}

// Upload and process document
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { persona = 'general' } = req.body;
    
    // Extract text from the uploaded file
    const documentText = await extractTextFromFile(req.file.path, req.file.mimetype);
    
    if (!documentText || documentText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from document' });
    }

    // Detect document type first
    const documentType = await openaiService.detectDocumentType(documentText);
    console.log('Detected document type:', documentType);
    
    let analysis;
    
    if (documentType === 'education-loan') {
      // Special handling for education loan documents
      const bankData = loadBankData();
      if (bankData) {
        console.log('Performing education loan analysis with bank comparison');
        analysis = await openaiService.analyzeEducationLoan(documentText, bankData);
        analysis.documentType = 'education-loan';
        analysis.specialAnalysis = true;
      } else {
        // Fallback to regular analysis if bank data not available
        analysis = await openaiService.analyzeDocument(documentText, persona);
        analysis.documentType = 'education-loan';
        analysis.specialAnalysis = false;
      }
    } else {
      // Regular document analysis
      analysis = await openaiService.analyzeDocument(documentText, persona);
      analysis.documentType = documentType;
      analysis.specialAnalysis = false;
    }
    
    // Save analysis to local JSON file (simple storage)
    const analysisId = Date.now().toString();
    const analysisData = {
      id: analysisId,
      filename: req.file.originalname,
      uploadDate: new Date().toISOString(),
      persona: persona,
      documentText: documentText.substring(0, 5000), // Store first 5000 chars for context
      analysis: analysis
    };
    
    const analysisDir = path.join(__dirname, '../data/analyses');
    await fs.ensureDir(analysisDir);
    await fs.writeJson(path.join(analysisDir, `${analysisId}.json`), analysisData);
    
    // Clean up uploaded file
    await fs.remove(req.file.path);
    
    res.json({
      id: analysisId,
      filename: req.file.originalname,
      analysis: analysis
    });
    
  } catch (error) {
    console.error('Document processing error:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      try {
        await fs.remove(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to process document',
      details: error.message 
    });
  }
});

// Get analysis by ID
router.get('/analysis/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const analysisPath = path.join(__dirname, '../data/analyses', `${id}.json`);
    
    if (!await fs.pathExists(analysisPath)) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    
    const analysisData = await fs.readJson(analysisPath);
    res.json(analysisData);
    
  } catch (error) {
    console.error('Error retrieving analysis:', error);
    res.status(500).json({ error: 'Failed to retrieve analysis' });
  }
});

// Get all analyses (for history)
router.get('/history', async (req, res) => {
  try {
    const analysisDir = path.join(__dirname, '../data/analyses');
    
    if (!await fs.pathExists(analysisDir)) {
      return res.json([]);
    }
    
    const files = await fs.readdir(analysisDir);
    const analyses = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const data = await fs.readJson(path.join(analysisDir, file));
          analyses.push({
            id: data.id,
            filename: data.filename,
            uploadDate: data.uploadDate,
            persona: data.persona,
            summary: data.analysis.summary ? data.analysis.summary.substring(0, 200) + '...' : 'No summary available'
          });
        } catch (fileError) {
          console.error(`Error reading ${file}:`, fileError);
        }
      }
    }
    
    // Sort by upload date (newest first)
    analyses.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    
    res.json(analyses);
    
  } catch (error) {
    console.error('Error retrieving history:', error);
    res.status(500).json({ error: 'Failed to retrieve document history' });
  }
});

// Get bank comparison data
router.get('/bank-data', async (req, res) => {
  try {
    const bankData = loadBankData();
    if (bankData) {
      res.json(bankData);
    } else {
      res.status(404).json({ error: 'Bank comparison data not found' });
    }
  } catch (error) {
    console.error('Error retrieving bank data:', error);
    res.status(500).json({ error: 'Failed to retrieve bank data' });
  }
});

module.exports = router;
