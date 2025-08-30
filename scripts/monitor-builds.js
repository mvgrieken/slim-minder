#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Build monitoring configuration
const MONITORING_CONFIG = {
  buildTimeout: 5 * 60 * 1000, // 5 minutes
  maxBuildSize: 50 * 1024 * 1024, // 50MB
  criticalDependencies: ['expo', 'metro', 'react-native']
};

function monitorBuilds() {
  console.log('🔍 Monitoring build health...');
  
  try {
    const buildDir = path.join(process.cwd(), 'apps/mobile/web-build');
    
    // Check if build directory exists
    if (!fs.existsSync(buildDir)) {
      console.error('❌ Build directory not found');
      return false;
    }
    
    // Check build size
    const buildSize = getDirectorySize(buildDir);
    if (buildSize > MONITORING_CONFIG.maxBuildSize) {
      console.error(`❌ Build size too large: ${formatBytes(buildSize)}`);
      return false;
    }
    
    // Check critical files
    const criticalFiles = ['index.html', '_redirects', 'metadata.json'];
    for (const file of criticalFiles) {
      const filePath = path.join(buildDir, file);
      if (!fs.existsSync(filePath)) {
        console.error(`❌ Critical file missing: ${file}`);
        return false;
      }
    }
    
    // Check for JavaScript bundles
    const expoDir = path.join(buildDir, '_expo/static/js/web');
    if (fs.existsSync(expoDir)) {
      const jsFiles = fs.readdirSync(expoDir).filter(f => f.endsWith('.js'));
      if (jsFiles.length === 0) {
        console.error('❌ No JavaScript bundles found');
        return false;
      }
      console.log(`✅ Found ${jsFiles.length} JavaScript bundles`);
    }
    
    console.log(`✅ Build size: ${formatBytes(buildSize)}`);
    console.log('✅ All critical files present');
    console.log('✅ Build monitoring passed');
    
    return true;
    
  } catch (error) {
    console.error('❌ Build monitoring failed:', error.message);
    return false;
  }
}

function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  function calculateSize(currentPath) {
    const stats = fs.statSync(currentPath);
    if (stats.isFile()) {
      totalSize += stats.size;
    } else if (stats.isDirectory()) {
      const files = fs.readdirSync(currentPath);
      for (const file of files) {
        calculateSize(path.join(currentPath, file));
      }
    }
  }
  
  calculateSize(dirPath);
  return totalSize;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Only run if this script is executed directly
if (require.main === module) {
  const success = monitorBuilds();
  process.exit(success ? 0 : 1);
}

module.exports = monitorBuilds;
