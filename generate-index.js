const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const notesDir = path.join(__dirname, "notes"); // source Markdown
const publicNotesDir = path.join(__dirname, "web/public/notes");
const diagramsDir = path.join(publicNotesDir, "diagrams");
const indexFile = path.join(publicNotesDir, "notes-index.json");

// Ensure folders exist
if (!fs.existsSync(publicNotesDir)) fs.mkdirSync(publicNotesDir, { recursive: true });
if (!fs.existsSync(diagramsDir)) fs.mkdirSync(diagramsDir, { recursive: true });

// Get all Markdown files, sorted
const mdFiles = fs.readdirSync(notesDir).filter(f => f.endsWith(".md")).sort();

// Write notes-index.json
fs.writeFileSync(indexFile, JSON.stringify(mdFiles, null, 2), "utf8");
console.log("Generated notes-index.json");

// Process each Markdown file
mdFiles.forEach(file => {
  let content = fs.readFileSync(path.join(notesDir, file), "utf8");
  let diagramCount = 0;

  // Replace Mermaid blocks with SVG images
  content = content.replace(/```mermaid([\s\S]*?)```/g, (match, mermaidCode) => {
    diagramCount++;
    const diagramFileName = `${file.replace(".md","")}-${diagramCount}.svg`;
    const diagramPath = path.join(diagramsDir, diagramFileName);

    // Temporary .mmd file
    const tempMmd = path.join(diagramsDir, `${diagramFileName}.mmd`);
    fs.writeFileSync(tempMmd, mermaidCode, "utf8");

    // Generate SVG at **moderate size**
    execSync(`npx mmdc -i "${tempMmd}" -o "${diagramPath}" -w 400 -H 300`);

    fs.unlinkSync(tempMmd); // remove temp

    // Return Markdown image syntax
    return `![Mermaid Diagram](/notes/diagrams/${diagramFileName})`;
  });

  // Write processed Markdown into public folder
  fs.writeFileSync(path.join(publicNotesDir, file), content, "utf8");
  console.log(`Processed ${file}`);
});
