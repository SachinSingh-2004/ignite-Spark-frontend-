const { OpenAI } = require('openai');

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
    });
  }

  async detectDocumentType(documentText) {
    try {
      const prompt = `
Analyze the following document and determine its type. Look for keywords and patterns that indicate what kind of document this is.

Document Content:
${documentText.substring(0, 2000)}

Respond with ONLY one of these document types:
- education-loan
- contract
- agreement
- policy
- invoice
- lease
- nda
- employment
- other

Document Type:`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a document classification expert. Analyze documents and classify them accurately."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 50,
        temperature: 0.1
      });

      return completion.choices[0].message.content.trim().toLowerCase();
    } catch (error) {
      console.error('Document type detection error:', error);
      return 'other';
    }
  }

  async analyzeDocument(documentText, persona = 'general') {
    try {
      const personaPrompts = {
        student: "Explain this legal document in simple terms that a student would understand.",
        business: "Analyze this legal document from a business owner's perspective, focusing on operational impacts.",
        lawyer: "Provide a detailed legal analysis of this document with technical terminology.",
        senior: "Explain this legal document in clear, simple language for senior citizens."
      };

      const prompt = `
${personaPrompts[persona] || personaPrompts.student}

Please analyze the following legal document and provide:

1. **Plain Language Summary**: A clear, concise summary in everyday language
2. **Key Clauses**: Identify and highlight the most important clauses (amounts, tenure, penalties, obligations)
3. **Risk Assessment**: Categorize risks as Low, Medium, or High with explanations
4. **Important Dates/Deadlines**: Any time-sensitive information
5. **Action Items**: What the user needs to do or be aware of
6. **Red Flags**: Any concerning terms or conditions

Document Content:
${documentText}

Please format your response as a structured JSON with the following format:
{
  "summary": "Plain language summary here",
  "keyParts": [
    {
      "title": "Clause name",
      "content": "Clause content",
      "importance": "high/medium/low",
      "explanation": "Why this is important"
    }
  ],
  "riskAssessment": {
    "overall": "low/medium/high",
    "risks": [
      {
        "category": "Risk type",
        "level": "low/medium/high",
        "description": "Description of risk",
        "mitigation": "How to mitigate this risk"
      }
    ]
  },
  "importantDates": [
    {
      "date": "Date if available",
      "description": "What happens on this date"
    }
  ],
  "actionItems": [
    "Action item 1",
    "Action item 2"
  ],
  "redFlags": [
    "Red flag 1",
    "Red flag 2"
  ]
}
`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal document analysis expert. Provide clear, accurate, and helpful analysis of legal documents."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      });

      const response = completion.choices[0].message.content;
      
      try {
        return JSON.parse(response);
      } catch (parseError) {
        // If JSON parsing fails, return a structured response
        return {
          summary: response,
          keyParts: [],
          riskAssessment: { overall: "medium", risks: [] },
          importantDates: [],
          actionItems: [],
          redFlags: []
        };
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to analyze document with AI');
    }
  }

  async chatWithDocument(documentContext, userQuestion, conversationHistory = []) {
    try {
      const messages = [
        {
          role: "system",
          content: `You are a helpful legal assistant. You have access to the following document context: ${documentContext}. 
          Answer questions about this document clearly and helpfully. If the question is not related to the document, 
          politely redirect the user to ask about the document content.`
        },
        ...conversationHistory,
        {
          role: "user",
          content: userQuestion
        }
      ];

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.5
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI Chat API error:', error);
      throw new Error('Failed to get response from AI');
    }
  }

  async translateText(text, targetLanguage = 'hi') {
    try {
      const languageNames = {
        'hi': 'Hindi',
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French'
      };

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the given text to ${languageNames[targetLanguage] || targetLanguage} while maintaining the legal meaning and context.`
          },
          {
            role: "user",
            content: text
          }
        ],
        max_tokens: 1500,
        temperature: 0.2
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Failed to translate text');
    }
  }

  async simulateWhatIf(originalAnalysis, changes) {
    try {
      const prompt = `
Based on the original document analysis below, simulate what would happen if the following changes were made:

Original Analysis:
${JSON.stringify(originalAnalysis, null, 2)}

Proposed Changes:
${JSON.stringify(changes, null, 2)}

Please provide an updated risk assessment and impact analysis showing:
1. How the risks would change
2. New action items
3. Updated recommendations
4. Potential consequences

Format as JSON with the same structure as the original analysis.
`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal risk analysis expert. Provide accurate 'what-if' scenario analysis for legal document changes."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      });

      const response = completion.choices[0].message.content;
      
      try {
        return JSON.parse(response);
      } catch (parseError) {
        return {
          summary: response,
          riskAssessment: { overall: "medium", risks: [] },
          changes: changes,
          impact: "Analysis provided in summary"
        };
      }
    } catch (error) {
      console.error('What-if simulation error:', error);
      throw new Error('Failed to simulate scenario');
    }
  }

  async analyzeEducationLoan(documentText, bankData) {
    try {
      const prompt = `
Analyze this education loan document and extract key information for comparison with other banks:

Document Content:
${documentText}

Extract and identify:
1. Bank name and loan product
2. Interest rate offered
3. Loan amount requested/approved
4. Processing fees
5. Collateral requirements
6. Repayment terms and tenure
7. Moratorium period
8. Special conditions or features
9. Eligibility criteria mentioned
10. Any red flags or concerning terms

Format as JSON:
{
  "extractedInfo": {
    "bankName": "Bank name from document",
    "loanAmount": {
      "requested": "Amount requested",
      "approved": "Amount approved if mentioned"
    },
    "interestRate": "Interest rate offered",
    "processingFee": "Processing fee amount or percentage",
    "tenure": "Repayment tenure",
    "collateral": "Collateral requirements",
    "moratorium": "Moratorium period",
    "specialFeatures": ["List of special features"]
  },
  "analysis": {
    "summary": "Brief summary of the loan offer",
    "strengths": ["Positive aspects of this loan"],
    "concerns": ["Areas of concern or red flags"],
    "suitability": "Assessment of loan suitability"
  }
}
`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an education loan expert who analyzes loan documents and extracts key financial information accurately."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      });

      const response = completion.choices[0].message.content;
      
      try {
        const parsedResponse = JSON.parse(response);
        // Add bank comparison
        parsedResponse.bankComparison = await this.compareBanks(parsedResponse.extractedInfo, bankData);
        return parsedResponse;
      } catch (parseError) {
        return {
          extractedInfo: {},
          analysis: {
            summary: response,
            strengths: [],
            concerns: [],
            suitability: "Analysis provided in summary"
          },
          bankComparison: null
        };
      }
    } catch (error) {
      console.error('Education loan analysis error:', error);
      throw new Error('Failed to analyze education loan document');
    }
  }

  async compareBanks(extractedLoanInfo, bankData) {
    try {
      const banksInfo = JSON.stringify(bankData.educationLoans.banks, null, 2);
      
      const prompt = `
Compare the extracted loan information with other banks and provide recommendations:

Extracted Loan Info:
${JSON.stringify(extractedLoanInfo, null, 2)}

Bank Comparison Data:
${banksInfo}

Provide a comprehensive comparison and recommendation:

1. Rank all banks from best to worst based on the loan requirements
2. Calculate scores for each bank considering:
   - Interest rates (25% weight)
   - Processing fees (10% weight) 
   - Loan limits (20% weight)
   - Repayment flexibility (15% weight)
   - Moratorium period (10% weight)
   - Processing speed (10% weight)
   - Special features (10% weight)

3. Provide specific reasons why each bank ranks where it does
4. Give final recommendation with reasoning

Format as JSON:
{
  "comparison": {
    "methodology": "Explanation of comparison methodology",
    "weightedFactors": [
      {"factor": "Interest Rate", "weight": "25%", "description": "Impact on total cost"}
    ]
  },
  "rankings": [
    {
      "rank": 1,
      "bankId": "bank_id",
      "bankName": "Bank Name",
      "score": 85.5,
      "strengths": ["Why this bank is good"],
      "weaknesses": ["Areas where this bank lacks"],
      "keyMetrics": {
        "interestRate": "9.15% - 11.15%",
        "processingFee": "0.5%",
        "maxLoanAmount": "₹30L (abroad)",
        "tenure": "15 years"
      }
    }
  ],
  "recommendation": {
    "topChoice": {
      "bankId": "recommended_bank_id",
      "bankName": "Recommended Bank",
      "reasons": ["Why this bank is recommended"],
      "estimatedSavings": "Potential savings compared to current offer",
      "nextSteps": ["Actions to take"]
    },
    "alternatives": [
      {
        "bankId": "alternative_bank_id",
        "bankName": "Alternative Bank",
        "whenToConsider": "Scenarios where this might be better"
      }
    ]
  },
  "costComparison": {
    "loanAmount": "₹10,00,000",
    "tenure": "10 years",
    "comparison": [
      {
        "bankName": "Bank 1",
        "emi": "₹12,500",
        "totalInterest": "₹5,00,000",
        "totalAmount": "₹15,00,000"
      }
    ]
  }
}
`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a financial advisor expert in education loans. Provide accurate, detailed comparisons and recommendations based on quantitative analysis."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.3
      });

      const response = completion.choices[0].message.content;
      
      try {
        return JSON.parse(response);
      } catch (parseError) {
        return {
          comparison: { methodology: "AI-powered analysis of multiple factors", weightedFactors: [] },
          rankings: [],
          recommendation: {
            topChoice: { bankName: "Analysis provided in text", reasons: [response] },
            alternatives: []
          },
          costComparison: null
        };
      }
    } catch (error) {
      console.error('Bank comparison error:', error);
      throw new Error('Failed to compare banks');
    }
  }
}

module.exports = new OpenAIService();
