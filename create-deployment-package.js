const fs = require('fs');
const path = require('path');

// Create a simple script to copy all necessary files for deployment
const deploymentFiles = [
  'dist/index.html',
  'dist/_redirects',
  'dist/assets'
];

console.log('📦 Creating deployment package...');
console.log('');
console.log('Files ready for Netlify deployment:');
console.log('');

// List all files in dist directory
const distPath = path.join(__dirname, 'dist');

function listFiles(dir, prefix = '') {
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        console.log(`📁 ${prefix}${file}/`);
        listFiles(filePath, prefix + '  ');
      } else {
        const size = (stat.size / 1024).toFixed(1);
        console.log(`📄 ${prefix}${file} (${size} KB)`);
      }
    });
  } catch (error) {
    console.log('❌ Error reading directory:', error.message);
  }
}

if (fs.existsSync(distPath)) {
  console.log('✅ Deployment files found in dist/ folder:');
  console.log('');
  listFiles(distPath);
  console.log('');
  console.log('🎯 NEXT STEPS:');
  console.log('1. Go to netlify.com and sign up/login');
  console.log('2. Click "Add new site" → "Deploy manually"');
  console.log('3. Select ALL files from the dist/ folder above');
  console.log('4. Upload to Netlify');
  console.log('5. Add custom domain: www.swfldines.com');
  console.log('');
  console.log('🌐 Your site will be live at www.swfldines.com!');
} else {
  console.log('❌ dist/ folder not found. Run "npm run build" first.');
}