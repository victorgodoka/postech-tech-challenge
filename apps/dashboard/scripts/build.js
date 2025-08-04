#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n🔄 ${description}...`, colors.blue);
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed successfully`, colors.green);
  } catch (error) {
    log(`❌ ${description} failed`, colors.red);
    process.exit(1);
  }
}

function checkEnvironment() {
  log('\n🔍 Checking environment...', colors.cyan);
  
  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 18) {
    log(`❌ Node.js version ${nodeVersion} is not supported. Please use Node.js 18 or higher.`, colors.red);
    process.exit(1);
  }
  
  log(`✅ Node.js version: ${nodeVersion}`, colors.green);
  
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    log('❌ package.json not found', colors.red);
    process.exit(1);
  }
  
  log('✅ package.json found', colors.green);
}

function cleanBuild() {
  log('\n🧹 Cleaning previous build...', colors.yellow);
  
  const dirsToClean = ['.next', 'dist', 'build'];
  
  dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      log(`🗑️  Removed ${dir}`, colors.yellow);
    }
  });
}

function installDependencies() {
  runCommand('npm ci', 'Installing dependencies');
}

function runLinting() {
  runCommand('npm run lint', 'Running ESLint');
}

function runTypeCheck() {
  runCommand('npm run type-check', 'Running TypeScript type check');
}

function runTests() {
  if (fs.existsSync('jest.config.js') || fs.existsSync('jest.config.ts')) {
    runCommand('npm test -- --passWithNoTests', 'Running tests');
  } else {
    log('⚠️  No test configuration found, skipping tests', colors.yellow);
  }
}

function buildProject() {
  runCommand('npm run build', 'Building project');
}

function generateBuildInfo() {
  log('\n📝 Generating build info...', colors.cyan);
  
  const buildInfo = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    environment: process.env.NODE_ENV || 'production',
    gitCommit: getGitCommit(),
    gitBranch: getGitBranch(),
  };
  
  fs.writeFileSync('.next/build-info.json', JSON.stringify(buildInfo, null, 2));
  log('✅ Build info generated', colors.green);
}

function getGitCommit() {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

function getGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

function analyzeBundleSize() {
  if (fs.existsSync('.next')) {
    log('\n📊 Analyzing bundle size...', colors.magenta);
    try {
      execSync('npx @next/bundle-analyzer', { stdio: 'inherit' });
    } catch {
      log('⚠️  Bundle analyzer not available', colors.yellow);
    }
  }
}

function main() {
  const startTime = Date.now();
  
  log(`${colors.bright}🚀 Starting build process...${colors.reset}`);
  
  try {
    checkEnvironment();
    cleanBuild();
    installDependencies();
    runLinting();
    runTypeCheck();
    runTests();
    buildProject();
    generateBuildInfo();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    log(`\n${colors.bright}🎉 Build completed successfully in ${duration}s!${colors.reset}`, colors.green);
    
    // Optional: analyze bundle size
    if (process.argv.includes('--analyze')) {
      analyzeBundleSize();
    }
    
  } catch (error) {
    log(`\n❌ Build failed: ${error.message}`, colors.red);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
