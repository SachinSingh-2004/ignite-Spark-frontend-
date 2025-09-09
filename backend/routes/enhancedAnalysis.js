const express = require('express');
const { EnhancedAnalysisController } = require('../controllers/enhancedAnalysisController');

const router = express.Router();
const enhancedAnalysisController = new EnhancedAnalysisController();

/**
 * Middleware to track request start time for performance metrics
 */
router.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

/**
 * @route POST /api/enhanced-analysis/analyze
 * @desc Perform comprehensive document analysis using all available services
 * @access Public
 */
router.post('/analyze', async (req, res) => {
  await enhancedAnalysisController.analyzeDocument(req, res);
});

/**
 * @route POST /api/enhanced-analysis/legal-precedents
 * @desc Search for relevant legal precedents and patterns
 * @access Public
 */
router.post('/legal-precedents', async (req, res) => {
  await enhancedAnalysisController.getLegalPrecedents(req, res);
});

/**
 * @route POST /api/enhanced-analysis/financial-risk
 * @desc Assess financial risk for a company or counterparty
 * @access Public
 */
router.post('/financial-risk', async (req, res) => {
  await enhancedAnalysisController.assessFinancialRisk(req, res);
});

/**
 * @route POST /api/enhanced-analysis/translate
 * @desc Translate document text to target language
 * @access Public
 */
router.post('/translate', async (req, res) => {
  await enhancedAnalysisController.translateDocument(req, res);
});

/**
 * @route GET /api/enhanced-analysis/languages
 * @desc Get supported languages for translation
 * @access Public
 */
router.get('/languages', async (req, res) => {
  await enhancedAnalysisController.getSupportedLanguages(req, res);
});

/**
 * @route GET /api/enhanced-analysis/health
 * @desc Health check endpoint for enhanced analysis services
 * @access Public
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    services: [
      'Enhanced NLP Analysis',
      'Legal Database Integration',
      'Financial Risk Assessment',
      'Translation Services'
    ],
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;
