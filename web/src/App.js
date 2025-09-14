import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

function App() {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/notes/01-introduction.md")
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, []);

  return (
    <div className="App">
      <h1>System Design Notes</h1>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

export default App;
