import React, { useState } from "react";

export default function SceneBoard({ scenes, phrasesByScene, onPick }) {
  const [scene, setScene] = useState(scenes[0]?.id);

  return (
    <section className="panel" aria-label="Scene phrase boards">
      <div className="scene-tabs" role="tablist" aria-label="Scenes">
        {scenes.map((s) => {
          const active = s.id === scene;
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={active}
              className={`category-btn${active ? " active" : ""}`}
              onClick={() => setScene(s.id)}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="scene-board">
        {(phrasesByScene[scene] || []).map((p) => (
          <button
            key={p.id}
            className="scene-card"
            onClick={() => onPick(p)}
            aria-label={`Say: ${p.label}`}
          >
            <span className="scene-text">{p.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
