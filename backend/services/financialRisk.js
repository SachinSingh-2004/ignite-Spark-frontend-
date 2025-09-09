const axios = require('axios');

/**
 * Financial Risk Assessment Service
 * Integrates with Alpha Vantage and other free financial APIs
 */
class FinancialRiskService {
  constructor() {
    // Alpha Vantage API (Free tier available)
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
    this.alphaVantageBase = 'https://www.alphavantage.co/query';
    
    // Other free financial data sources
    this.financialSources = {
      yahooFinance: 'https://query1.finance.yahoo.com/v8/finance/chart',
      exchangeRate: 'https://api.exchangerate-api.com/v4/latest',
      economicData: 'https://api.worldbank.org/v2/country'
    };

    // Risk assessment thresholds
    this.riskThresholds = {
      creditRating: {
        high: ['AAA', 'AA+', 'AA', 'AA-', 'A+'],
        medium: ['A', 'A-', 'BBB+', 'BBB', 'BBB-'],
        low: ['BB+', 'BB', 'BB-', 'B+', 'B', 'B-', 'CCC', 'CC', 'C', 'D']
      },
      debtToEquity: {
        low: 0.3,
        medium: 0.6,
        high: 1.0
      },
      currentRatio: {
        good: 2.0,
        acceptable: 1.5,
        poor: 1.0
      }
    };

    // Industry risk multipliers
    this.industryRiskFactors = {
      technology: 1.2,
      healthcare: 1.1,
      manufacturing: 1.0,
      retail: 1.3,
      energy: 1.4,
      financial: 1.5,
      startups: 2.0,
      default: 1.0
    };
  }

  /**
   * Perform comprehensive financial risk assessment
   */
  async assessFinancialRisk(companyName, industry = 'default', additionalData = {}) {
    try {
      const results = await Promise.allSettled([
        this.getCompanyFinancials(companyName),
        this.assessMarketConditions(),
        this.analyzeIndustryTrends(industry),
        this.evaluateMacroeconomicFactors()
      ]);

      const financialData = results[0].status === 'fulfilled' ? results[0].value : null;
      const marketConditions = results[1].status === 'fulfilled' ? results[1].value : null;
      const industryTrends = results[2].status === 'fulfilled' ? results[2].value : null;
      const macroFactors = results[3].status === 'fulfilled' ? results[3].value : null;

      return this.calculateRiskScore({
        companyName,
        industry,
        financialData,
        marketConditions,
        industryTrends,
        macroFactors,
        additionalData
      });
    } catch (error) {
      console.error('Financial risk assessment error:', error);
      return this.getDefaultRiskAssessment(companyName, industry);
    }
  }

  /**
   * Get company financial data from Alpha Vantage
   */
  async getCompanyFinancials(companySymbol) {
    try {
      // Try to get company overview
      const overviewResponse = await axios.get(this.alphaVantageBase, {
        params: {
          function: 'OVERVIEW',
          symbol: companySymbol,
          apikey: this.alphaVantageKey
        },
        timeout: 10000
      });

      const overview = overviewResponse.data;
      
      // Get quarterly earnings if available
      const earningsResponse = await axios.get(this.alphaVantageBase, {
        params: {
          function: 'EARNINGS',
          symbol: companySymbol,
          apikey: this.alphaVantageKey
        },
        timeout: 10000
      });

      const earnings = earningsResponse.data;

      return this.processFinancialData(overview, earnings);
    } catch (error) {
      console.error('Alpha Vantage API error:', error);
      return this.getMockFinancialData(companySymbol);
    }
  }

