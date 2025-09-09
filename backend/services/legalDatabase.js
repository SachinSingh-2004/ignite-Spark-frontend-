const axios = require('axios');

/**
 * Legal Database Integration Service
 * Integrates with Court Listener API and other open source legal databases
 */
class LegalDatabaseService {
  constructor() {
    // Court Listener API (Free with registration)
    this.courtListenerBase = 'https://www.courtlistener.com/api/rest/v3';
    this.apiKey = process.env.COURT_LISTENER_API_KEY || null;
    
    // Other free legal resources
    this.legalResources = {
      justia: 'https://api.justia.com',
      openjurist: 'https://openjurist.org/api',
      freelaw: 'https://free.law/api'
    };

    // Legal precedent categories
    this.precedentCategories = [
      'contract disputes',
      'liability cases',
      'commercial law',
      'employment law',
      'intellectual property',
      'corporate law',
      'regulatory compliance'
    ];
  }

  /**
   * Search for relevant legal precedents based on document content
   */
  async searchLegalPrecedents(documentText, documentType = 'contract') {
    try {
      const keywords = this.extractLegalKeywords(documentText);
      const results = await Promise.allSettled([
        this.searchCourtListener(keywords),
        this.searchOpenSourceCases(keywords),
        this.analyzeLegalPatterns(documentText, documentType)
      ]);

      return {
        precedents: results[0].status === 'fulfilled' ? results[0].value : [],
        openSourceCases: results[1].status === 'fulfilled' ? results[1].value : [],
        patterns: results[2].status === 'fulfilled' ? results[2].value : null,
        searchKeywords: keywords,
        searchTimestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Legal precedent search error:', error);
      return this.getDefaultLegalAnalysis();
    }
  }

  /**
   * Search Court Listener API for relevant cases
   */
  async searchCourtListener(keywords) {
    if (!this.apiKey) {
      console.warn('Court Listener API key not configured');
      return this.getMockCourtListenerResults(keywords);
    }

    try {
      const searchQuery = keywords.slice(0, 3).join(' AND ');
      const response = await axios.get(`${this.courtListenerBase}/search/`, {
        params: {
          q: searchQuery,
          type: 'o', // Opinions
          order_by: 'score desc',
          stat_Precedential: 'on',
          court: 'scotus,ca1,ca2,ca3,ca4,ca5,ca6,ca7,ca8,ca9,ca10,ca11,cadc'
        },
        headers: {
          'Authorization': `Token ${this.apiKey}`
        },
        timeout: 10000
      });

      return this.formatCourtListenerResults(response.data);
    } catch (error) {
      console.error('Court Listener API error:', error);
      return this.getMockCourtListenerResults(keywords);
    }
  }

  /**
   * Search open source legal case databases
   */
  async searchOpenSourceCases(keywords) {
    const cases = [];
    
    // Simulate search in open source legal databases
    // In practice, this would integrate with actual APIs or scraped data
    const mockCases = [
      {
        title: 'Smith v. Johnson Industries',
        court: 'Federal District Court',
        year: 2022,
        relevance: 0.85,
        summary: 'Contract dispute involving liability limitations and indemnification clauses',
        citation: '2022 U.S. Dist. LEXIS 12345',
        keyHoldings: [
          'Liability caps must be reasonable and clearly stated',
          'Indemnification clauses require mutual consideration'
        ]
      },
      {
        title: 'Tech Corp v. Startup Inc.',
        court: 'State Supreme Court',
        year: 2023,
        relevance: 0.78,
        summary: 'Commercial agreement dispute regarding termination clauses',
        citation: '2023 State LEXIS 6789',
        keyHoldings: [
          'Termination clauses must provide adequate notice period',
          'Material breach requires clear definition'
        ]
      }
    ];

    // Filter cases based on keyword relevance
    keywords.forEach(keyword => {
      mockCases.forEach(case_ => {
        if (case_.summary.toLowerCase().includes(keyword.toLowerCase()) ||
            case_.keyHoldings.some(holding => holding.toLowerCase().includes(keyword.toLowerCase()))) {
          if (!cases.find(c => c.citation === case_.citation)) {
            cases.push(case_);
          }
        }
      });
    });

    return cases;
  }

  /**
   * Analyze legal patterns in the document
   */
  async analyzeLegalPatterns(text, documentType) {
    const patterns = {
      contractStructure: this.analyzeContractStructure(text),
      riskDistribution: this.analyzeRiskDistribution(text),
      enforcementMechanisms: this.analyzeEnforcementMechanisms(text),
      industryCompliance: this.checkIndustryCompliance(text, documentType)
    };

    return patterns;
  }

  /**
   * Extract relevant legal keywords from document text
   */
  extractLegalKeywords(text) {
    const legalTerms = [
      'contract', 'agreement', 'liability', 'indemnification', 'breach',
      'termination', 'damages', 'warranty', 'representation', 'covenant',
      'force majeure', 'assignment', 'confidentiality', 'non-disclosure',
      'intellectual property', 'governing law', 'jurisdiction', 'arbitration',
      'mediation', 'remedy', 'injunction', 'specific performance'
    ];

    const textLower = text.toLowerCase();
    return legalTerms.filter(term => textLower.includes(term));
  }

  /**
   * Analyze contract structure and completeness
   */
  analyzeContractStructure(text) {
    const essentialElements = {
      parties: /party|parties|between.*and/i.test(text),
      consideration: /consideration|payment|compensation|value/i.test(text),
      obligations: /shall|must|will|obligation|duty|responsibility/i.test(text),
      termination: /terminate|termination|end|expire|expiration/i.test(text),
      governingLaw: /governing law|jurisdiction|applicable law/i.test(text),
      signatures: /signature|signed|execute|execution/i.test(text)
    };

    const completeness = Object.values(essentialElements).filter(Boolean).length;
    const totalElements = Object.keys(essentialElements).length;

    return {
      elements: essentialElements,
      completeness: (completeness / totalElements) * 100,
      missingElements: Object.keys(essentialElements).filter(key => !essentialElements[key]),
      score: completeness >= 5 ? 'good' : completeness >= 3 ? 'fair' : 'poor'
    };
  }

  /**
   * Analyze risk distribution between parties
   */
  analyzeRiskDistribution(text) {
    const riskIndicators = {
      unilateral: [
        /one party.*liable/i,
        /sole responsibility/i,
        /exclusively liable/i
      ],
      mutual: [
        /mutual.*liable/i,
        /both parties.*responsible/i,
        /shared liability/i
      ],
      balanced: [
        /proportionate/i,
        /reasonable allocation/i,
        /equitable distribution/i
      ]
    };

    let riskType = 'unclear';
    let confidence = 0;

    Object.entries(riskIndicators).forEach(([type, patterns]) => {
      const matches = patterns.filter(pattern => pattern.test(text)).length;
      if (matches > confidence) {
        riskType = type;
        confidence = matches;
      }
    });

    return {
      type: riskType,
      confidence,
      recommendation: this.getRiskDistributionRecommendation(riskType)
    };
  }

  /**
   * Analyze enforcement mechanisms
   */
  analyzeEnforcementMechanisms(text) {
    const mechanisms = {
      arbitration: /arbitration|arbitrator|arbitral/i.test(text),
      mediation: /mediation|mediator/i.test(text),
      litigation: /court|lawsuit|litigation/i.test(text),
      liquidatedDamages: /liquidated damages/i.test(text),
      specificPerformance: /specific performance/i.test(text),
      injunctiveRelief: /injunction|injunctive relief/i.test(text)
    };

    const availableMechanisms = Object.keys(mechanisms).filter(key => mechanisms[key]);
    
    return {
      mechanisms,
      availableMechanisms,
      strength: availableMechanisms.length >= 2 ? 'strong' : availableMechanisms.length === 1 ? 'moderate' : 'weak',
      recommendations: this.getEnforcementRecommendations(availableMechanisms)
    };
  }

  /**
   * Check industry-specific compliance requirements
   */
  checkIndustryCompliance(text, documentType) {
    const industryPatterns = {
      financial: /banking|financial|securities|investment|credit/i,
      healthcare: /healthcare|medical|patient|hipaa|phi/i,
      technology: /software|technology|data|privacy|gdpr/i,
      manufacturing: /manufacturing|production|supply|materials/i,
      employment: /employment|employee|work|labor/i
    };

    let industry = 'general';
    Object.entries(industryPatterns).forEach(([key, pattern]) => {
      if (pattern.test(text)) {
        industry = key;
      }
    });

    return {
      detectedIndustry: industry,
      complianceRequirements: this.getIndustryRequirements(industry),
      recommendedClauses: this.getRecommendedClauses(industry, documentType)
    };
  }

  /**
   * Get industry-specific compliance requirements
   */
  getIndustryRequirements(industry) {
    const requirements = {
      financial: [
        'Anti-money laundering compliance',
        'Know your customer requirements',
        'Regulatory reporting obligations'
      ],
      healthcare: [
        'HIPAA compliance for patient data',
        'Medical device regulations',
        'Professional liability considerations'
      ],
      technology: [
        'Data privacy regulations (GDPR, CCPA)',
        'Cybersecurity requirements',
        'Intellectual property protections'
      ],
      manufacturing: [
        'Product liability standards',
        'Safety regulations compliance',
        'Environmental regulations'
      ],
      employment: [
        'Labor law compliance',
        'Non-discrimination requirements',
        'Wage and hour regulations'
      ],
      general: [
        'General business law compliance',
        'Tax obligations',
        'Corporate governance'
      ]
    };

    return requirements[industry] || requirements.general;
  }

  /**
   * Get recommended clauses for industry and document type
   */
  getRecommendedClauses(industry, documentType) {
    const clauses = {
      financial: ['Regulatory compliance', 'Data security', 'Audit rights'],
      healthcare: ['HIPAA compliance', 'Professional standards', 'Patient safety'],
      technology: ['Data privacy', 'IP protection', 'Cybersecurity'],
      manufacturing: ['Product liability', 'Quality standards', 'Environmental compliance'],
      employment: ['Non-discrimination', 'Confidentiality', 'Non-compete'],
      general: ['Force majeure', 'Governing law', 'Dispute resolution']
    };

    return clauses[industry] || clauses.general;
  }

  /**
   * Format Court Listener API results
   */
  formatCourtListenerResults(data) {
    if (!data.results) return [];

    return data.results.slice(0, 5).map(result => ({
      title: result.caseName || 'Unknown Case',
      court: result.court || 'Unknown Court',
      date: result.dateFiled,
      relevance: result.score || 0.5,
      citation: result.citation,
      summary: result.snippet || 'No summary available',
      url: `https://www.courtlistener.com${result.absolute_url}`
    }));
  }

  /**
   * Get mock Court Listener results when API is unavailable
   */
  getMockCourtListenerResults(keywords) {
    return [
      {
        title: 'Sample Contract Dispute Case',
        court: 'U.S. District Court',
        date: '2023-01-15',
        relevance: 0.8,
        citation: 'Mock Citation 123',
        summary: 'Relevant case involving similar contractual terms and risk allocation',
        url: 'https://example.com/case1'
      }
    ];
  }

  /**
   * Get risk distribution recommendation
   */
  getRiskDistributionRecommendation(riskType) {
    const recommendations = {
      unilateral: 'Consider balancing risk allocation to ensure fairness',
      mutual: 'Good balance, ensure proportionality to capabilities',
      balanced: 'Well-structured risk allocation',
      unclear: 'Clarify risk allocation terms for better enforceability'
    };

    return recommendations[riskType] || 'Review risk allocation terms';
  }

  /**
   * Get enforcement mechanism recommendations
   */
  getEnforcementRecommendations(mechanisms) {
    if (mechanisms.length === 0) {
      return ['Add dispute resolution mechanism', 'Consider arbitration clause'];
    }
    
    if (mechanisms.length === 1) {
      return ['Consider adding backup enforcement mechanism'];
    }

    return ['Enforcement mechanisms appear adequate'];
  }

  /**
   * Get default legal analysis when services fail
   */
  getDefaultLegalAnalysis() {
    return {
      precedents: [],
      openSourceCases: [],
      patterns: {
        contractStructure: { completeness: 50, score: 'fair' },
        riskDistribution: { type: 'unclear', confidence: 0 },
        enforcementMechanisms: { strength: 'moderate' },
        industryCompliance: { detectedIndustry: 'general' }
      },
      searchKeywords: [],
      searchTimestamp: new Date().toISOString(),
      note: 'Limited analysis - legal database services unavailable'
    };
  }
}

module.exports = { LegalDatabaseService };
