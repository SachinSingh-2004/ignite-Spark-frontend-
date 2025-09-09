# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is the **frontend** of Legal Docs Demystifier, an AI-powered tool that transforms complex legal documents into plain language summaries. The frontend is a React application that integrates with a Node.js backend to provide document analysis, risk assessment, and interactive AI chat features.

**Key Product Features:**
- Document upload and analysis (PDF/DOCX)
- AI-powered plain language summaries
- Risk assessment with color-coded alerts
- Persona-based explanations (Student, Business Owner, Lawyer, Senior Citizen)
- Interactive AI chatbot for document Q&A
- What-if scenario simulations
- Multi-language support
- Education loan document specialization

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from react-scripts (one-way operation)
npm run eject
```

### Full Stack Development
The frontend requires the backend API to be running on port 5000. The typical development workflow:

1. **Terminal 1 - Backend:**
   ```bash
   cd ../backend
   npm run dev
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   npm start
   ```

## Architecture Overview

### Technology Stack
- **React 19.1.1** - Modern UI framework with latest features
- **React Router 7.8.2** - Client-side routing for SPA navigation
- **Tailwind CSS 3.4.17** - Utility-first CSS framework with custom configuration
- **Heroicons React** - SVG icon library for UI elements
- **Recharts** - Data visualization for analytics and charts
- **React Testing Library** - Testing utilities for components

### Project Structure
```
src/
├── App.js              # Main router and layout component
├── pages/              # Page-level components (one per route)
│   ├── LandingPage.js  # Marketing homepage with auth modals
│   ├── UploadPage.js   # Document upload with drag-and-drop
│   ├── AnalysisPage.js # Document analysis results display
│   ├── ChatPage.js     # AI chatbot interface
│   ├── WhatIfPage.js   # Scenario simulation interface
│   └── EducationLoanPage.js # Specialized education loan analysis
├── services/
│   └── apiService.js   # Centralized API integration layer
└── assets/             # Static images and files
```

### Key Architectural Patterns

**API Service Layer:** All backend communication is centralized in `apiService.js` which provides:
- Consistent error handling with `handleResponse()` method
- Environment-based API URL configuration (`REACT_APP_API_URL`)
- Singleton pattern for service instance
- Methods for all backend endpoints (upload, analysis, chat, translations, simulations)

**Route-Based Page Architecture:** Each major feature is a separate page component with dedicated routes:
- `/` - Landing/marketing page
- `/upload` - Document upload interface
- `/analysis/:id` - Document analysis results
- `/chat/:id` - Interactive AI chat
- `/what-if/:id` - Scenario simulations
- `/education-loan/:id` - Education loan specialized view

**Persona-Based UI:** The application adapts explanations based on user persona selection:
- Student (educational focus)
- Business Owner (business impact focus)
- Legal Professional (technical analysis)
- Senior Citizen (simplified explanations)

### Styling Architecture
- **Tailwind CSS** with custom configuration extending default theme
- Custom font families: Inter and Montserrat
- Responsive design patterns throughout
- Custom CSS animations and transitions in `App.css`
- Utility-first approach with component-specific styles

### State Management
- **Local React State** (useState, useEffect) for component-level state
- **URL Parameters** for sharing analysis results and maintaining navigation state
- **No global state management** - each page manages its own data fetching and state

## Integration Points

### Backend API Integration
The frontend communicates with a Node.js/Express backend via REST API:

**Base URL:** `http://localhost:5000` (configurable via `REACT_APP_API_URL`)

**Key Endpoints:**
- `POST /api/documents/upload` - Document upload and analysis
- `GET /api/documents/analysis/:id` - Retrieve analysis results
- `POST /api/chat/:analysisId` - AI chat interactions
- `POST /api/analysis/what-if/:analysisId` - Scenario simulations
- `POST /api/analysis/translate/:analysisId` - Content translations

**Error Handling:** The API service provides consistent error handling and user-friendly error messages.

### File Upload System
- Supports PDF and DOCX files up to 10MB
- Drag-and-drop interface with visual feedback
- Client-side validation for file types and sizes
- FormData-based upload to backend with persona selection

### Environment Configuration
```env
REACT_APP_API_URL=http://localhost:5000  # Backend API base URL
GENERATE_SOURCEMAP=false                 # Disable source maps in production
```

## Development Guidelines

### Component Development
- Use functional components with React hooks
- Implement responsive design patterns with Tailwind classes
- Include proper error handling and loading states
- Use React Router's `useNavigate` for programmatic navigation

### API Integration
- Always use the centralized `apiService` for backend calls
- Handle loading states and errors consistently
- Use async/await patterns for API calls
- Include proper error boundaries and user feedback

### Testing
- Use React Testing Library for component testing
- Focus on user behavior rather than implementation details
- Test error states and loading conditions
- Run tests with `npm test` in watch mode during development

### Build and Deployment
- Production builds are optimized and minified via `react-scripts build`
- Static assets are served from the `build/` directory
- Source maps are disabled for production builds
- The app is a single-page application requiring proper server configuration for client-side routing

## Common Development Tasks

### Adding New API Endpoints
1. Add method to `apiService.js`
2. Implement error handling in the service method
3. Use the service method in components with proper loading/error states

### Creating New Pages
1. Create component in `src/pages/`
2. Add route to `App.js`
3. Implement navigation from existing pages
4. Ensure responsive design and error handling

### Styling Changes
1. Use Tailwind utility classes where possible
2. Extend theme configuration in `tailwind.config.js` for custom values
3. Add custom CSS to `App.css` only for complex animations or non-utility styles
4. Test responsive behavior across device sizes

### Debugging API Issues
1. Check browser Network tab for API request/response details
2. Verify backend is running on correct port (5000)
3. Check `REACT_APP_API_URL` environment variable
4. Use `apiService.healthCheck()` to test backend connectivity