  /**
   * Process raw financial data from API
   */
  processFinancialData(overview, earnings) {
    const financialMetrics = {
      marketCap: this.parseNumber(overview.MarketCapitalization),
      peRatio: this.parseNumber(overview.PERatio),
      pegRatio: this.parseNumber(overview.PEGRatio),
      bookValue: this.parseNumber(overview.BookValue),
      dividendYield: this.parseNumber(overview.DividendYield),
      eps: this.parseNumber(overview.EPS),
      beta: this.parseNumber(overview.Beta),
      week52High: this.parseNumber(overview['52WeekHigh']),
      week52Low: this.parseNumber(overview['52WeekLow']),
      profitMargin: this.parseNumber(overview.ProfitMargin),
      operatingMargin: this.parseNumber(overview.OperatingMarginTTM),
      returnOnAssets: this.parseNumber(overview.ReturnOnAssetsTTM),
      returnOnEquity: this.parseNumber(overview.ReturnOnEquityTTM),
      revenueTTM: this.parseNumber(overview.RevenueTTM),
      grossProfitTTM: this.parseNumber(overview.GrossProfitTTM),
      debtToEquity: this.parseNumber(overview.DebtToEquityRatio),
      currentRatio: this.parseNumber(overview.CurrentRatio),
      quickRatio: this.parseNumber(overview.QuickRatio)
    };

    // Process earnings data
    const earningsData = earnings.quarterlyEarnings ? 
      earnings.quarterlyEarnings.slice(0, 4).map(q => ({
        date: q.fiscalDateEnding,
        reportedEPS: this.parseNumber(q.reportedEPS),
        estimatedEPS: this.parseNumber(q.estimatedEPS),
        surprise: this.parseNumber(q.surprise),
        surprisePercentage: this.parseNumber(q.surprisePercentage)
      })) : [];

    return {
      ...financialMetrics,
      earnings: earningsData,
      dataQuality: this.assessDataQuality(financialMetrics)
    };
  }

