/**
 * Integration Test for Enhanced Analysis API
 * Run this test to verify the enhanced analysis endpoints are working
 */

const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000';
const TEST_TIMEOUT = 30000; // 30 seconds

// Sample contract text for testing
const SAMPLE_CONTRACT = `
SERVICES AGREEMENT

This Services Agreement ("Agreement") is entered into as of [DATE] between Company A, a corporation organized under the laws of [STATE] ("Client"), and Service Provider B, a limited liability company organized under the laws of [STATE] ("Provider").

1. SERVICES
Provider agrees to provide consulting services as described in Exhibit A attached hereto and incorporated herein by reference.

2. PAYMENT
Client agrees to pay Provider the fees set forth in Exhibit A. Payment terms are net 30 days from invoice date.

3. CONFIDENTIALITY
Both parties acknowledge that they may have access to certain confidential information. Each party agrees to maintain the confidentiality of such information.

4. TERMINATION
This Agreement may be terminated by either party with thirty (30) days written notice.

5. LIABILITY
Provider's total liability under this Agreement shall not exceed the total amount paid by Client to Provider in the twelve (12) months preceding the claim.

6. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of [STATE].

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.
`;

/**
 * Test the enhanced analysis endpoint
 */
async function testEnhancedAnalysis() {
  console.log('🧪 Testing Enhanced Analysis Endpoint...\n');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/enhanced-analysis/analyze`, {
      documentText: SAMPLE_CONTRACT,
      documentType: 'contract',
      companyName: 'Service Provider B',
      industry: 'technology'
    }, {
      timeout: TEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Enhanced Analysis Response Status:', response.status);
    console.log('📊 Analysis Results:');
    console.log('-------------------');
    
    const analysis = response.data.analysis;
    
    // Document Analysis Results
    if (analysis.documentAnalysis) {
      console.log('\n📄 Document Analysis:');
      console.log(`   Sentiment: ${analysis.documentAnalysis.sentiment?.classification || 'N/A'} (${analysis.documentAnalysis.sentiment?.score || 'N/A'})`);
      console.log(`   Risk Level: ${analysis.documentAnalysis.riskFactors?.overall || 'N/A'}`);
      console.log(`   Legal Clauses Found: ${analysis.documentAnalysis.legalClauses?.length || 0}`);
      
      if (analysis.documentAnalysis.entities) {
        console.log(`   Entities: ${JSON.stringify(analysis.documentAnalysis.entities, null, 2)}`);
      }
    }

    // Enhanced Counterparty Risk
    if (analysis.enhancedCounterpartyRisk) {
      console.log('\n🎯 Enhanced Counterparty Risk:');
      console.log(`   Score: ${analysis.enhancedCounterpartyRisk.score}/100`);
      console.log(`   Risk Level: ${analysis.enhancedCounterpartyRisk.riskLevel}`);
      console.log(`   Confidence: ${analysis.enhancedCounterpartyRisk.confidence}%`);
      
      if (analysis.enhancedCounterpartyRisk.deductions.length > 0) {
        console.log('\n   Deductions:');
        analysis.enhancedCounterpartyRisk.deductions.forEach((deduction, index) => {
          console.log(`   ${index + 1}. ${deduction.category}: -${deduction.pointsDeducted} points`);
          console.log(`      Reason: ${deduction.reason}`);
          console.log(`      Source: ${deduction.source}`);
        });
      }
    }

    // Legal Precedents
    if (analysis.legalPrecedents) {
      console.log('\n⚖️ Legal Analysis:');
      console.log(`   Precedents Found: ${analysis.legalPrecedents.precedents?.length || 0}`);
      console.log(`   Contract Structure Score: ${analysis.legalPrecedents.patterns?.contractStructure?.score || 'N/A'}`);
      console.log(`   Risk Distribution: ${analysis.legalPrecedents.patterns?.riskDistribution?.type || 'N/A'}`);
    }

    // Financial Risk (if available)
    if (analysis.financialRisk) {
      console.log('\n💰 Financial Risk:');
      console.log(`   Score: ${analysis.financialRisk.overallScore}/100`);
      console.log(`   Risk Level: ${analysis.financialRisk.riskLevel}`);
      console.log(`   Deductions: ${analysis.financialRisk.deductions.length}`);
    }

    // Recommendations
    if (analysis.comprehensiveRecommendations) {
      console.log('\n💡 Recommendations:');
      const recs = analysis.comprehensiveRecommendations;
      if (recs.immediate.length > 0) {
        console.log('   Immediate:');
        recs.immediate.forEach((rec, i) => console.log(`   ${i + 1}. ${rec}`));
      }
      if (recs.shortTerm.length > 0) {
        console.log('   Short Term:');
        recs.shortTerm.forEach((rec, i) => console.log(`   ${i + 1}. ${rec}`));
      }
    }

    // Executive Summary
    if (analysis.executiveSummary) {
      console.log('\n📋 Executive Summary:');
      const summary = analysis.executiveSummary;
      console.log(`   Overall Risk: ${summary.overallRisk}`);
      console.log(`   Score: ${summary.score}/100`);
      console.log(`   Key Findings: ${summary.keyFindings.length}`);
      console.log(`   Primary Concerns: ${summary.primaryConcerns.length}`);
      console.log(`   Strengths: ${summary.strengths.length}`);
    }

    console.log('\n✅ Enhanced Analysis Test PASSED!');
    return true;

  } catch (error) {
    console.error('❌ Enhanced Analysis Test FAILED:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

/**
 * Test the health endpoint
 */
async function testHealthEndpoint() {
  console.log('🏥 Testing Health Endpoint...\n');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/enhanced-analysis/health`, {
      timeout: 5000
    });

    console.log('✅ Health Check Status:', response.status);
    console.log('🔧 Available Services:');
    response.data.services.forEach(service => {
      console.log(`   - ${service}`);
    });
    console.log('📅 Service Version:', response.data.version);
    console.log('\n✅ Health Check Test PASSED!');
    return true;

  } catch (error) {
    console.error('❌ Health Check Test FAILED:');
    console.error('Error:', error.message);
    return false;
  }
}

