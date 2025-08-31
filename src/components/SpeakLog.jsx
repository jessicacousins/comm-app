// src/components/SpeakLog.jsx
import React from "react";

export default function SpeakLog({
  items = [],
  onReplay,
  onAddToPhrase,
  max = 20,
}) {
  if (!items.length) return null;
  return (
    <section className="panel" aria-label="Session speak log">
      <div
        className="row"
        style={{ justifyContent: "space-between", marginBottom: 8 }}
      >
        <strong>Spoken (last {Math.min(items.length, max)})</strong>
      </div>
      <div className="chips">
        {items.map((txt, i) => (
          <div key={i} className="chip-row">
            <button
              className="chip-btn"
              title="Replay"
              onClick={() => onReplay(txt)}
            >
              {txt}
            </button>
            <div className="chip-actions">
              <button className="button" onClick={() => onAddToPhrase(txt)}>
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
