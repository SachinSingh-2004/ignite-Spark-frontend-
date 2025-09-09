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
  ClockIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalysisPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('student');
  const [showTranslation, setShowTranslation] = useState(false);
  const [translatedContent, setTranslatedContent] = useState('');
  const [translating, setTranslating] = useState(false);

  const personas = [
    { id: 'student', label: 'Student', icon: '🎓' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'lawyer', label: 'Lawyer', icon: '⚖️' },
    { id: 'senior', label: 'Senior', icon: '👴' }
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
      
      // Redirect to education loan page if it's an education loan document
      if (result.analysis.documentType === 'education-loan' && result.analysis.specialAnalysis) {
        navigate(`/education-loan/${id}`);
        return;
      }
      
      setAnalysis(result);
    } catch (err) {
      setError('Failed to load analysis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    try {
      setTranslating(true);
      const apiService = await import('../services/apiService');
      const result = await apiService.default.translateContent(
        id, 
        'hi',
        'summary'
      );
      setTranslatedContent(result.translatedText);
      setShowTranslation(true);
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setTranslating(false);
    }
  };

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

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested analysis could not be found.'}</p>
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

  // Prepare chart data
  const riskData = analysis.analysis.riskAssessment?.risks?.map(risk => ({
    name: risk.category,
    value: risk.level === 'high' ? 3 : risk.level === 'medium' ? 2 : 1,
    level: risk.level
  })) || [];

  const pieData = [
    { name: 'High Risk', value: riskData.filter(r => r.level === 'high').length, color: riskColors.high },
    { name: 'Medium Risk', value: riskData.filter(r => r.level === 'medium').length, color: riskColors.medium },
    { name: 'Low Risk', value: riskData.filter(r => r.level === 'low').length, color: riskColors.low }
  ].filter(item => item.value > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-2xl font-bold text-gray-900">
                Legal Docs Demystifier
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Home
              </button>
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
                Analysis Results
              </h1>
              <p className="text-xl text-gray-600">
                {analysis.filename}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-full text-white font-semibold ${
                analysis.analysis.riskAssessment?.overall === 'high' ? 'bg-red-500' :
                analysis.analysis.riskAssessment?.overall === 'medium' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}>
                {(analysis.analysis.riskAssessment?.overall || 'unknown').toUpperCase()} RISK
              </div>
            </div>
          </div>

          {/* Persona Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              View as:
            </label>
            <div className="flex space-x-2">
              {personas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona.id)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedPersona === persona.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                  }`}
                >
                  <span className="mr-2">{persona.icon}</span>
                  {persona.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Document Summary</h2>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {analysis.analysis.summary || 'No summary available.'}
                </p>
              </div>

              {/* Translation */}
              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={handleTranslate}
                  disabled={translating}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <GlobeAltIcon className="h-4 w-4 mr-2" />
                  {translating ? 'Translating...' : 'Translate to Hindi'}
                </button>
                
                {showTranslation && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Hindi Translation:</h3>
                    <p className="text-blue-800">{translatedContent}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Key Clauses */}
            {analysis.analysis.keyParts && analysis.analysis.keyParts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Key Clauses</h2>
                
                <div className="space-y-4">
                  {analysis.analysis.keyParts.map((clause, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{clause.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          clause.importance === 'high' ? 'bg-red-100 text-red-800' :
                          clause.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {clause.importance?.toUpperCase()} PRIORITY
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 rounded p-3 mb-4">
                        <p className="text-sm text-gray-700 italic">"{clause.content}"</p>
                      </div>
                      
                      <p className="text-gray-600">{clause.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items */}
            {analysis.analysis.actionItems && analysis.analysis.actionItems.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Action Items</h2>
                
                <div className="space-y-4">
                  {analysis.analysis.actionItems.map((action, index) => (
                    <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-800">{action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Risk Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Overview</h3>
              
              {pieData.length > 0 && (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="mt-4 space-y-2">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link
                  to={`/chat/${id}`}
                  className="w-full flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-3" />
                  Ask Questions
                </Link>
                
                <Link
                  to={`/what-if/${id}`}
                  className="w-full flex items-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-3" />
                  What-If Analysis
                </Link>
                
                <Link
                  to={`/enhanced-analysis/${id}`}
                  className="w-full flex items-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <ShieldCheckIcon className="h-5 w-5 mr-3" />
                  Enhanced Analysis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
