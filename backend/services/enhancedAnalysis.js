const axios = require('axios');
const natural = require('natural');
const compromise = require('compromise');

/**
 * Enhanced Analysis Service
 * Combines multiple open source APIs and libraries for comprehensive document analysis
 */
class EnhancedAnalysisService {
  constructor() {
    // Initialize NLP libraries
    this.sentiment = natural.SentimentAnalyzer.analyze;
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
    
    // Legal keywords for risk assessment
    this.riskKeywords = {
      high: ['penalty', 'termination', 'breach', 'liquidated damages', 'forfeiture', 'default', 'bankruptcy', 'insolvency'],
      medium: ['liability', 'indemnification', 'guarantee', 'security', 'collateral', 'warranty', 'representation'],
      low: ['notice', 'delivery', 'payment terms', 'schedule', 'ordinary course']
    };

    // Financial risk indicators
    this.financialRiskIndicators = [
      'credit rating', 'financial statements', 'audited', 'revenue', 'profit', 'loss', 
      'debt', 'equity', 'cash flow', 'working capital', 'liquidity'
    ];

    // Counterparty risk factors
    this.counterpartyFactors = {
      identity: ['company name', 'registration', 'jurisdiction', 'address'],
      financial: ['financial condition', 'creditworthiness', 'solvency', 'capital'],
      operational: ['business operations', 'key personnel', 'market position', 'reputation'],
      legal: ['compliance', 'regulatory', 'litigation', 'sanctions']
    };
  }

  /**
   * Perform comprehensive document analysis using multiple techniques
   */
  async analyzeDocument(text, documentType = 'contract') {
    try {
      const results = await Promise.allSettled([
        this.performSentimentAnalysis(text),
        this.extractKeyEntities(text),
        this.assessRiskFactors(text),
        this.analyzeCounterpartyRisk(text),
        this.detectLegalClauses(text),
        this.performComparativeAnalysis(text, documentType)
      ]);

      // Combine all results
      const analysis = {
        sentiment: results[0].status === 'fulfilled' ? results[0].value : null,
        entities: results[1].status === 'fulfilled' ? results[1].value : null,
        riskFactors: results[2].status === 'fulfilled' ? results[2].value : null,
        counterpartyRisk: results[3].status === 'fulfilled' ? results[3].value : null,
        legalClauses: results[4].status === 'fulfilled' ? results[4].value : null,
        comparative: results[5].status === 'fulfilled' ? results[5].value : null,
        timestamp: new Date().toISOString()
      };

      return this.generateEnhancedScore(analysis);
    } catch (error) {
      console.error('Enhanced analysis error:', error);
      return this.getFallbackAnalysis();
    }
  }

  /**
   * Sentiment Analysis using Natural NLP
   */
  async performSentimentAnalysis(text) {
    try {
      const tokens = this.tokenizer.tokenize(text.toLowerCase());
      const stems = tokens.map(token => this.stemmer.stem(token));
      
      // Count positive and negative indicators
      const positiveWords = ['agree', 'benefit', 'advantage', 'profit', 'gain', 'success', 'favorable', 'positive'];
      const negativeWords = ['breach', 'penalty', 'risk', 'loss', 'damage', 'harm', 'unfavorable', 'negative'];
      
      const positiveCount = stems.filter(stem => 
        positiveWords.some(word => this.stemmer.stem(word) === stem)
      ).length;
      
      const negativeCount = stems.filter(stem => 
        negativeWords.some(word => this.stemmer.stem(word) === stem)
      ).length;
      
      const sentimentScore = (positiveCount - negativeCount) / tokens.length;
      
      return {
        score: sentimentScore,
        classification: sentimentScore > 0.01 ? 'positive' : sentimentScore < -0.01 ? 'negative' : 'neutral',
        positiveCount,
        negativeCount,
        confidence: Math.abs(sentimentScore)
      };
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return { score: 0, classification: 'neutral', confidence: 0 };
    }
  }

  /**
   * Extract key entities and important information
   */
  async extractKeyEntities(text) {
    try {
      const doc = compromise(text);
      
      return {
        people: doc.people().out('array'),
        places: doc.places().out('array'),
        organizations: doc.organizations().out('array'),
        dates: doc.dates().out('array'),
        money: doc.money().out('array'),
        percentages: doc.percentages().out('array'),
        phoneNumbers: doc.phoneNumbers().out('array'),
        emails: doc.emails().out('array')
      };
    } catch (error) {
      console.error('Entity extraction error:', error);
      return {};
    }
  }

