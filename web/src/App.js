import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

function App() {
  const [chapters, setChapters] = useState([]);
  const [currentFile, setCurrentFile] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/notes-index.json")
      .then(res => res.json())
      .then(files => {
        setChapters(files);
        setCurrentFile(files[0]);
      });
  }, []);

  useEffect(() => {
    if (!currentFile) return;
    fetch(`/notes/${currentFile}`)
      .then(res => res.text())
      .then(text => setContent(text));
  }, [currentFile]);

  const getTitle = (file) => file.replace(/^\d+-/, "").replace(".md", "")
    .split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");

  const components = {
    img({ node, ...props }) {
      return (
       <div className="diagram-wrapper">
        <img
          {...props}
          alt={props.alt}
          style={{
            width: "100%",
            maxWidth: "600px", // restrict diagram width
            height: "auto",
            maxHeight:"600px",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>
      );
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "220px", padding: "20px", borderRight: "1px solid #ccc", background: "#f7f7f7" }}>
        <h3>Chapters</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {chapters.map(file => (
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

      <div style={{ flex: 1, padding: "30px", overflowY: "auto" }} className="markdown-content">
        <ReactMarkdown children={content} components={components} />
      </div>
    </div>
  );
}

export default App;
