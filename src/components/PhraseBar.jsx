import React from "react";

export default function PhraseBar({
  phraseTokens,
  onSpeak,
  onClear,
  onUndo,
  onSaveFavorite,
}) {
  return (
    <aside className="panel phrase" aria-label="Phrase builder and actions">
      <div className="phrase-row" aria-live="polite" aria-atomic="false">
        {phraseTokens.length === 0 ? (
          <span className="muted">Tap buttons to build a phrase…</span>
        ) : (
          phraseTokens.map((t, i) => (
            <span key={`${t.id}-${i}`} className="phrase-chip">
              {t.label}
            </span>
          ))
        )}
      </div>

      <div className="phrase-actions">
        <button
          className="button primary"
          onClick={onSpeak}
          aria-label="Speak phrase"
        >
          Speak
        </button>
        <button className="button" onClick={onUndo} aria-label="Undo last word">
          Undo
        </button>
        <button className="button" onClick={onClear} aria-label="Clear phrase">
          Clear
        </button>
        <button
          className="button"
          onClick={onSaveFavorite}
          aria-label="Save favorites"
        >
          ★ Favorites
        </button>
      </div>

      <div className="panel">
        <h3 style={{ marginTop: 2, marginBottom: 8 }}>Tips</h3>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.5 }}>
          <li>
            Use <strong>Speak</strong> to read your built phrase aloud.
          </li>
          <li>
            <strong>Undo</strong> removes the last word; <strong>Clear</strong>{" "}
            resets.
          </li>
          <li>
            Add frequent words to <strong>Favorites</strong> for faster access.
          </li>
        </ul>
      </div>
    </aside>
  );
}
