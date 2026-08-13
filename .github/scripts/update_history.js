const fs = require('fs');
const path = require('path');

// Receive arguments or environment variables
const targetFileRel = process.env.TARGET_FILE || process.argv[2];
const commitSha = process.env.COMMIT_SHA || process.env.GITHUB_SHA || 'unknown';
const shortSha = commitSha.substring(0, 7);
const author = process.env.COMMIT_AUTHOR || process.env.GITHUB_ACTOR || 'Developer';
const branch = process.env.BRANCH_NAME || process.env.GITHUB_REF_NAME || 'main';
const rawMsg = process.env.COMMIT_MSG || 'Update codebase';
// Clean commit message (take first line, escape pipes)
const msg = rawMsg.split('\n')[0].replace(/\|/g, '\\|');
const dateIso = new Date().toISOString().replace('T', ' ').substring(0, 19);

if (!targetFileRel) {
  console.error('Error: TARGET_FILE environment variable or argument is required.');
  process.exit(1);
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
    // Append at the end if separator not found
    content += `\n\n${tableHeader}\n${tableSeparator}\n${newRow}\n`;
  }
} else {
  // Module-specific history log format (CI_CD, Frontend, Backend, Deployment)
  const sectionTitle = '## Automated Push Audit Log';
  const tableHeader = '| Commit Hash | Date & Time (UTC) | Author | Target Branch | Commit Message |';
  const tableSeparator = '|---|---|---|---|---|';

  const newRow = `| [\`${shortSha}\`](https://github.com/Radheshbhuva/DeployFixLab/commit/${shortSha}) | ${dateIso} | ${author} | \`${branch}\` | \`${msg}\` |`;

  if (!content.includes(sectionTitle)) {
    // Append new section to the end of the file
    content += `\n\n---\n\n# ${sectionTitle}\n\n${tableHeader}\n${tableSeparator}\n${newRow}\n`;
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
