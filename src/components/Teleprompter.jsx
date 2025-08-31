// src/components/Teleprompter.jsx
import React from "react";

export default function Teleprompter({ open, text, onClose }) {
  if (!open) return null;
  return (
    <div
      className="teleprompter"
      role="dialog"
      aria-live="assertive"
      aria-label="Teleprompter"
    >
      <div className="tele-wrap">
        <div className="tele-text">{text}</div>
        <div className="tele-actions">
          <button className="button" onClick={onClose} autoFocus>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
