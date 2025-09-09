# Deployment Guide

## 📚 Overview

This guide walks you through deploying Ignite Spark to GitHub and then to Vercel for both frontend and backend hosting.

## 🚀 GitHub Deployment

### 1. Initialize Git Repository

```bash
cd ignite-spark
git init
git add .
git commit -m "Initial commit: Ignite Spark - Legal Document Demystifier"
```

### 2. Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New Repository"
3. Name it `ignite-spark`
4. **DO NOT** initialize with README (we already have one)
5. Click "Create Repository"

### 3. Connect Local Repository to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/ignite-spark.git
git branch -M main
git push -u origin main
```

## 🌐 Vercel Deployment

### 1. Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 2. Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import from GitHub: Select your `ignite-spark` repository
4. Configure project:
   - **Framework**: React
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3. Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

```
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
```

### 4. Deploy

Click "Deploy" - Vercel will automatically:
- Build your React frontend
- Deploy serverless API functions
- Provide HTTPS URL

## 🔧 Project Structure for Vercel

```
ignite-spark/
├── api/                    # Serverless functions (auto-detected by Vercel)
│   ├── documents/
│   │   └── upload.js       # POST /api/documents/upload
│   ├── chat/
│   │   └── [id].js         # POST /api/chat/:id
│   └── analysis/
│       ├── what-if/
│       └── translate/
├── frontend/               # React app (specified in vercel.json)
├── standalone/             # Static HTML (served as /standalone/)
├── vercel.json            # Vercel configuration
└── package.json           # Root package.json for deployment
```

## 🌍 URLs After Deployment

- **Frontend**: `https://your-app-name.vercel.app`
- **API**: `https://your-app-name.vercel.app/api/*`
- **Standalone**: `https://your-app-name.vercel.app/standalone/`

## ⚙️ Local Development

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Set Environment Variables

```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

### 3. Run Development Server

```bash
# Run both frontend and backend
npm run dev

# Or run separately
npm run dev:frontend    # Frontend on :3000
npm run dev:backend     # API on :5000
```

## 🐛 Troubleshooting

### Common Issues

1. **API Key Error**
   - Ensure `OPENAI_API_KEY` is set in Vercel environment variables
   - API key should start with `sk-`

2. **File Upload Issues**
   - Vercel has 50MB serverless function limit
   - Our limit is set to 10MB in code

3. **Build Errors**
   - Check that all dependencies are in package.json
   - Ensure React build completes without errors

4. **API Not Found**
   - Verify `api/` folder structure matches Vercel conventions
   - Check `vercel.json` routing configuration

### Vercel Logs

View logs in Vercel Dashboard → Your Project → Functions → View Function Logs

## 🔄 Continuous Deployment

Once connected to GitHub, Vercel automatically:
- Deploys on every push to `main` branch
- Creates preview deployments for pull requests
- Runs build checks before deployment

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **GitHub Issues**: Create issues in your repository
- **OpenAI API Issues**: Check API status and limits

---

**Next Steps**: After deployment, test all features and update any hardcoded URLs to use your Vercel domain.
