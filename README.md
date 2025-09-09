# Ignite Spark - Legal Documents Demystifier

**Tagline:** *Clarity. Confidence. Compliance.*

An AI-powered tool that transforms complex legal documents into plain language summaries using OpenAI's GPT models. Upload contracts, agreements, and terms to get instant analysis with risk assessments, key clause highlighting, and interactive Q&A.

## 🌟 Features

- **📄 Document Analysis**: Upload PDFs or DOCX files and get instant AI-powered analysis
- **🌍 Plain Language Summaries**: Complex legal jargon translated into everyday language  
- **⚠️ Risk Assessment**: Color-coded risk levels (Low/Medium/High) with explanations
- **🔍 Key Clause Highlighting**: Important terms, amounts, penalties, and obligations identified
- **👥 Persona-Based Explanations**: Tailored explanations for students, business owners, lawyers, and senior citizens
- **💬 Interactive AI Chatbot**: Context-aware Q&A about your documents
- **🔄 What-If Simulator**: Modify document terms and see updated risk assessments
- **🌐 Multi-Language Support**: Translations in Hindi and more languages
- **📊 Visual Dashboards**: Charts and timelines for risk visualization
- **🎓 Education Loan Analysis**: Specialized bank comparison for education loans

## 🛠 Tech Stack

### Frontend
- **React.js 19+** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Heroicons** - Beautiful icons
- **Recharts** - Data visualization

### Backend
- **Node.js & Express.js** - Server framework
- **OpenAI API** - GPT-4 for document analysis
- **Multer** - File upload handling
- **PDF-Parse & DOCX-Parser** - Document text extraction

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- OpenAI API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd ignite-spark
   ```

2. **Install dependencies:**
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Add your OpenAI API key to `.env`:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=production
   ```

4. **Build and run:**
   ```bash
   # Build frontend
   npm run build

   # Start the application
   npm start
   ```

## 🌐 Vercel Deployment

This project is optimized for Vercel deployment with:
- Serverless functions for the backend API
- Static frontend build
- Automatic HTTPS and global CDN
- Environment variable management

### Deploy to Vercel:

1. **Connect to GitHub:**
   - Push your code to GitHub
   - Import project in Vercel dashboard

2. **Configure Environment Variables:**
   - Add `OPENAI_API_KEY` in Vercel dashboard
   - Set `NODE_ENV=production`

3. **Deploy:**
   - Vercel will automatically build and deploy
   - Frontend: `https://your-app.vercel.app`
   - API: `https://your-app.vercel.app/api/*`

## 📁 Project Structure

```
ignite-spark/
├── api/                    # Vercel serverless functions (backend)
│   ├── documents/
│   ├── chat/
│   └── analysis/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── public/
├── standalone/             # Self-contained HTML version
├── docs/                   # Documentation
├── package.json           # Root package.json for Vercel
├── vercel.json           # Vercel configuration
└── README.md
```

## 🔌 API Endpoints

- `POST /api/documents/upload` - Upload and analyze document
- `GET /api/documents/analysis/:id` - Get analysis results
- `POST /api/chat/:analysisId` - Chat with AI about document
- `POST /api/analysis/what-if/:analysisId` - Run scenarios
- `POST /api/analysis/translate/:analysisId` - Translate content

## 📱 Standalone Version

Access the standalone HTML version at `/standalone/index.html` - no installation required!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Made with ❤️ for making legal documents accessible to everyone**