  /**
   * Assess risk factors based on keyword analysis
   */
  async assessRiskFactors(text) {
    const textLower = text.toLowerCase();
    const riskAnalysis = {
      high: [],
      medium: [],
      low: [],
      overall: 'low'
    };

    // Check for high-risk keywords
    this.riskKeywords.high.forEach(keyword => {
      if (textLower.includes(keyword)) {
        riskAnalysis.high.push({
          keyword,
          context: this.extractContext(text, keyword, 50)
        });
      }
    });

    // Check for medium-risk keywords
    this.riskKeywords.medium.forEach(keyword => {
      if (textLower.includes(keyword)) {
        riskAnalysis.medium.push({
          keyword,
          context: this.extractContext(text, keyword, 50)
        });
      }
    });

    // Check for low-risk keywords
    this.riskKeywords.low.forEach(keyword => {
      if (textLower.includes(keyword)) {
        riskAnalysis.low.push({
          keyword,
          context: this.extractContext(text, keyword, 50)
        });
      }
    });

    // Determine overall risk level
    if (riskAnalysis.high.length > 2) {
      riskAnalysis.overall = 'high';
    } else if (riskAnalysis.medium.length > 3 || riskAnalysis.high.length > 0) {
      riskAnalysis.overall = 'medium';
    }

    return riskAnalysis;
  }

  /**
   * Analyze counterparty risk with detailed scoring
   */
  async analyzeCounterpartyRisk(text) {
    const textLower = text.toLowerCase();
    let baseScore = 100;
    const deductions = [];

    // Check for financial indicators
    const financialMentions = this.financialRiskIndicators.filter(indicator => 
      textLower.includes(indicator)
    );

    if (financialMentions.length < 3) {
      const deduction = 15;
      baseScore -= deduction;
      deductions.push({
        category: 'Financial Disclosure',
        pointsDeducted: deduction,
        reason: 'Limited financial information provided'
      });
    }

    // Check for counterparty identification
    let identityScore = 0;
    this.counterpartyFactors.identity.forEach(factor => {
      if (textLower.includes(factor)) identityScore++;
    });

    if (identityScore < 2) {
      const deduction = 20;
      baseScore -= deduction;
      deductions.push({
        category: 'Counterparty Identity',
        pointsDeducted: deduction,
        reason: 'Insufficient counterparty identification details'
      });
    }

    // Check for operational risk factors
    if (textLower.includes('key man') || textLower.includes('key person')) {
      const deduction = 10;
      baseScore -= deduction;
      deductions.push({
        category: 'Operational Risk',
        pointsDeducted: deduction,
        reason: 'Key person dependency identified'
      });
    }

    // Check for legal compliance mentions
    const complianceTerms = ['compliance', 'regulatory', 'law', 'regulation'];
    const complianceMentions = complianceTerms.filter(term => textLower.includes(term));
    
    if (complianceMentions.length === 0) {
      const deduction = 12;
      baseScore -= deduction;
      deductions.push({
        category: 'Compliance Risk',
        pointsDeducted: deduction,
        reason: 'No compliance or regulatory framework mentioned'
      });
    }

    return {
      score: Math.max(baseScore, 0),
      maxScore: 100,
      deductions,
      riskLevel: baseScore >= 80 ? 'low' : baseScore >= 60 ? 'medium' : 'high'
    };
  }

  /**
   * Detect and categorize legal clauses
   */
  async detectLegalClauses(text) {
    const clauses = [];
    const clausePatterns = {
      'Force Majeure': /force majeure|act of god|unforeseeable circumstances/i,
      'Termination': /termination|terminate|end this agreement/i,
      'Liability': /liability|liable|responsible for damages/i,
      'Indemnification': /indemnify|indemnification|hold harmless/i,
      'Confidentiality': /confidential|non-disclosure|proprietary information/i,
      'Governing Law': /governing law|jurisdiction|courts of/i,
      'Assignment': /assignment|assign|transfer/i,
      'Severability': /severability|severable|invalid provision/i
    };

    Object.entries(clausePatterns).forEach(([clauseType, pattern]) => {
      if (pattern.test(text)) {
        const context = this.extractContext(text, pattern.source, 100);
        clauses.push({
          type: clauseType,
          context,
          importance: this.assessClauseImportance(clauseType)
        });
      }
    });

    return clauses;
  }

