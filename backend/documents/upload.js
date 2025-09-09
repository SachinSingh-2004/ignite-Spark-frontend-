const OpenAI = require('openai');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { v4: uuidv4 } = require('uuid');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure multer for file uploads
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'), false);
    }
  }
});

// Middleware function to handle multipart/form-data
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to extract text from PDF');
  }
}

async function analyzeDocument(text, persona = 'student') {
  const prompt = `You are an AI legal document analyzer. Analyze the following legal document and provide:

1. A plain language summary suitable for a ${persona}
2. Risk assessment (overall: low/medium/high)
3. Key clauses and their importance
4. Counterparty risk analysis with detailed scoring
5. Action items

Document text:
${text}

Please provide the analysis in JSON format with the following structure:
{
  "summary": "Plain language summary",
  "riskAssessment": {
    "overall": "low/medium/high",
    "counterpartyRisk": {
      "score": 75,
      "maxScore": 100,
      "deductions": [
        {
          "category": "Financial Stability",
          "pointsDeducted": 10,
          "reason": "Limited financial disclosures"
        }
      ]
    },
    "risks": [
      {
        "category": "Risk category",
        "level": "low/medium/high",
        "description": "Risk description"
      }
    ]
  },
  "keyParts": [
    {
      "title": "Clause title",
      "content": "Clause content",
      "explanation": "Plain language explanation",
      "importance": "low/medium/high"
    }
  ],
  "actionItems": ["Action item 1", "Action item 2"]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert legal document analyzer. Provide detailed, accurate analysis in the requested JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
    });

    const responseContent = completion.choices[0].message.content;
    
    // Parse JSON response
    try {
      return JSON.parse(responseContent);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        summary: responseContent,
        riskAssessment: {
          overall: "medium",
          counterpartyRisk: {
            score: 70,
            maxScore: 100,
            deductions: []
          },
          risks: []
        },
        keyParts: [],
        actionItems: []
      };
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to analyze document with AI');
  }
}

// Main handler function
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Handle file upload
    await runMiddleware(req, res, upload.single('document'));

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { persona = 'student' } = req.body;
    let text;

    // Extract text based on file type
    if (req.file.mimetype === 'application/pdf') {
      text = await extractTextFromPDF(req.file.buffer);
    } else {
      // For DOCX files - simplified extraction (you may want to use mammoth.js for better extraction)
      text = req.file.buffer.toString();
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from document' });
    }

    // Analyze document with AI
    const analysis = await analyzeDocument(text, persona);
    
    // Generate unique ID for this analysis
    const analysisId = uuidv4();
    
    // In a production app, you'd store this in a database
    // For now, we'll just return it
    const result = {
      id: analysisId,
      filename: req.file.originalname,
      analysis: analysis,
      persona: persona,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}

// Configure API route
export const config = {
  api: {
    bodyParser: false, // Disable body parsing so multer can handle it
  },
};
