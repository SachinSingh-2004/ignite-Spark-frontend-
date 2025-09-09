const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const openaiService = require('../services/openaiService');

const router = express.Router();

// What-if scenario simulation
router.post('/what-if/:analysisId', async (req, res) => {
  try {
    const { analysisId } = req.params;
    const { changes } = req.body;

    if (!changes) {
      return res.status(400).json({ error: 'Changes object is required' });
    }

    // Get original analysis
    const analysisPath = path.join(__dirname, '../data/analyses', `${analysisId}.json`);
    
    if (!await fs.pathExists(analysisPath)) {
      return res.status(404).json({ error: 'Document analysis not found' });
    }

    const analysisData = await fs.readJson(analysisPath);
    
    // Run what-if simulation
    const simulation = await openaiService.simulateWhatIf(analysisData.analysis, changes);

    // Save simulation result
    const simulationData = {
      analysisId: analysisId,
      timestamp: new Date().toISOString(),
      originalAnalysis: analysisData.analysis,
      changes: changes,
      simulation: simulation
    };

    const simulationDir = path.join(__dirname, '../data/simulations');
    await fs.ensureDir(simulationDir);
    
    const simulationId = `${analysisId}_${Date.now()}`;
    await fs.writeJson(path.join(simulationDir, `${simulationId}.json`), simulationData);

    res.json({
      simulationId: simulationId,
      simulation: simulation,
      timestamp: simulationData.timestamp
    });

  } catch (error) {
    console.error('What-if simulation error:', error);
    res.status(500).json({ 
      error: 'Failed to run simulation',
      details: error.message 
    });
  }
});

// Translate analysis to different language
router.post('/translate/:analysisId', async (req, res) => {
  try {
    const { analysisId } = req.params;
    const { targetLanguage = 'hi', section = 'summary' } = req.body;

    // Get analysis
    const analysisPath = path.join(__dirname, '../data/analyses', `${analysisId}.json`);
    
    if (!await fs.pathExists(analysisPath)) {
      return res.status(404).json({ error: 'Document analysis not found' });
    }

    const analysisData = await fs.readJson(analysisPath);
    
    // Determine what to translate
    let textToTranslate = '';
    
    switch (section) {
      case 'summary':
        textToTranslate = analysisData.analysis.summary || '';
        break;
      case 'risks':
        textToTranslate = JSON.stringify(analysisData.analysis.riskAssessment, null, 2);
        break;
      case 'actionItems':
        textToTranslate = analysisData.analysis.actionItems ? analysisData.analysis.actionItems.join('\\n') : '';
        break;
      case 'all':
        textToTranslate = JSON.stringify(analysisData.analysis, null, 2);
        break;
      default:
        textToTranslate = analysisData.analysis.summary || '';
    }

    if (!textToTranslate) {
      return res.status(400).json({ error: 'No content found to translate' });
    }

    // Translate the content
    const translatedText = await openaiService.translateText(textToTranslate, targetLanguage);

    // Save translation
    const translationData = {
      analysisId: analysisId,
      timestamp: new Date().toISOString(),
      targetLanguage: targetLanguage,
      section: section,
      originalText: textToTranslate,
      translatedText: translatedText
    };

    const translationDir = path.join(__dirname, '../data/translations');
    await fs.ensureDir(translationDir);
    
    const translationId = `${analysisId}_${targetLanguage}_${section}_${Date.now()}`;
    await fs.writeJson(path.join(translationDir, `${translationId}.json`), translationData);

    res.json({
      translationId: translationId,
      translatedText: translatedText,
      targetLanguage: targetLanguage,
      section: section,
      timestamp: translationData.timestamp
    });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      error: 'Failed to translate content',
      details: error.message 
    });
  }
});

module.exports = router;