  /**
   * Perform comparative analysis using open source legal databases
   */
  async performComparativeAnalysis(text, documentType) {
    try {
      // This would integrate with Court Listener API or similar open source legal databases
      // For now, providing a structure for future integration
      
      const comparative = {
        documentType,
        similarityScore: 0.75, // Would be calculated against database
        commonClauses: [],
        unusualClauses: [],
        industryStandards: {
          compliance: 'partial',
          recommendations: []
        }
      };

      // Simulate some comparative analysis based on document patterns
      if (text.includes('liquidated damages')) {
        comparative.unusualClauses.push('Liquidated damages clause - review market standards');
      }

      if (text.includes('non-compete')) {
        comparative.commonClauses.push('Non-compete clause - standard for this document type');
      }

      return comparative;
    } catch (error) {
      console.error('Comparative analysis error:', error);
      return { documentType, analysis: 'unavailable' };
    }
  }

  /**
   * Generate enhanced scoring based on all analysis results
   */
  generateEnhancedScore(analysis) {
    const enhancedScore = {
      overallScore: 75, // Base score
      breakdown: {
        sentiment: analysis.sentiment?.score || 0,
        riskLevel: analysis.riskFactors?.overall || 'medium',
        counterpartyScore: analysis.counterpartyRisk?.score || 70,
        clauseCompliance: analysis.legalClauses?.length || 0
      },
      recommendations: [],
      alerts: []
    };

    // Adjust score based on sentiment
    if (analysis.sentiment?.classification === 'negative') {
      enhancedScore.overallScore -= 10;
      enhancedScore.alerts.push('Negative document sentiment detected');
    }

    // Adjust based on risk factors
    if (analysis.riskFactors?.overall === 'high') {
      enhancedScore.overallScore -= 15;
      enhancedScore.alerts.push('High risk factors identified');
    }

    // Add recommendations
    if (analysis.counterpartyRisk?.deductions?.length > 0) {
      enhancedScore.recommendations.push('Request additional counterparty documentation');
    }

    if (analysis.legalClauses?.length < 3) {
      enhancedScore.recommendations.push('Consider adding standard legal protective clauses');
    }

    return {
      ...analysis,
      enhancedScore
    };
  }

  /**
   * Extract context around a keyword
   */
  extractContext(text, keyword, length = 100) {
    const index = text.toLowerCase().indexOf(keyword.toLowerCase());
    if (index === -1) return '';
    
    const start = Math.max(0, index - length);
    const end = Math.min(text.length, index + keyword.length + length);
    
    return text.substring(start, end);
  }

  /**
   * Assess the importance of a legal clause
   */
  assessClauseImportance(clauseType) {
    const highImportance = ['Liability', 'Termination', 'Indemnification'];
    const mediumImportance = ['Force Majeure', 'Confidentiality', 'Governing Law'];
    
    if (highImportance.includes(clauseType)) return 'high';
    if (mediumImportance.includes(clauseType)) return 'medium';
    return 'low';
  }

  /**
   * Fallback analysis if main analysis fails
   */
  getFallbackAnalysis() {
    return {
      sentiment: { score: 0, classification: 'neutral' },
      entities: {},
      riskFactors: { overall: 'medium' },
      counterpartyRisk: { score: 70, maxScore: 100, deductions: [] },
      legalClauses: [],
      comparative: { analysis: 'unavailable' },
      enhancedScore: {
        overallScore: 70,
        breakdown: {},
        recommendations: ['Manual review recommended'],
        alerts: ['Automated analysis partially failed']
      }
    };
  }
}

/**
 * Free Translation Service using LibreTranslate or similar
 */
class FreeTranslationService {
  constructor() {
    // LibreTranslate public instances (free but rate-limited)
    this.translationEndpoints = [
      'https://translate.argosopentech.com',
      'https://libretranslate.pussthecat.org',
      'https://translate.mentality.rip'
    ];
  }

  async translateText(text, targetLang = 'hi', sourceLang = 'en') {
    for (const endpoint of this.translationEndpoints) {
      try {
        const response = await axios.post(`${endpoint}/translate`, {
          q: text,
          source: sourceLang,
          target: targetLang,
          format: 'text'
        }, {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.data && response.data.translatedText) {
          return {
            translatedText: response.data.translatedText,
            service: endpoint,
            confidence: response.data.confidence || 0.8
          };
        }
      } catch (error) {
        console.warn(`Translation failed with ${endpoint}:`, error.message);
        continue;
      }
    }

    // Fallback: return original text if all translation services fail
    return {
      translatedText: text,
      service: 'fallback',
      confidence: 0,
      error: 'All translation services unavailable'
    };
  }

  async getSupportedLanguages() {
    try {
      const response = await axios.get(`${this.translationEndpoints[0]}/languages`);
      return response.data || [];
    } catch (error) {
      return [
        { code: 'hi', name: 'Hindi' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' }
      ];
    }
  }
}

module.exports = {
  EnhancedAnalysisService,
  FreeTranslationService
};
