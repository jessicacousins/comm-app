import React from "react";

export default function SettingsPanel({
  highContrast,
  onHighContrast,
  largeButtons,
  onLargeButtons,
  onExportUsage,
}) {
  return (
    <div className="settings">
      <button
        className={`toggle ${highContrast ? "active" : ""}`}
        onClick={onHighContrast}
        aria-pressed={highContrast}
        aria-label="Toggle high contrast"
      >
        High Contrast
      </button>

      <button
        className={`toggle ${largeButtons ? "active" : ""}`}
        onClick={onLargeButtons}
        aria-pressed={largeButtons}
        aria-label="Toggle large buttons"
      >
        Large Buttons
      </button>

      <button
        className="toggle"
        onClick={onExportUsage}
        aria-label="Export usage data"
      >
        Export Usage CSV
      </button>
    </div>
  );
}
