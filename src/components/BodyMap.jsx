// src/components/BodyMap.jsx
import React, { useState } from "react";

const PARTS = [
  "Head",
  "Neck",
  "Shoulder",
  "Arm",
  "Hand",
  "Chest",
  "Back",
  "Stomach",
  "Hip",
  "Leg",
  "Knee",
  "Foot",
];

export default function BodyMap({ onSpeak }) {
  const [part, setPart] = useState("");
  const [level, setLevel] = useState(5);

  const say = (p = part, l = level) => {
    if (!p) return;
    const txt = `My ${p.toLowerCase()} hurts. Pain level ${l}.`;
    onSpeak(txt);
  };

  return (
    <section className="panel" aria-label="Pain & sensation">
      <div
        className="row"
        style={{ justifyContent: "space-between", marginBottom: 8 }}
      >
        <strong>Pain Map</strong>
        <div className="row">
          <label className="row">
            Level
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value || "0", 10))}
            />
          </label>
          <button className="button" onClick={() => say()} disabled={!part}>
            Speak
          </button>
        </div>
      </div>

      <div className="body-grid">
        {PARTS.map((p) => (
          <button
            key={p}
            className={`body-cell${p === part ? " active" : ""}`}
            onClick={() => {
              setPart(p);
              say(p, level);
            }}
            aria-pressed={p === part}
            aria-label={`Pain in ${p}`}
          >
            {p}
          </button>
        ))}
      </div>
    </section>
  );
}
