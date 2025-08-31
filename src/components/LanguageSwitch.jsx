// src/components/LanguageSwitch.jsx
import React from "react";

// languages: 'auto' = keep user's selected voice; others try to match voices by BCP-47
export default function LanguageSwitch({ lang, onLang }) {
  return (
    <div className="row" aria-label="Language">
      <label htmlFor="langSel" className="muted">
        Speak in
      </label>
      <select
        id="langSel"
        value={lang}
        onChange={(e) => onLang(e.target.value)}
      >
        <option value="auto">Auto</option>
        <option value="en">English</option>
        <option value="es">Spanish (Español)</option>
        <option value="fr">French (Français)</option>
        <option value="pt">Portuguese (Português)</option>
      </select>
    </div>
  );
}
