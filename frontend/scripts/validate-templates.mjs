import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const templates = [
  "templates/homepage.html",
  "templates/service-template.html",
  "templates/location-template.html",
  "templates/emergency-landing.html",
];

const requiredPatterns = [
  { label: "doctype", regex: /<!doctype html>/i },
  { label: "html tag", regex: /<html\b/i },
  { label: "body tag", regex: /<body\b/i },
  { label: "main landmark", regex: /<main\b/i },
  { label: "skip link", regex: /skip-link/i },
  { label: "template context", regex: /<body[^>]*\bdata-template=/i },
  { label: "tracked CTA", regex: /data-track=/i },
];

let hasError = false;

for (const relPath of templates) {
  const filePath = resolve(process.cwd(), relPath);
  const content = readFileSync(filePath, "utf8");

  for (const pattern of requiredPatterns) {
    if (!pattern.regex.test(content)) {
      console.error(`Template validation failed: ${relPath} is missing ${pattern.label}.`);
      hasError = true;
    }
  }
}

if (hasError) {
  process.exit(1);
}

console.log("Template validation passed.");
