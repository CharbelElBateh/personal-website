/* Pre-commit guard: refuses a commit whose staged changes look like they contain a secret
   or a local-only file. Installed by `npm install` (prepare script → git hooks in .githooks/).
   Bypass for a known false positive: git commit --no-verify */
import { execFileSync } from "node:child_process";

const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

const BLOCKED_FILES = [
  /(^|\/)\.env(\.|$)(?!example)/, /\.(pem|key|p12|pfx)$/, /(^|\/)id_(rsa|ed25519)/,
  /^\.impeccable\/(live\/|hook\.cache\.json|config\.local\.json)/, /^\.claude\/settings\.local\.json$/,
  /(^|\/)(credentials|service-account)[^/]*\.json$/,
];
const PATTERNS = [
  ["private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["GitHub token", /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{40,}\b/],
  ["OpenAI/Anthropic key", /\bsk-(ant-)?[A-Za-z0-9_-]{24,}\b/],
  ["Slack token", /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["Stripe live key", /\b(sk|rk)_live_[0-9A-Za-z]{20,}\b/],
  ["generic secret assignment", /\b(secret|password|passwd|api[_-]?key|auth[_-]?token)\b\s*[:=]\s*["'][^"'\s]{12,}["']/i],
];

const files = git("diff", "--cached", "--name-only", "--diff-filter=ACMR").split("\n").filter(Boolean);
const problems = [];
for (const f of files) {
  if (BLOCKED_FILES.some((re) => re.test(f))) problems.push(`${f}: local-only or secret file`);
}
const diff = git("diff", "--cached", "--unified=0", "--no-color", "--diff-filter=ACMR", "--", ".", ":(exclude)package-lock.json");
let current = "";
for (const line of diff.split("\n")) {
  if (line.startsWith("+++ b/")) { current = line.slice(6); continue; }
  if (!line.startsWith("+") || line.startsWith("+++")) continue;
  for (const [label, re] of PATTERNS) if (re.test(line)) problems.push(`${current}: looks like a ${label}`);
}

if (problems.length) {
  console.error(`\nCommit blocked — possible secrets or local files:\n  ${[...new Set(problems)].join("\n  ")}\n` +
    "Remove them (and add to .gitignore), or commit with --no-verify if this is a false positive.\n");
  process.exit(1);
}
