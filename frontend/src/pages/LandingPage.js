import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  // Animation on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.card-hover');
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight - 100) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  useEffect(() => {
    const elements = document.querySelectorAll('.card-hover');
    elements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load

    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  const handleLogin = () => {
    alert('Login successful! Welcome back.');
    setShowLoginModal(false);
  };

  const handleSignup = () => {
    alert('Account created successfully! You can now log in.');
    setShowSignupModal(false);
  };

  const LoginModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="montserrat text-2xl font-bold text-gray-900">Welcome Back</h3>
          <button onClick={() => setShowLoginModal(false)} className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="••••••••" />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
          </div>
          <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300">
            Sign In
          </button>
          <div className="text-center text-sm text-gray-600">
            Don't have an account? 
            <button onClick={() => { setShowLoginModal(false); setShowSignupModal(true); }} className="text-blue-600 hover:underline">Sign up</button>
          </div>
        </div>
      </div>
    </div>
  );

  const SignupModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="montserrat text-2xl font-bold text-gray-900">Create Account</h3>
          <button onClick={() => setShowSignupModal(false)} className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="••••••••" />
          </div>
          <div>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-gray-600">I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a></span>
            </label>
          </div>
          <button onClick={handleSignup} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300">
            Create Account
          </button>
          <div className="text-center text-sm text-gray-600">
            Already have an account? 
            <button onClick={() => { setShowSignupModal(false); setShowLoginModal(true); }} className="text-blue-600 hover:underline">Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg className="h-8 w-8 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="montserrat text-xl font-bold text-gray-900">THE GENOVATORS . Legal Docs Demystifier</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setShowLoginModal(true)} className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg font-medium transition duration-300 border border-gray-300 hover:border-gray-400">
                Login
              </button>
              <button onClick={() => setShowSignupModal(true)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition duration-300">
                Sign Up
              </button>
              <button onClick={() => navigate('/upload')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition duration-300">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-bg pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="text-center animate-fade-in">
            <h1 className="montserrat text-5xl md:text-6xl font-bold text-white mb-6">
              Legal Documents<br />
              <span className="text-yellow-300">Demystified</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Transform complex legal documents into plain language summaries with AI-powered analysis, risk assessment, and interactive Q&A.
            </p>
            <div className="text-center mb-12">
              <span className="montserrat text-2xl font-semibold text-yellow-300">Clarity. Confidence. Compliance.</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/upload')} className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300 shadow-lg">
                Analyze Document
              </button>
              <button onClick={scrollToFeatures} className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{animationDelay: '2s'}}>
          <div className="w-12 h-12 bg-yellow-300 bg-opacity-30 rounded-full"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float" style={{animationDelay: '4s'}}>
          <div className="w-8 h-8 bg-green-400 bg-opacity-40 rounded-full"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="montserrat text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform makes legal documents accessible to everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Document Analysis */}
            <div className="card-hover bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="feature-icon w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="montserrat text-xl font-semibold text-gray-900 mb-3">Document Analysis</h3>
              <p className="text-gray-600 mb-4">Upload PDFs or DOCX files and get instant AI-powered analysis with plain language summaries.</p>
              <div className="text-sm text-blue-600 font-medium">Supports PDF & DOCX • Max 10MB</div>
            </div>

            {/* Risk Assessment */}
            <div className="card-hover bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="feature-icon w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="montserrat text-xl font-semibold text-gray-900 mb-3">Risk Assessment</h3>
              <p className="text-gray-600 mb-4">Color-coded risk levels with detailed explanations to help you understand potential issues.</p>
              <div className="flex gap-2 mt-3">
                <span className="px-2 py-1 text-xs rounded risk-low border">Low Risk</span>
                <span className="px-2 py-1 text-xs rounded risk-medium border">Medium Risk</span>
                <span className="px-2 py-1 text-xs rounded risk-high border">High Risk</span>
              </div>
            </div>

            {/* Key Clause Highlighting */}
            <div className="card-hover bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="feature-icon w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
              <h3 className="montserrat text-xl font-semibold text-gray-900 mb-3">Key Clause Highlighting</h3>
              <p className="text-gray-600 mb-4">Important terms, amounts, penalties, and obligations automatically identified and highlighted.</p>
              <div className="text-sm text-blue-600 font-medium">Smart Detection • Auto Categorization</div>
            </div>

            {/* Persona-Based Explanations */}
            <div className="card-hover bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="feature-icon w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="montserrat text-xl font-semibold text-gray-900 mb-3">Persona-Based Explanations</h3>
              <p className="text-gray-600 mb-4">Tailored explanations for different audiences including students, business owners, lawyers, and seniors.</p>
              <div className="text-sm text-blue-600 font-medium">4 Different Personas • Customized Language</div>
            </div>

            {/* Interactive Chat */}
            <div className="card-hover bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="feature-icon w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="montserrat text-xl font-semibold text-gray-900 mb-3">Interactive AI Chat</h3>
              <p className="text-gray-600 mb-4">Context-aware Q&A about your documents with conversation history tracking.</p>
              <div className="text-sm text-blue-600 font-medium">Smart AI • Context Aware • Conversation History</div>
            </div>

            {/* What-If Scenarios */}
            <div className="card-hover bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="feature-icon w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="montserrat text-xl font-semibold text-gray-900 mb-3">What-If Simulator</h3>
              <p className="text-gray-600 mb-4">Modify document terms and see updated risk assessments to compare different scenarios.</p>
              <div className="text-sm text-blue-600 font-medium">Scenario Testing • Risk Comparison • Impact Analysis</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="montserrat text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple 4-step process to demystify your legal documents
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="montserrat text-lg font-semibold text-gray-900 mb-2">Upload Document</h3>
              <p className="text-gray-600">Upload your PDF or DOCX legal document and select your persona</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="montserrat text-lg font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-600">Our AI processes your document and generates comprehensive analysis</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="montserrat text-lg font-semibold text-gray-900 mb-2">Review Results</h3>
              <p className="text-gray-600">Get plain language summary, risk assessment, and key clause highlights</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="montserrat text-lg font-semibold text-gray-900 mb-2">Interact & Explore</h3>
              <p className="text-gray-600">Ask questions, run what-if scenarios, and get translations</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="montserrat text-4xl font-bold text-white mb-6">
            Ready to Demystify Your Legal Documents?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust our AI-powered platform for clear, confident legal document analysis.
          </p>
          <button onClick={() => navigate('/upload')} className="bg-white text-blue-600 px-10 py-4 rounded-lg font-semibold text-xl hover:bg-gray-100 transition duration-300 shadow-lg">
            Start Free Analysis
          </button>
          <div className="mt-8 text-blue-200 text-sm">
            No registration required • Secure & Private • AI-Powered
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <svg className="h-6 w-6 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="montserrat font-bold text-lg">Legal Docs Demystifier</span>
              </div>
              <p className="text-gray-400 mb-4">
                Making legal documents accessible to everyone through AI-powered analysis and plain language summaries.
              </p>
              <p className="montserrat text-blue-400 font-semibold">Clarity. Confidence. Compliance.</p>
            </div>
            <div>
              <h3 className="montserrat font-semibold mb-4">Features</h3>
              <ul className="text-gray-400 space-y-2">
                <li>Document Analysis</li>
                <li>Risk Assessment</li>
                <li>Key Clause Highlighting</li>
                <li>Interactive Chat</li>
                <li>What-If Scenarios</li>
                <li>Multi-Language Support</li>
              </ul>
            </div>
            <div>
              <h3 className="montserrat font-semibold mb-4">Quick Links</h3>
              <ul className="text-gray-400 space-y-2">
                <li><button onClick={() => navigate('/upload')} className="hover:text-white transition duration-300">Upload Document</button></li>
                <li><button onClick={scrollToFeatures} className="hover:text-white transition duration-300">How It Works</button></li>
                <li><a href="#" className="hover:text-white transition duration-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Legal Docs Demystifier. Made with ❤️ for making legal documents accessible to everyone.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showLoginModal && <LoginModal />}
      {showSignupModal && <SignupModal />}
    </div>
  );
};

export default LandingPage;
