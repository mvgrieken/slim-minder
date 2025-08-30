#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const semver = require('semver');

// Compatibility matrix for critical dependencies
const COMPATIBILITY_MATRIX = {
  'expo': {
    '53.x': { 
      metro: '^0.81.0', 
      node: '>=20.0.0',
      '@expo/metro-runtime': '~3.2.1'
    },
    '52.x': { 
      metro: '^0.80.12', 
      node: '>=18.18.0',
      '@expo/metro-runtime': '~3.1.3'
    }
  }
};

function validateDependencies() {
  console.log('🔍 Validating dependency compatibility...');
  
  try {
    // Read package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const engines = packageJson.engines || {};
    
    let hasErrors = false;
    
    // Validate Node.js version
    if (engines.node) {
      const currentNodeVersion = process.version;
      // For exact versions, allow patch-level differences in development
      let nodeRequirement = engines.node;
      if (nodeRequirement.match(/^\d+\.\d+\.\d+$/)) {
        // Convert exact version to compatible range for development
        const major = semver.major(nodeRequirement);
        const minor = semver.minor(nodeRequirement);
        nodeRequirement = `>=${major}.${minor}.0`;
      }
      
      if (!semver.satisfies(currentNodeVersion, nodeRequirement)) {
        console.error(`❌ Node.js version mismatch:`);
        console.error(`   Required: ${engines.node} (interpreted as ${nodeRequirement})`);
        console.error(`   Current: ${currentNodeVersion}`);
        hasErrors = true;
      } else {
        console.log(`✅ Node.js version compatible: ${currentNodeVersion}`);
      }
    }
    
    // Validate Expo + Metro compatibility
    if (dependencies.expo && dependencies.metro) {
      const expoVersion = dependencies.expo;
      const metroVersion = dependencies.metro;
      
      // Extract major version from expo
      const expoMajor = semver.major(semver.coerce(expoVersion.replace(/[~^]/, '')));
      const compatKey = `${expoMajor}.x`;
      
      if (COMPATIBILITY_MATRIX.expo[compatKey]) {
        const requiredMetro = COMPATIBILITY_MATRIX.expo[compatKey].metro;
        const metroVersionClean = metroVersion.replace(/[~^]/, '');
        
        if (!semver.satisfies(semver.coerce(metroVersionClean), requiredMetro)) {
          console.error(`❌ Metro version incompatible with Expo ${expoVersion}:`);
          console.error(`   Required Metro: ${requiredMetro}`);
          console.error(`   Current Metro: ${metroVersion}`);
          hasErrors = true;
        } else {
          console.log(`✅ Expo ${expoVersion} + Metro ${metroVersion} compatibility verified`);
        }
      }
    }
    
    // Validate @expo/metro-runtime compatibility
    if (dependencies.expo && dependencies['@expo/metro-runtime']) {
      const expoVersion = dependencies.expo;
      const metroRuntimeVersion = dependencies['@expo/metro-runtime'];
      
      const expoMajor = semver.major(semver.coerce(expoVersion.replace(/[~^]/, '')));
      const compatKey = `${expoMajor}.x`;
      
      if (COMPATIBILITY_MATRIX.expo[compatKey]) {
        const requiredMetroRuntime = COMPATIBILITY_MATRIX.expo[compatKey]['@expo/metro-runtime'];
        const metroRuntimeVersionClean = metroRuntimeVersion.replace(/[~^]/, '');
        
        if (!semver.satisfies(semver.coerce(metroRuntimeVersionClean), requiredMetroRuntime)) {
          console.error(`❌ @expo/metro-runtime version incompatible with Expo ${expoVersion}:`);
          console.error(`   Required: ${requiredMetroRuntime}`);
          console.error(`   Current: ${metroRuntimeVersion}`);
          hasErrors = true;
        } else {
          console.log(`✅ @expo/metro-runtime ${metroRuntimeVersion} compatibility verified`);
        }
      }
    }
    
    if (hasErrors) {
      console.error('\n❌ Dependency validation failed!');
      console.error('Please fix the compatibility issues above before building.');
      process.exit(1);
    } else {
      console.log('\n✅ All dependency compatibility checks passed!');
    }
    
  } catch (error) {
    console.error('❌ Error validating dependencies:', error.message);
    process.exit(1);
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  validateDependencies();
}

module.exports = validateDependencies;
