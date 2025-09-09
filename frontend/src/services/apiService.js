// Real API service for backend integration
// For Vercel deployment, use relative URLs to backend folder
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? window.location.origin 
  : (process.env.REACT_APP_API_URL || 'http://localhost:5000');

class ApiService {
  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Upload and analyze document
  async analyzeDocument(file, persona = 'student') {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('persona', persona);

    const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    return this.handleResponse(response);
  }

  // Get analysis by ID
  async getAnalysis(analysisId) {
    const response = await fetch(`${API_BASE_URL}/api/documents/analysis/${analysisId}`);
    return this.handleResponse(response);
  }

  // Get document upload history
  async getDocumentHistory() {
    const response = await fetch(`${API_BASE_URL}/api/documents/history`);
    return this.handleResponse(response);
  }

  // Chat with document
  async chatWithDocument(analysisId, question, conversationHistory = []) {
    const response = await fetch(`${API_BASE_URL}/api/chat/${analysisId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        conversationHistory,
      }),
    });

    return this.handleResponse(response);
  }

  // Get chat history for a document
  async getChatHistory(analysisId) {
    const response = await fetch(`${API_BASE_URL}/api/chat/history/${analysisId}`);
    return this.handleResponse(response);
  }

  // Run what-if simulation
  async simulateWhatIf(analysisId, changes) {
    const response = await fetch(`${API_BASE_URL}/api/analysis/what-if/${analysisId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        changes,
      }),
    });

    return this.handleResponse(response);
  }

  // Translate content
  async translateContent(analysisId, targetLanguage = 'hi', section = 'summary') {
    const response = await fetch(`${API_BASE_URL}/api/analysis/translate/${analysisId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetLanguage,
        section,
      }),
    });

    return this.handleResponse(response);
  }

  // Enhanced Analysis - Comprehensive document analysis
  async enhancedAnalyze(documentText, documentType = 'contract', companyName = null, industry = 'default', targetLanguage = null) {
    const response = await fetch(`${API_BASE_URL}/api/enhanced-analysis/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentText,
        documentType,
        companyName,
        industry,
        targetLanguage,
      }),
    });

    return this.handleResponse(response);
  }

  // Enhanced Analysis - Legal precedents search
  async searchLegalPrecedents(documentText, documentType = 'contract') {
    const response = await fetch(`${API_BASE_URL}/api/enhanced-analysis/legal-precedents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentText,
        documentType,
      }),
    });

    return this.handleResponse(response);
  }

  // Enhanced Analysis - Financial risk assessment
  async assessFinancialRisk(companyName, industry = 'default', additionalData = {}) {
    const response = await fetch(`${API_BASE_URL}/api/enhanced-analysis/financial-risk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        companyName,
        industry,
        additionalData,
      }),
    });

    return this.handleResponse(response);
  }

  // Enhanced Analysis - Document translation
  async enhancedTranslate(text, targetLanguage = 'hi', sourceLanguage = 'en') {
    const response = await fetch(`${API_BASE_URL}/api/enhanced-analysis/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLanguage,
        sourceLanguage,
      }),
    });

    return this.handleResponse(response);
  }

  // Enhanced Analysis - Get supported languages
  async getSupportedLanguages() {
    const response = await fetch(`${API_BASE_URL}/api/enhanced-analysis/languages`);
    return this.handleResponse(response);
  }

  // Enhanced Analysis - Health check
  async enhancedHealthCheck() {
    const response = await fetch(`${API_BASE_URL}/api/enhanced-analysis/health`);
    return this.handleResponse(response);
  }

  // Health check endpoint
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return this.handleResponse(response);
    } catch (error) {
      throw new Error(`Backend is not available: ${error.message}`);
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