/**
 * Test translation endpoint
 */
async function testTranslation() {
  console.log('🌍 Testing Translation Endpoint...\n');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/enhanced-analysis/translate`, {
      text: 'This is a contract agreement between two parties.',
      targetLanguage: 'hi', // Hindi
      sourceLanguage: 'en'
    }, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Translation Response Status:', response.status);
    console.log('🔤 Original Text: "This is a contract agreement between two parties."');
    console.log('🔤 Translated Text:', response.data.translation.translatedText);
    console.log('🎯 Translation Service:', response.data.translation.service);
    console.log('📊 Confidence:', response.data.translation.confidence);
    console.log('\n✅ Translation Test PASSED!');
    return true;

  } catch (error) {
    console.error('❌ Translation Test FAILED:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 Starting Enhanced Analysis Integration Tests\n');
  console.log('=' .repeat(50));
  
  const results = {
    health: false,
    translation: false,
    enhancedAnalysis: false
  };

  // Test health endpoint first
  results.health = await testHealthEndpoint();
  console.log('\n' + '=' .repeat(50));

  // Test translation
  results.translation = await testTranslation();
  console.log('\n' + '=' .repeat(50));

  // Test main enhanced analysis
  results.enhancedAnalysis = await testEnhancedAnalysis();
  console.log('\n' + '=' .repeat(50));

  // Summary
  console.log('\n📊 TEST SUMMARY:');
  console.log('================');
  console.log(`Health Check: ${results.health ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Translation: ${results.translation ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Enhanced Analysis: ${results.enhancedAnalysis ? '✅ PASSED' : '❌ FAILED'}`);
  
  const totalPassed = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${totalPassed}/${totalTests} tests passed`);
  
  if (totalPassed === totalTests) {
    console.log('🎉 All tests PASSED! Enhanced analysis integration is working correctly.');
  } else {
    console.log('⚠️ Some tests FAILED. Please check the error messages above.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testEnhancedAnalysis,
  testHealthEndpoint,
  testTranslation,
  runAllTests
};
