import React, { useEffect, useMemo, useState } from "react";
import { CATEGORIES, VOCAB } from "./data/vocab.js";
import {
  ttsSupported,
  getVoices,
  speakText,
  cancelSpeech,
} from "./utils/tts.js";
import CategoryBar from "./components/CategoryBar.jsx";
import Board from "./components/Board.jsx";
import PhraseBar from "./components/PhraseBar.jsx";
import SpeechControls from "./components/SpeechControls.jsx";
import KeyboardInput from "./components/KeyboardInput.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";

const LS_KEYS = {
  favorites: "speakboard_favorites_v1",
  settings: "speakboard_settings_v1",
  usage: "speakboard_usage_v1",
  lastVoice: "speakboard_voice_v1",
};

export default function App() {
  // UI state
  const [activeCat, setActiveCat] = useState("core");
  const [phrase, setPhrase] = useState([]);
  const [favorites, setFavorites] = useState(
    () => new Set(JSON.parse(localStorage.getItem(LS_KEYS.favorites) || "[]"))
  );
  const [usage, setUsage] = useState(() =>
    JSON.parse(localStorage.getItem(LS_KEYS.usage) || "{}")
  );

  const [voices, setVoices] = useState([]);
  const [voiceName, setVoiceName] = useState(
    localStorage.getItem(LS_KEYS.lastVoice) || ""
  );
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);

  const [highContrast, setHighContrast] = useState(
    () =>
      JSON.parse(localStorage.getItem(LS_KEYS.settings) || "{}")
        ?.highContrast || false
  );
  const [largeButtons, setLargeButtons] = useState(
    () =>
      JSON.parse(localStorage.getItem(LS_KEYS.settings) || "{}")
        ?.largeButtons || false
  );

  // Derive
  const currentItems = VOCAB[activeCat] || [];
  const favoritesSet = favorites;

  // Effects: load voices
  useEffect(() => {
    if (!ttsSupported()) return;
    const assign = () => setVoices(getVoices());
    assign();
    window.speechSynthesis.addEventListener("voiceschanged", assign);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", assign);
  }, []);

  // Apply high contrast & size classes to <body>
  useEffect(() => {
    document.body.classList.toggle("high-contrast", highContrast);
    document.documentElement.style.setProperty(
      "--btn-size",
      largeButtons ? "min(120px, 12vh)" : "clamp(56px, 6.6vh, 92px)"
    );
    const saved = { highContrast, largeButtons };
    localStorage.setItem(LS_KEYS.settings, JSON.stringify(saved));
  }, [highContrast, largeButtons]);

  // Persist favorites & usage
  useEffect(() => {
    localStorage.setItem(
      LS_KEYS.favorites,
      JSON.stringify(Array.from(favorites))
    );
  }, [favorites]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.usage, JSON.stringify(usage));
  }, [usage]);

  const selectedVoice = useMemo(
    () =>
      voices.find((v) => v.name === voiceName) ||
      voices.find((v) => /en/i.test(v.lang || "")) ||
      voices[0],
    [voices, voiceName]
  );

  // Handlers
  const handleItem = (item) => {
    setPhrase((p) => [...p, item]);
    // Count usage for basic ABA-friendly logging
    setUsage((u) => ({ ...u, [item.id]: (u[item.id] || 0) + 1 }));
    // Immediate echo of the single word for reinforcement
    speakText(item.speak || item.label, {
      voice: selectedVoice,
      rate,
      pitch,
      volume,
    });
  };

  const speakPhrase = () => {
    if (phrase.length === 0) return;
    const text = phrase.map((t) => t.speak || t.label).join(" ");
    speakText(text, {
      voice: selectedVoice,
      rate,
      pitch,
      volume,
      onend: () => {},
    });
  };

  const clearPhrase = () => {
    cancelSpeech();
    setPhrase([]);
  };
  const undoPhrase = () => setPhrase((p) => p.slice(0, -1));

  const saveFavorites = () => {
    if (phrase.length === 0) return;
    const ids = phrase.map((p) => p.id);
    const next = new Set(favorites);
    ids.forEach((id) => next.add(id));
    setFavorites(next);
  };

  const addTypedTokens = (tokens) => setPhrase((p) => [...p, ...tokens]);

  // Counts shown by category (how many buttons)
  const catCounts = useMemo(() => {
    const out = {};
    for (const c of CATEGORIES) out[c.id] = (VOCAB[c.id] || []).length;
    return out;
  }, []);

  const exportUsageCSV = () => {
    const rows = [["item_id", "label", "category", "count"]];
    for (const [catId, items] of Object.entries(VOCAB)) {
      items.forEach((it) => {
        rows.push([it.id, it.label, catId, usage[it.id] || 0]);
      });
    }
    const csv = rows
      .map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `speakboard-usage-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const previewVoice = () =>
    speakText("This is a voice preview.", {
      voice: selectedVoice,
      rate,
      pitch,
      volume,
    });

  useEffect(() => {
    if (selectedVoice?.name) {
      setVoiceName(selectedVoice.name);
      localStorage.setItem(LS_KEYS.lastVoice, selectedVoice.name);
    }
  }, [selectedVoice?.name]);

  return (
    <div className="app">
      <header className="header" role="banner">
        <div className="brand">
          <div className="logo" aria-hidden="true"></div>
          <h1>SpeakBoard Pro</h1>
        </div>

        <div className="header-right">
          <SpeechControls
            voices={voices}
            voiceName={voiceName}
            rate={rate}
            pitch={pitch}
            volume={volume}
            onVoice={setVoiceName}
            onRate={setRate}
            onPitch={setPitch}
            onVolume={setVolume}
            onPreview={previewVoice}
          />
          <SettingsPanel
            highContrast={highContrast}
            onHighContrast={() => setHighContrast((v) => !v)}
            largeButtons={largeButtons}
            onLargeButtons={() => setLargeButtons((v) => !v)}
            onExportUsage={exportUsageCSV}
          />
        </div>
      </header>

      <main id="main" className="main" role="main">
        {/* Left */}
        <CategoryBar
          categories={CATEGORIES}
          activeId={activeCat}
          counts={catCounts}
          onPick={setActiveCat}
        />

        {/* Center */}
        <Board
          items={currentItems}
          favoritesSet={favoritesSet}
          onClickItem={handleItem}
        />

        {/* Right */}
        <PhraseBar
          phraseTokens={phrase}
          onSpeak={speakPhrase}
          onClear={clearPhrase}
          onUndo={undoPhrase}
          onSaveFavorite={saveFavorites}
        />
      </main>

      <section
        className="panel"
        style={{ margin: "0 var(--gap) var(--gap) var(--gap)" }}
      >
        <KeyboardInput
          onSpeak={(text) =>
            speakText(text, { voice: selectedVoice, rate, pitch, volume })
          }
          onAddToPhrase={addTypedTokens}
        />
        <p className="muted" style={{ marginTop: 8 }}>
          <strong>Keyboard tips:</strong> Type and hit <kbd>Enter</kbd> to
          speak, or use <em>Add</em> to place words into the phrase row for
          later.
        </p>
      </section>
    </div>
  );
}
