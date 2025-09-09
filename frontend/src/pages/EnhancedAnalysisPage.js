import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  GlobeAltIcon,
  UserCircleIcon,
  ClockIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const EnhancedAnalysisPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [enhancedAnalysis, setEnhancedAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enhancedLoading, setEnhancedLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('technology');
  
  const industries = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'financial', label: 'Financial Services' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail' },
    { value: 'energy', label: 'Energy' },
    { value: 'default', label: 'Other' }
  ];

  const riskColors = {
    low: '#10b981',
    medium: '#f59e0b', 
    high: '#ef4444'
  };

  useEffect(() => {
    loadAnalysis();
  }, [id]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      const apiService = await import('../services/apiService');
      const result = await apiService.default.getAnalysis(id);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to load analysis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runEnhancedAnalysis = async () => {
    if (!analysis?.analysis?.content) {
      alert('No document content available for enhanced analysis');
      return;
    }

    try {
      setEnhancedLoading(true);
      const apiService = await import('../services/apiService');
      
      const result = await apiService.default.enhancedAnalyze(
        analysis.analysis.content,
        'contract',
        companyName || null,
        industry,
        null
      );
      
      setEnhancedAnalysis(result);
    } catch (err) {
      setError('Enhanced analysis failed: ' + err.message);
      console.error(err);
    } finally {
      setEnhancedLoading(false);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const formatDeduction = (deduction, index) => (
    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900">{deduction.category}</h4>
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
          -{deduction.pointsDeducted} points
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-2">{deduction.reason}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Source: {deduction.source}</span>
        {deduction.weight && <span>Weight: {(deduction.weight * 100).toFixed(0)}%</span>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error && !analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-2xl font-bold text-gray-900">
                Enhanced Analysis
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to={`/analysis/${id}`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Basic Analysis
              </Link>
              <Link
                to={`/chat/${id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                Ask AI
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Enhanced Risk Analysis
              </h1>
              <p className="text-xl text-gray-600">
                {analysis?.filename}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-full text-white font-semibold ${
                enhancedAnalysis?.analysis?.enhancedCounterpartyRisk?.riskLevel === 'high' ? 'bg-red-500' :
                enhancedAnalysis?.analysis?.enhancedCounterpartyRisk?.riskLevel === 'medium' ? 'bg-yellow-500' :
                enhancedAnalysis?.analysis?.enhancedCounterpartyRisk?.riskLevel === 'low' ? 'bg-green-500' :
                'bg-gray-500'
              }`}>
                {enhancedAnalysis?.analysis?.enhancedCounterpartyRisk?.riskLevel?.toUpperCase() || 'UNKNOWN'} RISK
              </div>
            </div>
          </div>

          {/* Enhanced Analysis Configuration */}
          {!enhancedAnalysis && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Configure Enhanced Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Counterparty Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name for financial analysis"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {industries.map(ind => (
                      <option key={ind.value} value={ind.value}>
                        {ind.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={runEnhancedAnalysis}
                disabled={enhancedLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                <ChartBarIcon className="h-5 w-5 mr-2" />
                {enhancedLoading ? 'Running Enhanced Analysis...' : 'Run Enhanced Analysis'}
              </button>
            </div>
          )}
        </div>

        {enhancedAnalysis && (
          <div className="space-y-8">
            {/* Enhanced Counterparty Risk Score */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <ShieldCheckIcon className="h-6 w-6 mr-2 text-blue-600" />
                Enhanced Counterparty Risk Assessment
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Risk Score Display */}
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-4xl font-bold text-white ${
                    enhancedAnalysis.analysis.enhancedCounterpartyRisk.riskLevel === 'high' ? 'bg-red-500' :
                    enhancedAnalysis.analysis.enhancedCounterpartyRisk.riskLevel === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}>
                    {enhancedAnalysis.analysis.enhancedCounterpartyRisk.score}
                  </div>
                  <p className="text-2xl font-semibold text-gray-900 mt-4">
                    Risk Score
                  </p>
                  <p className="text-lg text-gray-600">
                    out of {enhancedAnalysis.analysis.enhancedCounterpartyRisk.maxScore}
                  </p>
                  <div className="mt-4">
                    <span className="text-sm text-gray-500">
                      Confidence: {enhancedAnalysis.analysis.enhancedCounterpartyRisk.confidence}%
                    </span>
                  </div>
                </div>

                {/* Risk Methodology */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Scoring Methodology</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Document Analysis</span>
                      <span className="font-medium">40% weight</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Financial Analysis</span>
                      <span className="font-medium">35% weight</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Legal Structure</span>
                      <span className="font-medium">25% weight</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    {enhancedAnalysis.analysis.enhancedCounterpartyRisk.methodology}
                  </p>
                </div>
              </div>

              {/* Detailed Deductions */}
              {enhancedAnalysis.analysis.enhancedCounterpartyRisk.deductions.length > 0 && (
                <div className="mt-8">
                  <button
                    onClick={() => toggleSection('deductions')}
                    className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <span className="text-lg font-semibold text-gray-900">
                      Detailed Point Deductions ({enhancedAnalysis.analysis.enhancedCounterpartyRisk.deductions.length})
                    </span>
                    {expandedSections.deductions ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                  </button>
                  
                  {expandedSections.deductions && (
                    <div className="mt-4">
                      {enhancedAnalysis.analysis.enhancedCounterpartyRisk.deductions.map((deduction, index) => 
                        formatDeduction(deduction, index)
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Executive Summary */}
            {enhancedAnalysis.analysis.executiveSummary && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <DocumentTextIcon className="h-6 w-6 mr-2 text-blue-600" />
                  Executive Summary
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {enhancedAnalysis.analysis.executiveSummary.score}
                    </div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {enhancedAnalysis.analysis.executiveSummary.keyFindings.length}
                    </div>
                    <div className="text-sm text-gray-600">Key Findings</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {enhancedAnalysis.analysis.executiveSummary.primaryConcerns.length}
                    </div>
                    <div className="text-sm text-gray-600">Concerns</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {enhancedAnalysis.analysis.executiveSummary.strengths.length}
                    </div>
                    <div className="text-sm text-gray-600">Strengths</div>
                  </div>
                </div>

                {/* Key Findings */}
                {enhancedAnalysis.analysis.executiveSummary.keyFindings.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Findings</h3>
                    <ul className="space-y-2">
                      {enhancedAnalysis.analysis.executiveSummary.keyFindings.map((finding, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Primary Concerns */}
                {enhancedAnalysis.analysis.executiveSummary.primaryConcerns.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Primary Concerns</h3>
                    <ul className="space-y-2">
                      {enhancedAnalysis.analysis.executiveSummary.primaryConcerns.map((concern, index) => (
                        <li key={index} className="flex items-start">
                          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next Steps */}
                {enhancedAnalysis.analysis.executiveSummary.nextSteps.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Next Steps</h3>
                    <ol className="space-y-2">
                      {enhancedAnalysis.analysis.executiveSummary.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs font-medium rounded-full mr-2 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Comprehensive Recommendations */}
            {enhancedAnalysis.analysis.comprehensiveRecommendations && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <InformationCircleIcon className="h-6 w-6 mr-2 text-blue-600" />
                  Comprehensive Recommendations
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Immediate Actions */}
                  {enhancedAnalysis.analysis.comprehensiveRecommendations.immediate.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-red-900 mb-4">Immediate Actions</h3>
                      <ul className="space-y-2">
                        {enhancedAnalysis.analysis.comprehensiveRecommendations.immediate.map((action, index) => (
                          <li key={index} className="text-sm text-red-800">• {action}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Short-term Actions */}
                  {enhancedAnalysis.analysis.comprehensiveRecommendations.shortTerm.length > 0 && (
                    <div className="bg-yellow-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-yellow-900 mb-4">Short-term Actions</h3>
                      <ul className="space-y-2">
                        {enhancedAnalysis.analysis.comprehensiveRecommendations.shortTerm.map((action, index) => (
                          <li key={index} className="text-sm text-yellow-800">• {action}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Long-term Actions */}
                  {enhancedAnalysis.analysis.comprehensiveRecommendations.longTerm.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">Long-term Actions</h3>
                      <ul className="space-y-2">
                        {enhancedAnalysis.analysis.comprehensiveRecommendations.longTerm.map((action, index) => (
                          <li key={index} className="text-sm text-blue-800">• {action}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Monitoring */}
                  {enhancedAnalysis.analysis.comprehensiveRecommendations.monitoring.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-green-900 mb-4">Ongoing Monitoring</h3>
                      <ul className="space-y-2">
                        {enhancedAnalysis.analysis.comprehensiveRecommendations.monitoring.map((action, index) => (
                          <li key={index} className="text-sm text-green-800">• {action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technical Analysis Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <EyeIcon className="h-6 w-6 mr-2 text-blue-600" />
                Technical Analysis Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">
                    {enhancedAnalysis.metadata.servicesUsed.length}
                  </div>
                  <div className="text-sm text-gray-600">Services Used</div>
                  <div className="mt-2 text-xs text-gray-500">
                    {enhancedAnalysis.metadata.servicesUsed.join(', ')}
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">
                    {enhancedAnalysis.metadata.processingTime || 0}ms
                  </div>
                  <div className="text-sm text-gray-600">Processing Time</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">
                    {new Date(enhancedAnalysis.metadata.analysisTimestamp).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">Analysis Date</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && enhancedAnalysis && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <div className="text-sm text-red-600">{error}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAnalysisPage;
