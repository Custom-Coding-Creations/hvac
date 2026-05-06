import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const canonicalEventPattern = /^[a-z0-9]+_[a-z0-9]+_[a-z0-9_]+_[a-z0-9]+$/;

const docsToScan = [
  "../ux/IA-CONVERSION-BLUEPRINT-v2.md",
  "IMPLEMENTATION-GUIDE.md",
];

const inlineCodePattern = /`([^`]+)`/g;
const quotedExamplePattern = /"([a-z0-9_]+)"/g;
const eventTokenPattern = /^[a-z0-9_]+$/;

/**
 * @param {string} content
 * @returns {string[]}
 */
function collectCandidates(content) {
  /** @type {string[]} */
  const candidates = [];
  let match = null;

  while ((match = inlineCodePattern.exec(content)) !== null) {
    candidates.push(match[1]);
  }

  while ((match = quotedExamplePattern.exec(content)) !== null) {
    candidates.push(match[1]);
  }

  return candidates.filter((value) => value.includes("_") && eventTokenPattern.test(value));
}

let hasError = false;

for (const relPath of docsToScan) {
  const filePath = resolve(process.cwd(), relPath);
  const content = readFileSync(filePath, "utf8");
  const candidates = collectCandidates(content);

  for (const candidate of candidates) {
    if (!candidate.includes("click_") && !candidate.includes("submit_")) {
      continue;
    }

    if (!canonicalEventPattern.test(candidate)) {
      console.error(`Tracking taxonomy validation failed in ${relPath}: ${candidate}`);
      hasError = true;
    }
  }
}

if (hasError) {
  process.exit(1);
}

console.log("Tracking docs validation passed.");
