import React from "react";

export default function SpeechControls({
  voices,
  voiceName,
  rate,
  pitch,
  volume,
  onVoice,
  onRate,
  onPitch,
  onVolume,
  onPreview,
}) {
  return (
    <div className="controls">
      <label className="row">
        Voice
        <select
          value={voiceName}
          onChange={(e) => onVoice(e.target.value)}
          aria-label="Select voice"
        >
          {voices.map((v) => (
            <option key={v.name} value={v.name}>
              {v.name} {v.lang ? `(${v.lang})` : ""}
            </option>
          ))}
        </select>
      </label>

      <label className="row">
        Rate
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.05"
          value={rate}
          onChange={(e) => onRate(parseFloat(e.target.value))}
        />
      </label>

      <label className="row">
        Pitch
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.05"
          value={pitch}
          onChange={(e) => onPitch(parseFloat(e.target.value))}
        />
      </label>

      <label className="row">
        Volume
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => onVolume(parseFloat(e.target.value))}
        />
      </label>

      <button className="button" onClick={onPreview} aria-label="Preview voice">
        Preview
      </button>
    </div>
  );
}
