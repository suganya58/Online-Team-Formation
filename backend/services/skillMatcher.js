/**
 * AI-Based Skill Matching Service for HackMate
 * Handles skill normalization, explainable scoring, and edge-case safety.
 */

// Canonical dictionary for common tech stack variations
const SYNONYM_MAP = {
  // Frontend
  react: "react",
  "react.js": "react",
  reactjs: "react",
  "react js": "react",

  vue: "vue.js",
  "vue.js": "vue.js",
  vuejs: "vue.js",
  "vue js": "vue.js",

  angular: "angular",
  "angular.js": "angular",
  angularjs: "angular",
  "angular js": "angular",

  next: "next.js",
  "next.js": "next.js",
  nextjs: "next.js",
  "next js": "next.js",

  "tailwind css": "tailwind css",
  tailwindcss: "tailwind css",
  tailwind: "tailwind css",

  // Backend
  node: "node.js",
  "node.js": "node.js",
  nodejs: "node.js",
  "node js": "node.js",

  express: "express.js",
  "express.js": "express.js",
  expressjs: "express.js",
  "express js": "express.js",

  nest: "nest.js",
  "nest.js": "nest.js",
  nestjs: "nest.js",
  "nest js": "nest.js",

  // Database
  mongo: "mongodb",
  mongodb: "mongodb",
  "mongo db": "mongodb",

  postgres: "postgresql",
  postgresql: "postgresql",
  postgresdb: "postgresql",

  // Languages
  js: "javascript",
  javascript: "javascript",

  ts: "typescript",
  typescript: "typescript",

  py: "python",
  python: "python",
  python3: "python",

  cpp: "c++",
  "c++": "c++",
  csharp: "c#",
  "c#": "c#",

  // Cloud & DevOps
  aws: "aws",
  "amazon web services": "aws",

  docker: "docker",
  kubernetes: "kubernetes",
  k8s: "kubernetes",
};

/**
 * Normalizes a skill string to a standardized format.
 * Strips uppercase, extra spaces, and common suffix variations.
 */
function normalizeSkill(skill) {
  if (!skill || typeof skill !== "string") return "";

  // Trim, lowercase, and collapse multiple spaces
  let cleaned = skill
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

  // Direct lookup in synonym map
  if (SYNONYM_MAP[cleaned]) {
    return SYNONYM_MAP[cleaned];
  }

  // Remove common suffixes like .js or js if attached (e.g., chart.js -> chart)
  let strippedJs = cleaned.replace(/(\.js|js)$/i, "");
  if (SYNONYM_MAP[strippedJs]) {
    return SYNONYM_MAP[strippedJs];
  }

  // Remove generic punctuation except '+' and '#'
  return cleaned.replace(/[^\w\s+#]/g, "").trim();
}

/**
 * Converts user or team skill input (array or comma-separated string) into an array of strings.
 */
function parseSkillInput(input) {
  if (!input) return [];

  let array = [];
  if (Array.isArray(input)) {
    array = input;
  } else if (typeof input === "string") {
    array = input.split(",");
  }

  return array
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter((s) => s.length > 0);
}

/**
 * AI Skill Matcher Engine
 * Compares User Skills vs Team Required Skills.
 * Returns matchPercentage (0-100), matchedSkills, and missingSkills.
 */
function matchSkills(userSkillsInput, teamSkillsInput) {
  const rawUserSkills = parseSkillInput(userSkillsInput);
  const rawTeamSkills = parseSkillInput(teamSkillsInput);

  // If team has no required skills listed, user matches 100%
  if (rawTeamSkills.length === 0) {
    return {
      matchPercentage: 100,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  // Set of normalized user skills for O(1) matching
  const normalizedUserSkills = new Set(
    rawUserSkills.map((s) => normalizeSkill(s)).filter((s) => s.length > 0)
  );

  const matchedSkills = [];
  const missingSkills = [];
  const processedTeamSkills = new Set();

  for (const reqSkill of rawTeamSkills) {
    const normReq = normalizeSkill(reqSkill);
    if (!normReq) continue;

    // Avoid duplicate scoring for repeated skills in team list
    if (processedTeamSkills.has(normReq)) continue;
    processedTeamSkills.add(normReq);

    if (normalizedUserSkills.has(normReq)) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  }

  const totalRequired = processedTeamSkills.size;

  if (totalRequired === 0) {
    return {
      matchPercentage: 100,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  // Calculate percentage: (matched / required) * 100
  const rawPercentage = (matchedSkills.length / totalRequired) * 100;
  const matchPercentage = Math.min(100, Math.max(0, Math.round(rawPercentage)));

  return {
    matchPercentage: isNaN(matchPercentage) ? 0 : matchPercentage,
    matchedSkills,
    missingSkills,
  };
}

module.exports = {
  matchSkills,
  normalizeSkill,
};
