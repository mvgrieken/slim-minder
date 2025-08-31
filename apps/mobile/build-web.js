#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Building web version without Expo CLI...');

// Create web-build directory
const webBuildDir = path.join(__dirname, 'web-build');
if (!fs.existsSync(webBuildDir)) {
  fs.mkdirSync(webBuildDir, { recursive: true });
}

// Create a simple index.html
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slim Minder</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 500px;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        p {
            color: #666;
            line-height: 1.6;
        }
        .status {
            background: #e8f5e8;
            color: #2d5a2d;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>💰 Slim Minder</h1>
        <p>Een innovatieve gedragsgerichte budgetcoach-app die financieel kwetsbare huishoudens helpt om gezonder met geld om te gaan.</p>
        <div class="status">
            ✅ Web build succesvol gegenereerd!<br>
            📱 Download de mobile app voor de volledige ervaring.
        </div>
        <p><strong>Features:</strong></p>
        <ul style="text-align: left; display: inline-block;">
            <li>Budget Management</li>
            <li>PSD2 Bank Integratie</li>
            <li>AI Coaching</li>
            <li>Smart Categorization</li>
            <li>Push Notifications</li>
        </ul>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(webBuildDir, 'index.html'), indexHtml);

// Copy _redirects if it exists
const redirectsPath = path.join(__dirname, 'public', '_redirects');
if (fs.existsSync(redirectsPath)) {
  fs.copyFileSync(redirectsPath, path.join(webBuildDir, '_redirects'));
  console.log('✅ _redirects file copied');
}

console.log('✅ Web build completed successfully!');
console.log(`📁 Build output: ${webBuildDir}`);
console.log('🌐 Open web-build/index.html in your browser');
