#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI colors (zero dependencies, like GSD)
// Brand color: #00F0A0 → RGB(0, 240, 160)
const brand = '\x1b[38;2;0;240;160m';
const green = '\x1b[38;2;0;240;160m';
const yellow = '\x1b[33m';
const red = '\x1b[31m';
const dim = '\x1b[2m';
const bold = '\x1b[1m';
const reset = '\x1b[0m';

const pkg = require('../package.json');

// ─── Banner ───────────────────────────────────────────────
const banner = '\n' +
  brand + '   ██████╗ ██╗   ██╗███████╗██╗   ██╗██████╗ ██╗  ██╗\n' +
  '  ██╔════╝ ██║   ██║██╔════╝╚██╗ ██╔╝╚════██╗██║ ██╔╝\n' +
  '  ██║  ███╗██║   ██║███████╗ ╚████╔╝  █████╔╝█████╔╝\n' +
  '  ██║   ██║██║   ██║╚════██║  ╚██╔╝  ██╔═══╝ ██╔═██╗\n' +
  '  ╚██████╔╝╚██████╔╝███████║   ██║   ███████╗██║  ██╗\n' +
  '   ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝' + reset + '\n' +
  '\n' +
  '  ' + bold + 'Y2K Labs' + reset + ' ' + dim + 'v' + pkg.version + reset + '\n' +
  '  Agent skills for the entire software development lifecycle.\n';

console.log(banner);

// ─── Detect platform ──────────────────────────────────────
const isWindows = process.platform === 'win32';
const home = process.env.HOME || process.env.USERPROFILE;

// ─── Skill source paths (relative to package root) ───────
const packageRoot = path.resolve(__dirname, '..');
const skillsSource = path.join(packageRoot, 'skills');

// ─── Supported runtimes ──────────────────────────────────
const runtimes = {
  'claude-code': {
    name: 'Claude Code',
    global: path.join(home, '.claude', 'skills'),
    local: path.join(process.cwd(), '.claude', 'skills')
  },
  'cursor': {
    name: 'Cursor',
    global: path.join(home, '.cursor', 'skills'),
    local: path.join(process.cwd(), '.cursor', 'skills')
  },
  'copilot': {
    name: 'GitHub Copilot',
    global: path.join(home, '.github', 'copilot-instructions', 'skills'),
    local: path.join(process.cwd(), '.github', 'copilot-instructions', 'skills')
  },
  'windsurf': {
    name: 'Windsurf',
    global: path.join(home, '.windsurf', 'skills'),
    local: path.join(process.cwd(), '.windsurf', 'skills')
  },
  'cline': {
    name: 'Cline',
    global: path.join(home, '.cline', 'skills'),
    local: path.join(process.cwd(), '.cline', 'skills')
  }
};

// ─── CLI argument parsing ─────────────────────────────────
const args = process.argv.slice(2);
const isGlobal = args.includes('-g') || args.includes('--global');
const useSymlinks = !args.includes('--copy') && !isWindows;
const skipPrompts = args.includes('-y') || args.includes('--yes');
const selectedRuntime = args.find(a => a.startsWith('--agent='))?.split('=')[1];

// ─── Helper: create directory recursively ─────────────────
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ─── Helper: copy directory recursively ───────────────────
function copyDirRecursive(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ─── Helper: create symlink or copy ──────────────────────
function linkOrCopy(src, dest) {
  if (fs.existsSync(dest)) {
    const stat = fs.lstatSync(dest);
    if (stat.isSymbolicLink()) {
      fs.unlinkSync(dest);
    } else if (stat.isDirectory()) {
      fs.rmSync(dest, { recursive: true });
    }
  }

  if (useSymlinks) {
    try {
      fs.symlinkSync(src, dest, 'junction');
      return 'symlink';
    } catch {
      // Fallback to copy if symlink fails
      copyDirRecursive(src, dest);
      return 'copy';
    }
  } else {
    copyDirRecursive(src, dest);
    return 'copy';
  }
}

// ─── Discover skills in package ──────────────────────────
function discoverSkills() {
  const skills = [];
  if (!fs.existsSync(skillsSource)) return skills;

  const entries = fs.readdirSync(skillsSource, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const skillMd = path.join(skillsSource, entry.name, 'SKILL.md');
      if (fs.existsSync(skillMd)) {
        skills.push({
          name: entry.name,
          path: path.join(skillsSource, entry.name)
        });
      }
    }
  }
  return skills;
}

