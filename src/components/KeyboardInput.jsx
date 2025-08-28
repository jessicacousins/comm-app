import React, { useState } from "react";

export default function KeyboardInput({ onSpeak, onAddToPhrase }) {
  const [text, setText] = useState("");

  const speakNow = () => {
    if (!text.trim()) return;
    onSpeak(text.trim());
  };
  const addWords = () => {
    if (!text.trim()) return;
    const tokens = text
      .trim()
      .split(/\s+/)
      .map((w, i) => ({ id: `k-${Date.now()}-${i}`, label: w, speak: w }));
    onAddToPhrase(tokens);
    setText("");
  };

  return (
    <div className="panel" aria-label="Keyboard input">
      <div className="row" style={{ alignItems: "stretch" }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type custom text…"
          aria-label="Type custom text"
        />
        <button
          className="button"
          onClick={speakNow}
          aria-label="Speak typed text"
        >
          Speak
        </button>
        <button
          className="button"
          onClick={addWords}
          aria-label="Add typed words to phrase"
        >
          Add
        </button>
      </div>
    </div>
  );
}
