import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import EnhancedAnalysisPage from './pages/EnhancedAnalysisPage';
import EducationLoanPage from './pages/EducationLoanPage';
import WhatIfPage from './pages/WhatIfPage';
import ChatPage from './pages/ChatPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/analysis/:id" element={<AnalysisPage />} />
          <Route path="/enhanced-analysis/:id" element={<EnhancedAnalysisPage />} />
          <Route path="/education-loan/:id" element={<EducationLoanPage />} />
          <Route path="/what-if/:id" element={<WhatIfPage />} />
          <Route path="/chat/:id" element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