// ─── Install skills for a runtime ────────────────────────
function installForRuntime(runtimeKey, scope) {
  const runtime = runtimes[runtimeKey];
  const targetDir = scope === 'global' ? runtime.global : runtime.local;
  const skills = discoverSkills();

  if (skills.length === 0) {
    console.log(`  ${red}✗${reset} No skills found in package`);
    return false;
  }

  ensureDir(targetDir);

  let installed = 0;
  for (const skill of skills) {
    const dest = path.join(targetDir, skill.name);
    const method = linkOrCopy(skill.path, dest);
    console.log(`  ${green}✓${reset} ${skill.name} → ${dim}${dest}${reset} ${dim}(${method})${reset}`);
    installed++;
  }

  return installed > 0;
}

// ─── Interactive prompt ──────────────────────────────────
function prompt(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ─── Main ────────────────────────────────────────────────
async function main() {
  const skills = discoverSkills();

  console.log(`  ${bold}Skills found:${reset}`);
  for (const skill of skills) {
    console.log(`  ${brand}•${reset} ${skill.name}`);
  }
  console.log('');

  // Determine runtime
  let runtimeKey = selectedRuntime;

  if (!runtimeKey && !skipPrompts) {
    console.log(`  ${bold}Select runtime:${reset}`);
    const keys = Object.keys(runtimes);
    keys.forEach((key, i) => {
      console.log(`  ${dim}${i + 1})${reset} ${runtimes[key].name}`);
    });
    console.log(`  ${dim}${keys.length + 1})${reset} All`);
    console.log('');

    const choice = await prompt(`  ${bold}Choice${reset} ${dim}[1]${reset}: `);
    const idx = parseInt(choice || '1', 10) - 1;

    if (idx === keys.length) {
      runtimeKey = 'all';
    } else if (idx >= 0 && idx < keys.length) {
      runtimeKey = keys[idx];
    } else {
      runtimeKey = keys[0]; // default to Claude Code
    }
  }

  if (!runtimeKey) {
    runtimeKey = 'claude-code';
  }

  // Determine scope
  const scope = isGlobal ? 'global' : 'local';
  console.log('');
  console.log(`  ${bold}Scope:${reset} ${scope}`);
  console.log('');

  // Install
  console.log(`  ${bold}Installing...${reset}`);
  console.log('');

  if (runtimeKey === 'all') {
    for (const key of Object.keys(runtimes)) {
      console.log(`  ${bold}${runtimes[key].name}:${reset}`);
      installForRuntime(key, scope);
      console.log('');
    }
  } else if (runtimes[runtimeKey]) {
    console.log(`  ${bold}${runtimes[runtimeKey].name}:${reset}`);
    installForRuntime(runtimeKey, scope);
    console.log('');
  } else {
    console.log(`  ${red}✗${reset} Unknown runtime: ${runtimeKey}`);
    console.log(`  ${dim}Available: ${Object.keys(runtimes).join(', ')}${reset}`);
    process.exit(1);
  }

  // Success
  console.log(green + '  ╔══════════════════════════════════════════════╗' + reset);
  console.log(green + '  ║' + reset + '  Installation complete!                      ' + green + '║' + reset);
  console.log(green + '  ╚══════════════════════════════════════════════╝' + reset);
  console.log('');
  console.log(`  ${bold}Usage:${reset}`);
  console.log(`  ${dim}Slash command:${reset}  /azure-devops-backlog-creator doc.md`);
  console.log(`  ${dim}Natural lang:${reset}   "Create backlog from this PRD in Azure DevOps"`);
  console.log('');
  console.log(`  ${dim}Docs: https://github.com/GusY2K/y2k-labs${reset}`);
  console.log('');
}

main().catch((err) => {
  console.error(`  ${red}✗${reset} Installation failed: ${err.message}`);
  process.exit(1);
});