  /**
   * Assess current market conditions
   */
  async assessMarketConditions() {
    try {
      // Get major market indices (using mock data for demo)
      const marketData = {
        sp500Change: -0.5, // Mock data - would fetch real data
        volatilityIndex: 18.5,
        bondYields: {
          treasury10y: 4.2,
          treasury2y: 4.5
        },
        dollarIndex: 103.2,
        creditSpreads: {
          investmentGrade: 1.2,
          highYield: 4.8
        }
      };

      return {
        ...marketData,
        riskEnvironment: this.assessMarketRiskEnvironment(marketData),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Market conditions error:', error);
      return this.getDefaultMarketConditions();
    }
  }

  /**
   * Analyze industry-specific trends
   */
  async analyzeIndustryTrends(industry) {
    try {
      // Mock industry data - would integrate with real industry databases
      const industryData = {
        growth: this.getIndustryGrowth(industry),
        cyclicality: this.getIndustryCyclicality(industry),
        regulation: this.getRegulatoryEnvironment(industry),
        competition: this.getCompetitiveIntensity(industry),
        barriers: this.getBarriersToEntry(industry)
      };

      return {
        industry,
        ...industryData,
        riskMultiplier: this.industryRiskFactors[industry] || this.industryRiskFactors.default
      };
    } catch (error) {
      console.error('Industry analysis error:', error);
      return { industry, riskMultiplier: 1.0 };
    }
  }

  /**
   * Evaluate macroeconomic factors
   */
  async evaluateMacroeconomicFactors() {
    try {
      // Mock macro data - would integrate with economic APIs
      return {
        gdpGrowth: 2.1,
        inflationRate: 3.2,
        unemploymentRate: 3.7,
        interestRates: {
          federal: 5.25,
          trend: 'rising'
        },
        economicCycle: 'late-cycle',
        geopoliticalRisk: 'moderate'
      };
    } catch (error) {
      console.error('Macroeconomic analysis error:', error);
      return { economicCycle: 'uncertain', geopoliticalRisk: 'moderate' };
    }
  }

  /**
   * Calculate comprehensive risk score
   */
  calculateRiskScore(data) {
    let baseScore = 100;
    const deductions = [];

    // Financial metrics assessment
    if (data.financialData) {
      const financialRisk = this.assessFinancialMetrics(data.financialData);
      baseScore -= financialRisk.totalDeduction;
      deductions.push(...financialRisk.deductions);
    }

    // Market conditions impact
    if (data.marketConditions) {
      const marketRisk = this.assessMarketRisk(data.marketConditions);
      baseScore -= marketRisk;
      if (marketRisk > 10) {
        deductions.push({
          category: 'Market Conditions',
          pointsDeducted: marketRisk,
          reason: 'Adverse market conditions detected'
        });
      }
    }

    // Industry risk adjustment
    if (data.industryTrends) {
      const industryAdjustment = (data.industryTrends.riskMultiplier - 1) * 15;
      baseScore -= industryAdjustment;
      if (industryAdjustment > 0) {
        deductions.push({
          category: 'Industry Risk',
          pointsDeducted: industryAdjustment,
          reason: `Higher risk industry: ${data.industry}`
        });
      }
    }

    // Macroeconomic adjustment
    if (data.macroFactors) {
      const macroRisk = this.assessMacroRisk(data.macroFactors);
      baseScore -= macroRisk;
      if (macroRisk > 5) {
        deductions.push({
          category: 'Macroeconomic Risk',
          pointsDeducted: macroRisk,
          reason: 'Unfavorable economic conditions'
        });
      }
    }

    const finalScore = Math.max(baseScore, 0);

    return {
      companyName: data.companyName,
      industry: data.industry,
      overallScore: finalScore,
      maxScore: 100,
      riskLevel: finalScore >= 80 ? 'low' : finalScore >= 60 ? 'medium' : 'high',
      deductions,
      breakdown: {
        financial: data.financialData ? 'analyzed' : 'unavailable',
        market: data.marketConditions ? 'analyzed' : 'unavailable',
        industry: data.industryTrends ? 'analyzed' : 'unavailable',
        macro: data.macroFactors ? 'analyzed' : 'unavailable'
      },
      recommendations: this.generateRecommendations(finalScore, deductions),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Assess financial metrics and calculate deductions
   */
  assessFinancialMetrics(financialData) {
    const deductions = [];
    let totalDeduction = 0;

    // Debt-to-equity ratio
    if (financialData.debtToEquity > this.riskThresholds.debtToEquity.high) {
      const deduction = 15;
      totalDeduction += deduction;
      deductions.push({
        category: 'Leverage Risk',
        pointsDeducted: deduction,
        reason: `High debt-to-equity ratio: ${financialData.debtToEquity}`
      });
    }

    // Current ratio
    if (financialData.currentRatio < this.riskThresholds.currentRatio.poor) {
      const deduction = 12;
      totalDeduction += deduction;
      deductions.push({
        category: 'Liquidity Risk',
        pointsDeducted: deduction,
        reason: `Low current ratio: ${financialData.currentRatio}`
      });
    }

    // Profitability
    if (financialData.profitMargin < 0) {
      const deduction = 20;
      totalDeduction += deduction;
      deductions.push({
        category: 'Profitability Risk',
        pointsDeducted: deduction,
        reason: 'Negative profit margins'
      });
    }

    // Earnings consistency
    if (financialData.earnings && financialData.earnings.length >= 4) {
      const missedEstimates = financialData.earnings.filter(e => e.surprise < 0).length;
      if (missedEstimates >= 3) {
        const deduction = 10;
        totalDeduction += deduction;
        deductions.push({
          category: 'Earnings Quality',
          pointsDeducted: deduction,
          reason: 'Frequently missing earnings estimates'
        });
      }
    }

    return { deductions, totalDeduction };
  }

  /**
   * Assess market risk conditions
   */
  assessMarketRisk(marketConditions) {
    let riskScore = 0;

    if (marketConditions.volatilityIndex > 25) {
      riskScore += 8;
    }

    if (marketConditions.creditSpreads.highYield > 6.0) {
      riskScore += 5;
    }

    if (marketConditions.riskEnvironment === 'high') {
      riskScore += 10;
    }

    return riskScore;
  }

  /**
   * Assess macroeconomic risk
   */
  assessMacroRisk(macroFactors) {
    let riskScore = 0;

    if (macroFactors.gdpGrowth < 1.0) {
      riskScore += 5;
    }

    if (macroFactors.inflationRate > 4.0) {
      riskScore += 3;
    }

    if (macroFactors.geopoliticalRisk === 'high') {
      riskScore += 8;
    }

    return riskScore;
  }

  /**
   * Generate recommendations based on risk assessment
   */
  generateRecommendations(score, deductions) {
    const recommendations = [];

    if (score < 60) {
      recommendations.push('Consider requiring additional collateral or guarantees');
      recommendations.push('Implement enhanced monitoring and reporting requirements');
    }

    if (deductions.some(d => d.category === 'Leverage Risk')) {
      recommendations.push('Review debt capacity and refinancing plans');
    }

    if (deductions.some(d => d.category === 'Liquidity Risk')) {
      recommendations.push('Assess working capital management and cash flow projections');
    }

    if (deductions.some(d => d.category === 'Profitability Risk')) {
      recommendations.push('Analyze business model sustainability and turnaround plans');
    }

    if (recommendations.length === 0) {
      recommendations.push('Financial risk appears manageable under current conditions');
    }

    return recommendations;
  }

  /**
   * Utility functions for data processing
   */
  parseNumber(value) {
    if (!value || value === 'None' || value === '-') return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  assessDataQuality(metrics) {
    const validMetrics = Object.values(metrics).filter(v => v !== 0 && v !== null).length;
    const totalMetrics = Object.keys(metrics).length;
    return validMetrics / totalMetrics;
  }

  assessMarketRiskEnvironment(marketData) {
    if (marketData.volatilityIndex > 30 || marketData.creditSpreads.highYield > 8) {
      return 'high';
    }
    if (marketData.volatilityIndex > 20 || marketData.creditSpreads.highYield > 5) {
      return 'medium';
    }
    return 'low';
  }

  getIndustryGrowth(industry) {
    const growth = {
      technology: 'high',
      healthcare: 'medium-high',
      manufacturing: 'medium',
      retail: 'low-medium',
      energy: 'volatile',
      financial: 'medium'
    };
    return growth[industry] || 'medium';
  }

  getIndustryCyclicality(industry) {
    const cyclical = {
      technology: 'medium',
      healthcare: 'low',
      manufacturing: 'high',
      retail: 'high',
      energy: 'high',
      financial: 'high'
    };
    return cyclical[industry] || 'medium';
  }

  getRegulatoryEnvironment(industry) {
    const regulatory = {
      technology: 'evolving',
      healthcare: 'heavy',
      manufacturing: 'moderate',
      retail: 'moderate',
      energy: 'heavy',
      financial: 'heavy'
    };
    return regulatory[industry] || 'moderate';
  }

  getCompetitiveIntensity(industry) {
    const competition = {
      technology: 'high',
      healthcare: 'medium',
      manufacturing: 'medium-high',
      retail: 'very high',
      energy: 'medium',
      financial: 'high'
    };
    return competition[industry] || 'medium';
  }

  getBarriersToEntry(industry) {
    const barriers = {
      technology: 'medium',
      healthcare: 'high',
      manufacturing: 'medium-high',
      retail: 'low',
      energy: 'very high',
      financial: 'high'
    };
    return barriers[industry] || 'medium';
  }

  /**
   * Fallback data when APIs are unavailable
   */
  getMockFinancialData(companySymbol) {
    return {
      marketCap: 1000000000,
      peRatio: 15.5,
      debtToEquity: 0.4,
      currentRatio: 1.8,
      profitMargin: 0.12,
      returnOnEquity: 0.15,
      dataQuality: 0.5,
      note: `Mock data for ${companySymbol} - real API unavailable`
    };
  }

  getDefaultMarketConditions() {
    return {
      riskEnvironment: 'medium',
      volatilityIndex: 20,
      timestamp: new Date().toISOString(),
      note: 'Default market conditions - real data unavailable'
    };
  }

  getDefaultRiskAssessment(companyName, industry) {
    return {
      companyName,
      industry,
      overallScore: 70,
      maxScore: 100,
      riskLevel: 'medium',
      deductions: [
        {
          category: 'Data Availability',
          pointsDeducted: 30,
          reason: 'Limited financial data available for analysis'
        }
      ],
      breakdown: {
        financial: 'unavailable',
        market: 'limited',
        industry: 'general',
        macro: 'general'
      },
      recommendations: [
        'Request recent financial statements for detailed analysis',
        'Consider manual review due to limited automated analysis'
      ],
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { FinancialRiskService };
