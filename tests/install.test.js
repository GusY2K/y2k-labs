const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  \x1b[32m✓\x1b[0m ${name}`);
    passed++;
  } catch (err) {
    console.log(`  \x1b[31m✗\x1b[0m ${name}`);
    console.log(`    ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

console.log('\n  Y2K Labs — Test Suite\n');

// ─── Structure Tests ─────────────────────────────────────

console.log('  Skill Structure:');

test('SKILL.md exists', () => {
  assert(fs.existsSync('skills/azure-devops/SKILL.md'));
});

test('SKILL.md has valid frontmatter', () => {
  const content = fs.readFileSync('skills/azure-devops/SKILL.md', 'utf8');
  assert(content.startsWith('---'), 'Missing opening ---');
  const secondDash = content.indexOf('---', 3);
  assert(secondDash > 3, 'Missing closing ---');
  const frontmatter = content.substring(3, secondDash);
  assert(frontmatter.includes('name:'), 'Missing name field');
  assert(frontmatter.includes('description:'), 'Missing description field');
});

test('SKILL.md name matches directory', () => {
  const content = fs.readFileSync('skills/azure-devops/SKILL.md', 'utf8');
  assert(content.includes('name: azure-devops'), 'name field must match directory name');
});

test('SKILL.md has allowed-tools', () => {
  const content = fs.readFileSync('skills/azure-devops/SKILL.md', 'utf8');
  assert(content.includes('allowed-tools:'), 'Missing allowed-tools field');
});

test('SKILL.md under 500 lines', () => {
  const content = fs.readFileSync('skills/azure-devops/SKILL.md', 'utf8');
  const lines = content.split('\n').length;
  assert(lines <= 500, `SKILL.md has ${lines} lines (max 500)`);
});

// ─── Reference Files ─────────────────────────────────────

console.log('\n  References:');

const expectedRefs = [
  'backlog-creator.md',
  'health-audit.md',
  'sprint-planner.md',
  'templates.md',
  'cli-work-items.md',
  'cli-areas-iterations.md',
  'cli-authentication.md',
  'cli-workflows.md',
  'cli-fields-reference.md'
];

expectedRefs.forEach(ref => {
  test(`references/${ref} exists`, () => {
    assert(fs.existsSync(`skills/azure-devops/references/${ref}`), `Missing ${ref}`);
  });
});

test('All references are non-empty', () => {
  expectedRefs.forEach(ref => {
    const stat = fs.statSync(`skills/azure-devops/references/${ref}`);
    assert(stat.size > 100, `${ref} is too small (${stat.size} bytes)`);
  });
});

// ─── Scripts ─────────────────────────────────────────────

console.log('\n  Scripts:');

test('validate-prerequisites.sh exists', () => {
  assert(fs.existsSync('skills/azure-devops/scripts/validate-prerequisites.sh'));
});

test('rollback.sh exists', () => {
  assert(fs.existsSync('skills/azure-devops/scripts/rollback.sh'));
});

// ─── Installer ───────────────────────────────────────────

console.log('\n  Installer:');

test('bin/install.js exists', () => {
  assert(fs.existsSync('bin/install.js'));
});

test('package.json has correct bin entry', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert(pkg.bin['y2k-labs'] === 'bin/install.js', 'bin entry must point to bin/install.js');
});

test('package.json name is y2k-labs', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert(pkg.name === 'y2k-labs', `Expected y2k-labs, got ${pkg.name}`);
});

test('installer runs without error (--help)', () => {
  const output = execSync('node bin/install.js --help', { encoding: 'utf8' });
  assert(output.includes('Y2K Labs'), 'Help output must contain Y2K Labs');
});

test('installer shows Y2K Labs banner', () => {
  const output = execSync('node bin/install.js -y --agent=claude-code 2>&1 || true', { encoding: 'utf8' });
  assert(output.includes('Y2K Labs'), 'Must show Y2K Labs in output');
});

// ─── Marketplace ─────────────────────────────────────────

console.log('\n  Marketplace:');

test('marketplace.json exists', () => {
  assert(fs.existsSync('.claude-plugin/marketplace.json'));
});

test('marketplace.json is valid JSON', () => {
  const content = fs.readFileSync('.claude-plugin/marketplace.json', 'utf8');
  JSON.parse(content); // throws if invalid
});

test('marketplace.json references azure-devops skill', () => {
  const mp = JSON.parse(fs.readFileSync('.claude-plugin/marketplace.json', 'utf8'));
  const skills = mp.plugins[0].skills;
  assert(skills.includes('./skills/azure-devops'), 'Must reference azure-devops skill');
});

// ─── Multi-Runtime Configs ───────────────────────────────

console.log('\n  Multi-Runtime:');

test('Cursor config exists', () => {
  assert(fs.existsSync('.cursor/rules/po-skills.mdc'));
});

test('Copilot config exists', () => {
  assert(fs.existsSync('.github/copilot-instructions.md'));
});

test('Windsurf config exists', () => {
  assert(fs.existsSync('.windsurf/rules/po-skills.md'));
});

// ─── Content Quality ─────────────────────────────────────

console.log('\n  Content Quality:');

test('SKILL.md has routing table', () => {
  const content = fs.readFileSync('skills/azure-devops/SKILL.md', 'utf8');
  assert(content.includes('Routing'), 'Must have routing section');
  assert(content.includes('Backlog Creator'), 'Must reference Backlog Creator');
  assert(content.includes('Health Audit'), 'Must reference Health Audit');
  assert(content.includes('Sprint Planner'), 'Must reference Sprint Planner');
  assert(content.includes('Templates'), 'Must reference Templates');
  assert(content.includes('CLI Reference'), 'Must reference CLI Reference');
});

test('No references to old skill names', () => {
  const content = fs.readFileSync('skills/azure-devops/SKILL.md', 'utf8');
  assert(!content.includes('po-skills'), 'Must not reference po-skills');
});

test('README has install command', () => {
  const content = fs.readFileSync('README.md', 'utf8');
  assert(content.includes('npx y2k-labs -g'), 'Must have install command');
});

test('README has no po-skills references', () => {
  const content = fs.readFileSync('README.md', 'utf8');
  assert(!content.includes('npx po-skills'), 'Must not reference po-skills');
});

// ─── Summary ─────────────────────────────────────────────

console.log(`\n  ${passed + failed} tests, ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}
