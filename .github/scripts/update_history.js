const fs = require('fs');
const path = require('path');

// Receive arguments or environment variables
let targetFileRel = process.env.TARGET_FILE || process.argv[2];
const commitSha = process.env.COMMIT_SHA || process.env.GITHUB_SHA || 'unknown';
const shortSha = commitSha.substring(0, 7);
const author = process.env.COMMIT_AUTHOR || process.env.GITHUB_ACTOR || 'Developer';
const branch = process.env.BRANCH_NAME || process.env.GITHUB_REF_NAME || 'main';
const rawMsg = process.env.COMMIT_MSG || 'Update codebase';
const msg = rawMsg.split('\n')[0].replace(/\|/g, '\\|');
const dateIso = new Date().toISOString().replace('T', ' ').substring(0, 19);

// Auto-determine target file if not explicitly set
if (!targetFileRel) {
  if (branch === 'heny.frontend' || msg.includes('frontend') || msg.startsWith('feat(')) {
    targetFileRel = 'DOCs/Development_History/Frontend Work History.md';
  } else if (branch === 'dhruvil.backend' || msg.includes('backend')) {
    targetFileRel = 'DOCs/Development_History/Backend Work History.md';
  } else if (branch === 'radhesh.deploy' || msg.includes('ci') || msg.includes('deploy')) {
    targetFileRel = 'DOCs/Development_History/CI_CD_Work_History.md';
  } else {
    targetFileRel = 'DOCs/Development_History/Commit_History.md';
  }
}

const repoRoot = path.resolve(__dirname, '../../');
const filePath = path.join(repoRoot, targetFileRel);

if (!fs.existsSync(filePath)) {
  console.error(`Error: Target history file does not exist at ${filePath}`);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

if (targetFileRel.includes('Commit_History.md')) {
  // Master Commit Audit Log format
  const tableHeader = '| Commit Hash | Date & Time (ISO) | Author | Target Branch | Module / Subsystem | Commit Message | Push Status | Execution Env |';
  const tableSeparator = '|---|---|---|---|---|---|---|---|';

  let moduleName = 'general';
  if (msg.startsWith('docs(')) moduleName = 'DOCs';
  else if (msg.startsWith('feat(')) moduleName = 'features';
  else if (msg.startsWith('fix(')) moduleName = 'bugfix';
  else if (msg.startsWith('chore(')) moduleName = 'maintenance';

  const newRow = `| [\`${shortSha}\`](https://github.com/Radheshbhuva/DeployFixLab/commit/${shortSha}) | ${dateIso} | ${author} | \`${branch}\` | \`${moduleName}\` | \`${msg}\` | Pushed | GitHub Actions |`;

  const sepIdx = content.indexOf(tableSeparator);
  if (sepIdx !== -1) {
    const insertPos = sepIdx + tableSeparator.length;
    const before = content.substring(0, insertPos);
    const after = content.substring(insertPos);
    content = `${before}\n${newRow}${after}`;
  } else {
    content += `\n\n${tableHeader}\n${tableSeparator}\n${newRow}\n`;
  }
} else if (targetFileRel.includes('Frontend Work History.md')) {
  // Dedicated Frontend Work History format
  const sectionTitle = '# 15. Automated Frontend Commit Log';
  const tableHeader = '| Commit Hash | Date & Time (UTC) | Author | Target Branch | Module / Subsystem | Commit Message |';
  const tableSeparator = '|---|---|---|---|---|---|';

  let moduleName = 'frontend';
  if (msg.startsWith('feat(ui)')) moduleName = 'frontend/components/ui';
  else if (msg.startsWith('feat(types)')) moduleName = 'frontend/types';
  else if (msg.startsWith('feat(store)')) moduleName = 'frontend/store';
  else if (msg.startsWith('feat(services)')) moduleName = 'frontend/services';
  else if (msg.startsWith('feat(hooks)')) moduleName = 'frontend/hooks';
  else if (msg.startsWith('feat(layouts)')) moduleName = 'frontend/layouts';
  else if (msg.startsWith('feat(features)')) moduleName = 'frontend/features';
  else if (msg.startsWith('feat(auth)')) moduleName = 'frontend/features/auth';
  else if (msg.startsWith('feat(dashboard)')) moduleName = 'frontend/features/dashboard';
  else if (msg.startsWith('feat(labs)')) moduleName = 'frontend/features/labs';
  else if (msg.startsWith('feat(logs)')) moduleName = 'frontend/features/logs';
  else if (msg.startsWith('feat(diagnosis)')) moduleName = 'frontend/features/diagnosis';
  else if (msg.startsWith('feat(admin)')) moduleName = 'frontend/features/admin';
  else if (msg.startsWith('feat(pages)')) moduleName = 'frontend/pages';
  else if (msg.startsWith('feat(app)')) moduleName = 'frontend/app';

  const newRow = `| [\`${shortSha}\`](https://github.com/Radheshbhuva/DeployFixLab/commit/${shortSha}) | ${dateIso} | ${author} | \`${branch}\` | \`${moduleName}\` | \`${msg}\` |`;

  if (!content.includes(sectionTitle)) {
    content += `\n\n---\n\n${sectionTitle}\n\n${tableHeader}\n${tableSeparator}\n${newRow}\n`;
  } else {
    const sepIdx = content.indexOf(tableSeparator);
    if (sepIdx !== -1) {
      const insertPos = sepIdx + tableSeparator.length;
      const before = content.substring(0, insertPos);
      const after = content.substring(insertPos);
      content = `${before}\n${newRow}${after}`;
    } else {
      content += `\n${newRow}\n`;
    }
  }
} else {
  // Module-specific history log format (CI_CD, Backend, Deployment)
  const sectionTitle = '# Automated Push Audit Log';
  const tableHeader = '| Commit Hash | Date & Time (UTC) | Author | Target Branch | Commit Message |';
  const tableSeparator = '|---|---|---|---|---|';

  const newRow = `| [\`${shortSha}\`](https://github.com/Radheshbhuva/DeployFixLab/commit/${shortSha}) | ${dateIso} | ${author} | \`${branch}\` | \`${msg}\` |`;

  if (!content.includes(sectionTitle)) {
    content += `\n\n---\n\n${sectionTitle}\n\n${tableHeader}\n${tableSeparator}\n${newRow}\n`;
  } else {
    const sepIdx = content.indexOf(tableSeparator);
    if (sepIdx !== -1) {
      const insertPos = sepIdx + tableSeparator.length;
      const before = content.substring(0, insertPos);
      const after = content.substring(insertPos);
      content = `${before}\n${newRow}${after}`;
    } else {
      content += `\n${newRow}\n`;
    }
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Successfully updated ${targetFileRel} for commit ${shortSha} on branch ${branch}!`);
