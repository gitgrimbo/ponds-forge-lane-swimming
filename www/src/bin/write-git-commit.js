const fs = require("fs");
const path = require("path");
const git = require("git-rev-sync");

const args = process.argv.slice(2);

// The folder containing the ".git" folder.
const repoPath = path.resolve(args[0]);
const outputFilename = args[1];

const hash = git.short(repoPath, 8);
const date = git.date(repoPath);

const info = {
  hash,
  date,
};

fs.writeFileSync(outputFilename, JSON.stringify(info, null, 1), "utf8");
