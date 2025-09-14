const fs = require("fs");
const path = require("path");

// Paths
const notesDir = path.join(__dirname, "notes");
const publicNotesDir = path.join(__dirname, "web", "public", "notes");
const indexFile = path.join(__dirname, "web", "public", "notes-index.json");

// Ensure public notes folder exists
if (!fs.existsSync(publicNotesDir)) fs.mkdirSync(publicNotesDir, { recursive: true });

// Read all markdown files
const mdFiles = fs.readdirSync(notesDir).filter(f => f.endsWith(".md")).sort();

// Write JSON index
fs.writeFileSync(indexFile, JSON.stringify(mdFiles, null, 2), "utf8");
console.log("Generated notes-index.json");

// Copy files as UTF-8
mdFiles.forEach(file => {
  const content = fs.readFileSync(path.join(notesDir, file), "utf8");
  fs.writeFileSync(path.join(publicNotesDir, file), content, "utf8");
  console.log(`Copied ${file}`);
});
