const { EnhancedAnalysisService, FreeTranslationService } = require('../services/enhancedAnalysis');
const { LegalDatabaseService } = require('../services/legalDatabase');
const { FinancialRiskService } = require('../services/financialRisk');

/**
 * Enhanced Analysis Controller
 * Orchestrates all enhanced analysis services for comprehensive document analysis
 */
class EnhancedAnalysisController {
  constructor() {
    this.enhancedAnalysis = new EnhancedAnalysisService();
    this.legalDatabase = new LegalDatabaseService();
    this.financialRisk = new FinancialRiskService();
    this.translation = new FreeTranslationService();
  }

  /**
   * Perform comprehensive document analysis
   * Combines all services for detailed legal document assessment
   */
  async analyzeDocument(req, res) {
    try {
      const { 
        documentText, 
        documentType = 'contract', 
        companyName = null,
        industry = 'default',
        targetLanguage = null,
        analysisOptions = {}
      } = req.body;

      if (!documentText) {
        return res.status(400).json({
          error: 'Document text is required',
          code: 'MISSING_TEXT'
        });
      }

      // Start all analyses in parallel for better performance
      const analysisPromises = [
        this.enhancedAnalysis.analyzeDocument(documentText, documentType),
        this.legalDatabase.searchLegalPrecedents(documentText, documentType),
        companyName ? this.financialRisk.assessFinancialRisk(companyName, industry) : Promise.resolve(null)
      ];

      // Add translation if requested
      if (targetLanguage) {
        analysisPromises.push(
          this.translation.translateText(documentText, targetLanguage)
        );
      }

      const results = await Promise.allSettled(analysisPromises);

      // Compile comprehensive analysis results
      const analysis = {
        documentAnalysis: results[0].status === 'fulfilled' ? results[0].value : null,
        legalPrecedents: results[1].status === 'fulfilled' ? results[1].value : null,
        financialRisk: results[2].status === 'fulfilled' ? results[2].value : null,
        translation: targetLanguage && results[3]?.status === 'fulfilled' ? results[3].value : null
      };

      // Generate enhanced counterparty risk score
      const enhancedCounterpartyRisk = this.generateEnhancedCounterpartyRisk(analysis);

      // Create comprehensive recommendations
      const comprehensiveRecommendations = this.generateComprehensiveRecommendations(analysis);

      // Generate executive summary
      const executiveSummary = this.generateExecutiveSummary(analysis, enhancedCounterpartyRisk);

      const response = {
        success: true,
        documentType,
        companyName,
        industry,
        analysis: {
          ...analysis,
          enhancedCounterpartyRisk,
          comprehensiveRecommendations,
          executiveSummary
        },
        metadata: {
          analysisTimestamp: new Date().toISOString(),
          servicesUsed: this.getServicesUsed(analysis),
          processingTime: Date.now() - req.startTime || 0
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Enhanced analysis error:', error);
      res.status(500).json({
        error: 'Analysis failed',
        message: error.message,
        code: 'ANALYSIS_ERROR'
      });
    }
  }

  /**
   * Generate enhanced counterparty risk assessment
   * Combines multiple analysis results for comprehensive risk scoring
   */
  generateEnhancedCounterpartyRisk(analysis) {
    let baseScore = 100;
    const deductions = [];
    const factors = [];

    // Document analysis contributions
    if (analysis.documentAnalysis?.counterpartyRisk) {
      const docRisk = analysis.documentAnalysis.counterpartyRisk;
      const docDeduction = 100 - docRisk.score;
      baseScore -= docDeduction * 0.4; // 40% weight
      
      deductions.push(...docRisk.deductions.map(d => ({
        ...d,
        source: 'Document Analysis',
        weight: 0.4
      })));
    }

    // Financial risk contributions
    if (analysis.financialRisk) {
      const finRisk = analysis.financialRisk;
      const finDeduction = 100 - finRisk.overallScore;
      baseScore -= finDeduction * 0.35; // 35% weight
      
      deductions.push(...finRisk.deductions.map(d => ({
        ...d,
        source: 'Financial Analysis',
        weight: 0.35
      })));
    }

    // Legal precedent contributions
    if (analysis.legalPrecedents?.patterns) {
      const legalPatterns = analysis.legalPrecedents.patterns;
      
      // Contract structure assessment
      if (legalPatterns.contractStructure?.completeness < 70) {
        const deduction = (70 - legalPatterns.contractStructure.completeness) * 0.25;
        baseScore -= deduction;
        deductions.push({
          category: 'Contract Structure',
          pointsDeducted: deduction,
          reason: 'Incomplete contract structure elements',
          source: 'Legal Analysis',
          weight: 0.25
        });
      }

      // Risk distribution assessment
      if (legalPatterns.riskDistribution?.type === 'unilateral') {
        const deduction = 10;
        baseScore -= deduction;
        deductions.push({
          category: 'Risk Distribution',
          pointsDeducted: deduction,
          reason: 'Unbalanced risk allocation detected',
          source: 'Legal Analysis',
          weight: 0.25
        });
      }
    }

    // Sentiment analysis impact
    if (analysis.documentAnalysis?.sentiment?.classification === 'negative') {
      const deduction = 8;
      baseScore -= deduction;
      deductions.push({
        category: 'Document Sentiment',
        pointsDeducted: deduction,
        reason: 'Negative sentiment in document language',
        source: 'NLP Analysis',
        weight: 0.1
      });
    }

    const finalScore = Math.max(Math.round(baseScore), 0);

    return {
      score: finalScore,
      maxScore: 100,
      riskLevel: finalScore >= 80 ? 'low' : finalScore >= 60 ? 'medium' : 'high',
      deductions,
      factors: this.identifyRiskFactors(analysis),
      methodology: 'Enhanced multi-source risk assessment',
      confidence: this.calculateConfidenceScore(analysis)
    };
  }

  /**
   * Generate comprehensive recommendations based on all analyses
   */
  generateComprehensiveRecommendations(analysis) {
    const recommendations = {
      immediate: [],
      shortTerm: [],
      longTerm: [],
      monitoring: []
    };

    // Document analysis recommendations
    if (analysis.documentAnalysis?.enhancedScore?.recommendations) {
      recommendations.immediate.push(...analysis.documentAnalysis.enhancedScore.recommendations);
    }

    // Financial risk recommendations
    if (analysis.financialRisk?.recommendations) {
      recommendations.shortTerm.push(...analysis.financialRisk.recommendations);
    }

    // Legal precedent recommendations
    if (analysis.legalPrecedents?.patterns) {
      const patterns = analysis.legalPrecedents.patterns;
      
      if (patterns.enforcementMechanisms?.recommendations) {
        recommendations.immediate.push(...patterns.enforcementMechanisms.recommendations);
      }
      
      if (patterns.industryCompliance?.recommendedClauses) {
        recommendations.longTerm.push(
          `Consider adding industry-specific clauses: ${patterns.industryCompliance.recommendedClauses.join(', ')}`
        );
      }
    }

    // Risk monitoring recommendations
    recommendations.monitoring.push(
      'Regular review of counterparty financial condition',
      'Monitor compliance with contract terms',
      'Track industry and regulatory changes'
    );

    // Remove duplicates and empty arrays
    Object.keys(recommendations).forEach(key => {
      recommendations[key] = [...new Set(recommendations[key])].filter(Boolean);
    });

    return recommendations;
  }

  /**
   * Generate executive summary
   */
  generateExecutiveSummary(analysis, enhancedRisk) {
    const summary = {
      overallRisk: enhancedRisk.riskLevel,
      score: enhancedRisk.score,
      keyFindings: [],
      primaryConcerns: [],
      strengths: [],
      nextSteps: []
    };

    // Key findings from document analysis
    if (analysis.documentAnalysis) {
      const docAnalysis = analysis.documentAnalysis;
      
      if (docAnalysis.riskFactors?.overall === 'high') {
        summary.primaryConcerns.push('High-risk legal terms identified in document');
      }
      
      if (docAnalysis.legalClauses?.length > 5) {
        summary.strengths.push('Comprehensive legal clause coverage');
      }
    }

    // Financial analysis findings
    if (analysis.financialRisk) {
      const finRisk = analysis.financialRisk;
      
      if (finRisk.riskLevel === 'high') {
        summary.primaryConcerns.push('Elevated financial risk indicators');
      }
      
      if (finRisk.riskLevel === 'low') {
        summary.strengths.push('Strong financial position indicated');
      }
    }

    // Legal precedent insights
    if (analysis.legalPrecedents?.precedents?.length > 0) {
      summary.keyFindings.push('Relevant legal precedents identified for reference');
    }

    // Next steps
    if (enhancedRisk.riskLevel === 'high') {
      summary.nextSteps.push('Conduct detailed due diligence before proceeding');
      summary.nextSteps.push('Consider additional risk mitigation measures');
    }

    summary.nextSteps.push('Review and negotiate key risk allocation terms');
    summary.nextSteps.push('Establish appropriate monitoring and reporting mechanisms');

    return summary;
  }

  /**
   * Identify key risk factors across all analyses
   */
  identifyRiskFactors(analysis) {
    const factors = [];

    // Document-based factors
    if (analysis.documentAnalysis?.riskFactors) {
      Object.entries(analysis.documentAnalysis.riskFactors).forEach(([level, risks]) => {
        if (Array.isArray(risks) && risks.length > 0) {
          factors.push({
            category: 'Document Risk',
            level,
            count: risks.length,
            details: risks.map(r => r.keyword)
          });
        }
      });
    }

    // Financial factors
    if (analysis.financialRisk?.deductions) {
      const finCategories = [...new Set(analysis.financialRisk.deductions.map(d => d.category))];
      finCategories.forEach(category => {
        factors.push({
          category: 'Financial Risk',
          level: 'identified',
          subcategory: category
        });
      });
    }

    // Legal structure factors
    if (analysis.legalPrecedents?.patterns?.contractStructure) {
      const structure = analysis.legalPrecedents.patterns.contractStructure;
      if (structure.score === 'poor') {
        factors.push({
          category: 'Legal Structure',
          level: 'high',
          issue: 'Incomplete contract elements',
          missing: structure.missingElements
        });
      }
    }

    return factors;
  }

  /**
   * Calculate confidence score for the analysis
   */
  calculateConfidenceScore(analysis) {
    let totalSources = 0;
    let availableSources = 0;

    // Document analysis
    totalSources++;
    if (analysis.documentAnalysis) availableSources++;

    // Legal database
    totalSources++;
    if (analysis.legalPrecedents?.precedents) availableSources++;

    // Financial data
    totalSources++;
    if (analysis.financialRisk?.breakdown?.financial === 'analyzed') availableSources++;

    const dataQuality = analysis.documentAnalysis?.sentiment?.confidence || 0.5;
    const sourceRatio = availableSources / totalSources;
    
    return Math.round((sourceRatio * 0.7 + dataQuality * 0.3) * 100);
  }

  /**
   * Identify which services were successfully used
   */
  getServicesUsed(analysis) {
    const services = [];

    if (analysis.documentAnalysis) {
      services.push('Enhanced NLP Analysis');
    }
    
    if (analysis.legalPrecedents) {
      services.push('Legal Database Search');
    }
    
    if (analysis.financialRisk) {
      services.push('Financial Risk Assessment');
    }
    
    if (analysis.translation) {
      services.push('Translation Service');
    }

    return services;
  }

  /**
   * Get supported languages for translation
   */
  async getSupportedLanguages(req, res) {
    try {
      const languages = await this.translation.getSupportedLanguages();
      res.json({
        success: true,
        languages
      });
    } catch (error) {
      console.error('Get languages error:', error);
      res.status(500).json({
        error: 'Failed to get supported languages',
        message: error.message
      });
    }
  }

  /**
   * Translate document text
   */
  async translateDocument(req, res) {
    try {
      const { text, targetLanguage, sourceLanguage = 'en' } = req.body;

      if (!text || !targetLanguage) {
        return res.status(400).json({
          error: 'Text and target language are required'
        });
      }

      const translation = await this.translation.translateText(text, targetLanguage, sourceLanguage);

      res.json({
        success: true,
        translation
      });
    } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({
        error: 'Translation failed',
        message: error.message
      });
    }
  }

  /**
   * Get legal precedents for a document
   */
  async getLegalPrecedents(req, res) {
    try {
      const { documentText, documentType = 'contract' } = req.body;

      if (!documentText) {
        return res.status(400).json({
          error: 'Document text is required'
        });
      }

      const precedents = await this.legalDatabase.searchLegalPrecedents(documentText, documentType);

      res.json({
        success: true,
        precedents
      });
    } catch (error) {
      console.error('Legal precedents error:', error);
      res.status(500).json({
        error: 'Failed to search legal precedents',
        message: error.message
      });
    }
  }

  /**
   * Assess financial risk for a company
   */
  async assessFinancialRisk(req, res) {
    try {
      const { companyName, industry = 'default', additionalData = {} } = req.body;

      if (!companyName) {
        return res.status(400).json({
          error: 'Company name is required'
        });
      }

      const riskAssessment = await this.financialRisk.assessFinancialRisk(companyName, industry, additionalData);

      res.json({
        success: true,
        riskAssessment
      });
    } catch (error) {
      console.error('Financial risk assessment error:', error);
      res.status(500).json({
        error: 'Financial risk assessment failed',
        message: error.message
      });
    }
  }
}

module.exports = { EnhancedAnalysisController };
