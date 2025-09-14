// generate-index.js
const fs = require("fs");
const path = require("path");

const notesDir = path.join(__dirname, "notes"); // your root notes folder
const outputFile = path.join(__dirname, "web", "public", "notes-index.json");

const files = fs.readdirSync(notesDir)
  .filter((f) => f.endsWith(".md"))
  .sort(); // ascending order

fs.writeFileSync(outputFile, JSON.stringify(files, null, 2));
console.log("notes-index.json generated with files:", files);
