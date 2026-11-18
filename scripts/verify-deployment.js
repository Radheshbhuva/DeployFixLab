/**
 * DeployFix Lab — Production Deployment Readiness Verification Script
 * Validates file structure, build artifacts, container configurations, and environment templates.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
let passCount = 0;
let failCount = 0;

function check(label, condition, details = '') {
  if (condition) {
    console.log(`  \x1b[32m✔\x1b[0m ${label}`);
    passCount++;
  } else {
    console.log(`  \x1b[31m✖\x1b[0m ${label} ${details ? `(${details})` : ''}`);
    failCount++;
  }
}

console.log('\n🔍 --- DeployFix Lab Deployment Readiness Audit ---\n');

// 1. Root Configurations
console.log('📦 Root Infrastructure & Blueprints:');
check('Root docker-compose.yml exists', fs.existsSync(path.join(rootDir, 'docker-compose.yml')));
check('Root render.yaml exists', fs.existsSync(path.join(rootDir, 'render.yaml')));
check('Root .env.example exists', fs.existsSync(path.join(rootDir, '.env.example')));
check('Root package.json exists', fs.existsSync(path.join(rootDir, 'package.json')));

// 2. AWS Free Tier Infrastructure
console.log('\n☁️ AWS Free Tier Deployment Artifacts:');
check('AWS EC2 Cloud-Init bootstrap script exists', fs.existsSync(path.join(rootDir, 'deployment/aws/ec2-user-data.sh')));
check('AWS CloudFormation template exists', fs.existsSync(path.join(rootDir, 'deployment/aws/deployfix-cloudformation.yaml')));
check('AWS Free Tier Deployment Guide exists', fs.existsSync(path.join(rootDir, 'DOCs/14_Deployment/AWS_Free_Tier_Deployment_Guide.md')));

// 3. Backend Readiness
console.log('\n⚙️ Backend API & Database:');
check('Backend Dockerfile exists', fs.existsSync(path.join(rootDir, 'Application/backend/Dockerfile')));
check('Backend package.json exists', fs.existsSync(path.join(rootDir, 'Application/backend/package.json')));
check('Prisma schema exists', fs.existsSync(path.join(rootDir, 'Application/backend/prisma/schema.prisma')));
check('Prisma migrations exist', fs.existsSync(path.join(rootDir, 'Application/backend/prisma/migrations')));
check('Prisma seed script exists', fs.existsSync(path.join(rootDir, 'Application/backend/prisma/seed.ts')));
check('Backend build artifact (dist/src/server.js) exists', fs.existsSync(path.join(rootDir, 'Application/backend/dist/src/server.js')));

// 4. Frontend Readiness
console.log('\n🌐 Frontend SPA & Static Server:');
check('Frontend Dockerfile exists', fs.existsSync(path.join(rootDir, 'Application/frontend/Dockerfile')));
check('Frontend NGINX config exists', fs.existsSync(path.join(rootDir, 'Application/frontend/nginx.conf')));
check('Frontend vercel.json exists', fs.existsSync(path.join(rootDir, 'Application/frontend/vercel.json')));
check('Frontend build artifact (dist/index.html) exists', fs.existsSync(path.join(rootDir, 'Application/frontend/dist/index.html')));

// 5. CI/CD Workflows
console.log('\n🔄 CI/CD Automation:');
check('GitHub Actions deploy.yml exists', fs.existsSync(path.join(rootDir, '.github/workflows/deploy.yml')));
check('GitHub Actions ci.yml exists', fs.existsSync(path.join(rootDir, '.github/workflows/ci.yml')));

console.log('\n📊 Summary:');
console.log(`  Total Checks: ${passCount + failCount}`);
console.log(`  Passed: \x1b[32m${passCount}\x1b[0m`);
console.log(`  Failed: ${failCount > 0 ? `\x1b[31m${failCount}\x1b[0m` : '0'}`);

if (failCount === 0) {
  console.log('\n✨ DeployFix Lab is 100% READY FOR DEPLOYMENT!\n');
  process.exit(0);
} else {
  console.error('\n⚠️ Some deployment readiness checks failed.\n');
  process.exit(1);
}
