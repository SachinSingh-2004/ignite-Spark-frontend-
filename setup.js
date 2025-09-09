#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Ignite Spark Setup Script');
console.log('=============================\n');

// Check if we're in the right directory
if (!fs.existsSync('./package.json')) {
  console.error('❌ Please run this script from the ignite-spark project root directory');
  process.exit(1);
}

// Helper function to run commands
function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ Failed: ${description}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Install dependencies
console.log('Installing dependencies...\n');

// Root dependencies
runCommand('npm install', 'Installing root dependencies');

// Frontend dependencies  
if (fs.existsSync('./frontend')) {
  process.chdir('./frontend');
  runCommand('npm install', 'Installing frontend dependencies');
  process.chdir('..');
}

// API dependencies
if (fs.existsSync('./api')) {
  process.chdir('./api');
  runCommand('npm install', 'Installing API dependencies');
  process.chdir('..');
}

// Check for .env file
console.log('🔧 Environment Setup');
if (!fs.existsSync('./.env')) {
  if (fs.existsSync('./.env.example')) {
    fs.copyFileSync('./.env.example', './.env');
    console.log('✅ Created .env file from template');
    console.log('⚠️  Please edit .env and add your OpenAI API key\n');
  } else {
    console.log('⚠️  No .env.example found. Please create .env manually\n');
  }
} else {
  console.log('✅ .env file already exists\n');
}

// Initialize git if not already initialized
console.log('🔧 Git Setup');
if (!fs.existsSync('./.git')) {
  runCommand('git init', 'Initializing Git repository');
  runCommand('git add .', 'Adding files to Git');
  runCommand('git commit -m "Initial commit: Ignite Spark setup"', 'Creating initial commit');
  console.log('✅ Git repository initialized\n');
} else {
  console.log('✅ Git repository already exists\n');
}

// Final instructions
console.log('🎉 Setup Complete!');
console.log('==================\n');

console.log('Next steps:');
console.log('1. Edit .env file and add your OpenAI API key');
console.log('2. For local development: npm run dev');
console.log('3. To deploy to GitHub: Follow docs/DEPLOYMENT.md');
console.log('4. To deploy to Vercel: Import from GitHub in Vercel dashboard\n');

console.log('📚 Documentation:');
console.log('- README.md - Project overview');
console.log('- docs/DEPLOYMENT.md - Deployment guide');
console.log('- standalone/index.html - Standalone version\n');

console.log('🌐 After deployment URLs will be:');
console.log('- Frontend: https://your-app.vercel.app');
console.log('- API: https://your-app.vercel.app/api/*');
console.log('- Standalone: https://your-app.vercel.app/standalone/\n');

console.log('Happy coding! 🚀');
