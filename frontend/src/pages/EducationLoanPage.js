import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  AcademicCapIcon,
  BanknotesIcon,
  ChartBarIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  StarIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const EducationLoanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState('analysis');

  useEffect(() => {
    loadAnalysis();
  }, [id]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      const apiService = await import('../services/apiService');
      const result = await apiService.default.getAnalysis(id);
      
      if (result.analysis.documentType !== 'education-loan') {
        // Redirect to regular analysis page if not an education loan
        navigate(`/analysis/${id}`);
        return;
      }
      
      setAnalysis(result);
    } catch (err) {
      setError('Failed to load education loan analysis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading education loan analysis...</p>
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

  const loanInfo = analysis.analysis.extractedInfo || {};
  const bankComparison = analysis.analysis.bankComparison;
  const rankings = bankComparison?.rankings || [];

  // Prepare chart data
  const bankScoreData = rankings.slice(0, 6).map(bank => ({
    name: bank.bankName.replace(/Bank|Ltd\.|Limited/g, '').trim(),
    score: bank.score,
    interestRate: parseFloat(bank.keyMetrics?.interestRate?.split('%')[0] || 0)
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <span className="text-2xl font-bold text-gray-900">Education Loan Analyzer</span>
                <p className="text-sm text-gray-500">AI-Powered Bank Comparison</p>
              </div>
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
                Ask AI Questions
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Education Loan Analysis & Comparison
          </h1>
          <p className="text-xl text-gray-600">
            {analysis.filename} • AI-powered analysis with real bank data
          </p>
          {loanInfo.bankName && (
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              <BuildingLibraryIcon className="h-4 w-4 mr-1" />
              Current Bank: {loanInfo.bankName}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'analysis', label: 'Loan Analysis', icon: DocumentTextIcon },
                { id: 'comparison', label: 'Bank Comparison', icon: ChartBarIcon },
                { id: 'recommendations', label: 'Recommendations', icon: TrophyIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content based on selected tab */}
        {selectedTab === 'analysis' && (
          <div className="space-y-8">
            {/* Extracted Loan Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <DocumentTextIcon className="h-6 w-6 mr-2 text-blue-600" />
                Extracted Loan Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Loan Amount</h3>
                    <p className="text-blue-700">
                      {loanInfo.loanAmount?.requested || 'Not specified'}
                      {loanInfo.loanAmount?.approved && 
                        ` (Approved: ${loanInfo.loanAmount.approved})`
                      }
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">Interest Rate</h3>
                    <p className="text-green-700">{loanInfo.interestRate || 'Not specified'}</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">Processing Fee</h3>
                    <p className="text-purple-700">{loanInfo.processingFee || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-semibold text-orange-900 mb-2">Repayment Tenure</h3>
                    <p className="text-orange-700">{loanInfo.tenure || 'Not specified'}</p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-2">Collateral</h3>
                    <p className="text-red-700">{loanInfo.collateral || 'Not specified'}</p>
                  </div>
                  
                  <div className="p-4 bg-teal-50 rounded-lg">
                    <h3 className="font-semibold text-teal-900 mb-2">Moratorium Period</h3>
                    <p className="text-teal-700">{loanInfo.moratorium || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Special Features */}
              {loanInfo.specialFeatures && loanInfo.specialFeatures.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Special Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {loanInfo.specialFeatures.map((feature, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Summary */}
            {analysis.analysis.analysis && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Analysis Summary</h2>
                
                <div className="prose max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {analysis.analysis.analysis.summary}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  {/* Strengths */}
                  {analysis.analysis.analysis.strengths && analysis.analysis.analysis.strengths.length > 0 && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {analysis.analysis.analysis.strengths.map((strength, index) => (
                          <li key={index} className="text-green-700 flex items-start">
                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Concerns */}
                  {analysis.analysis.analysis.concerns && analysis.analysis.analysis.concerns.length > 0 && (
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h3 className="font-semibold text-red-900 mb-3 flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                        Concerns
                      </h3>
                      <ul className="space-y-2">
                        {analysis.analysis.analysis.concerns.map((concern, index) => (
                          <li key={index} className="text-red-700 flex items-start">
                            <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'comparison' && bankComparison && (
          <div className="space-y-8">
            {/* Bank Ranking Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <ChartBarIcon className="h-6 w-6 mr-2 text-blue-600" />
                Bank Comparison Scores
              </h2>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bankScoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Bank Rankings */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Detailed Bank Rankings</h2>
              
              <div className="space-y-4">
                {rankings.map((bank, index) => (
                  <div key={bank.bankId} className={`p-6 rounded-lg border-2 ${
                    index === 0 ? 'border-yellow-400 bg-yellow-50' : 
                    index === 1 ? 'border-gray-400 bg-gray-50' :
                    index === 2 ? 'border-orange-400 bg-orange-50' :
                    'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mr-4 ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-500' :
                          index === 2 ? 'bg-orange-500' :
                          'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{bank.bankName}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-2xl font-bold text-blue-600 mr-2">{bank.score?.toFixed(1)}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(bank.score / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      {index === 0 && (
                        <div className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          <TrophyIcon className="h-4 w-4 mr-1" />
                          Recommended
                        </div>
                      )}
                    </div>

                    {/* Key Metrics */}
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600 font-medium">Interest Rate</p>
                        <p className="text-lg font-bold text-blue-900">{bank.keyMetrics?.interestRate || 'N/A'}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600 font-medium">Processing Fee</p>
                        <p className="text-lg font-bold text-green-900">{bank.keyMetrics?.processingFee || 'N/A'}</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-600 font-medium">Max Amount</p>
                        <p className="text-lg font-bold text-purple-900">{bank.keyMetrics?.maxLoanAmount || 'N/A'}</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm text-orange-600 font-medium">Tenure</p>
                        <p className="text-lg font-bold text-orange-900">{bank.keyMetrics?.tenure || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Strengths and Weaknesses */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Strengths
                        </h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          {bank.strengths?.map((strength, i) => (
                            <li key={i}>• {strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-900 mb-2 flex items-center">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          Weaknesses
                        </h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          {bank.weaknesses?.map((weakness, i) => (
                            <li key={i}>• {weakness}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'recommendations' && bankComparison?.recommendation && (
          <div className="space-y-8">
            {/* Top Recommendation */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center mb-6">
                <TrophyIcon className="h-8 w-8 mr-3 text-yellow-300" />
                <h2 className="text-3xl font-bold">Our Top Recommendation</h2>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-xl p-6">
                <h3 className="text-2xl font-semibold mb-4">{bankComparison.recommendation.topChoice.bankName}</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Why we recommend this bank:</h4>
                    <ul className="space-y-2">
                      {bankComparison.recommendation.topChoice.reasons?.map((reason, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 mr-2 text-green-300 flex-shrink-0 mt-0.5" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {bankComparison.recommendation.topChoice.estimatedSavings && (
                    <div className="bg-green-500 bg-opacity-20 rounded-lg p-4">
                      <h4 className="font-semibold text-green-100 mb-2">Potential Savings:</h4>
                      <p className="text-green-100">{bankComparison.recommendation.topChoice.estimatedSavings}</p>
                    </div>
                  )}

                  {bankComparison.recommendation.topChoice.nextSteps && (
                    <div>
                      <h4 className="font-semibold mb-2">Next Steps:</h4>
                      <ol className="space-y-2">
                        {bankComparison.recommendation.topChoice.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="bg-white bg-opacity-20 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cost Comparison */}
            {bankComparison.costComparison && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <BanknotesIcon className="h-6 w-6 mr-2 text-green-600" />
                  Cost Comparison
                </h2>
                
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Loan Amount:</strong> {bankComparison.costComparison.loanAmount} • 
                    <strong> Tenure:</strong> {bankComparison.costComparison.tenure}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-4 text-left font-semibold">Bank</th>
                        <th className="border border-gray-300 p-4 text-left font-semibold">EMI</th>
                        <th className="border border-gray-300 p-4 text-left font-semibold">Total Interest</th>
                        <th className="border border-gray-300 p-4 text-left font-semibold">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bankComparison.costComparison.comparison?.map((bank, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 p-4 font-medium">{bank.bankName}</td>
                          <td className="border border-gray-300 p-4 text-green-600 font-semibold">{bank.emi}</td>
                          <td className="border border-gray-300 p-4 text-orange-600 font-semibold">{bank.totalInterest}</td>
                          <td className="border border-gray-300 p-4 text-blue-600 font-semibold">{bank.totalAmount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Alternative Options */}
            {bankComparison.recommendation.alternatives && bankComparison.recommendation.alternatives.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Alternative Options</h2>
                
                <div className="space-y-4">
                  {bankComparison.recommendation.alternatives.map((alt, index) => (
                    <div key={index} className="p-6 border border-gray-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{alt.bankName}</h3>
                      <p className="text-gray-600">
                        <strong>Consider when:</strong> {alt.whenToConsider}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationLoanPage;
