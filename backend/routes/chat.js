const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const openaiService = require('../services/openaiService');

const router = express.Router();

// Chat with document
router.post('/:analysisId', async (req, res) => {
  try {
    const { analysisId } = req.params;
    const { question, conversationHistory = [] } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Get document analysis for context
    const analysisPath = path.join(__dirname, '../data/analyses', `${analysisId}.json`);
    
    if (!await fs.pathExists(analysisPath)) {
      return res.status(404).json({ error: 'Document analysis not found' });
    }

    const analysisData = await fs.readJson(analysisPath);
    const documentContext = `
Document: ${analysisData.filename}
Summary: ${analysisData.analysis.summary}
Key Points: ${JSON.stringify(analysisData.analysis.keyParts, null, 2)}
Risk Assessment: ${JSON.stringify(analysisData.analysis.riskAssessment, null, 2)}
Document Text (excerpt): ${analysisData.documentText}
`;

    // Get AI response
    const response = await openaiService.chatWithDocument(
      documentContext,
      question,
      conversationHistory
    );

    // Save conversation to chat history
    const chatData = {
      analysisId: analysisId,
      timestamp: new Date().toISOString(),
      question: question,
      response: response,
      conversationHistory: conversationHistory
    };

    const chatDir = path.join(__dirname, '../data/chats');
    await fs.ensureDir(chatDir);
    
    const chatId = `${analysisId}_${Date.now()}`;
    await fs.writeJson(path.join(chatDir, `${chatId}.json`), chatData);

    res.json({
      response: response,
      chatId: chatId,
      timestamp: chatData.timestamp
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.message 
    });
  }
});

// Get chat history for a document
router.get('/history/:analysisId', async (req, res) => {
  try {
    const { analysisId } = req.params;
    const chatDir = path.join(__dirname, '../data/chats');
    
    if (!await fs.pathExists(chatDir)) {
      return res.json([]);
    }

    const files = await fs.readdir(chatDir);
    const chatHistory = [];

    for (const file of files) {
      if (file.startsWith(`${analysisId}_`) && file.endsWith('.json')) {
        try {
          const chatData = await fs.readJson(path.join(chatDir, file));
          chatHistory.push({
            chatId: file.replace('.json', ''),
            timestamp: chatData.timestamp,
            question: chatData.question,
            response: chatData.response
          });
        } catch (fileError) {
          console.error(`Error reading chat file ${file}:`, fileError);
        }
      }
    }

    // Sort by timestamp (oldest first for conversation flow)
    chatHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    res.json(chatHistory);

  } catch (error) {
    console.error('Error retrieving chat history:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
});

module.exports = router;
