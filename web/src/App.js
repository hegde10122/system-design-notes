import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Mermaid from "react-mermaid2";

function App() {
  const [chapters, setChapters] = useState([]);
  const [currentFile, setCurrentFile] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/notes-index.json")
      .then((res) => res.json())
      .then((files) => {
        setChapters(files);
        setCurrentFile(files[0]);
      });
  }, []);

  useEffect(() => {
    if (!currentFile) return;
    fetch(`/notes/${currentFile}`)
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, [currentFile]);

  const getTitle = (file) => {
    const namePart = file.replace(/^\d+-/, "").replace(".md", "");
    return namePart
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");
  };

  // Custom renderer for code blocks
  const renderers = {
    code({ language, value }) {
      if (language === "mermaid") {
        return <Mermaid chart={value} />;
      }
      return <pre>{value}</pre>;
    },
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "220px", padding: "20px", borderRight: "1px solid #ccc", background: "#f7f7f7" }}>
        <h3>Chapters</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {chapters.map((file) => (
            <li
              key={file}
              style={{ marginBottom: "10px", cursor: "pointer", fontWeight: currentFile === file ? "bold" : "normal" }}
              onClick={() => setCurrentFile(file)}
            >
              {getTitle(file)}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 1, padding: "30px", overflowY: "auto" }}>
        <ReactMarkdown children={content} components={renderers} />
      </div>
    </div>
  );
}

export default App;
