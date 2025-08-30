import React, { useEffect, useMemo, useState, useRef } from "react";
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

// Icons board
import IconBoard from "./components/IconBoard.jsx";
import { ICON_PACKS, ICONS, totalIconCount } from "./data/icons.js";

//  Scenes + FirstThen
import SceneBoard from "./components/SceneBoard.jsx";
import { SCENES, SCENE_PHRASES, totalSceneCount } from "./data/scenes.js";
import FirstThen from "./components/FirstThen.jsx";

const LS_KEYS = {
  favorites: "speakboard_favorites_v1",
  settings: "speakboard_settings_v1",
  usage: "speakboard_usage_v1",
  lastVoice: "speakboard_voice_v1",
};

export default function App() {
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

  const [lastTapped, setLastTapped] = useState(null);

  const currentItems = VOCAB[activeCat] || [];
  const favoritesSet = favorites;

  const categoriesNav = useMemo(() => {
    const extras = [
      { id: "icons", label: "Icon Board" },
      { id: "scenes", label: "Scenes" },
    ];
    const seen = new Set(CATEGORIES.map((c) => c.id));
    const out = [...CATEGORIES];
    for (const e of extras) if (!seen.has(e.id)) out.push(e);
    return out;
  }, []);

  const itemsById = useMemo(() => {
    const map = {};
    for (const [cat, items] of Object.entries(VOCAB)) {
      for (const it of items) map[it.id] = it;
    }
    return map;
  }, []);

  // Voices
  useEffect(() => {
    if (!ttsSupported()) return;
    const assign = () => setVoices(getVoices());
    assign();
    window.speechSynthesis.addEventListener("voiceschanged", assign);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", assign);
  }, []);

  // High contrast / button size
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
    setUsage((u) => ({ ...u, [item.id]: (u[item.id] || 0) + 1 }));
    setLastTapped(item);
    speakText(item.speak || item.label, {
      voice: selectedVoice,
      rate,
      pitch,
      volume,
    });
  };
  const handleIcon = (ic) =>
    handleItem({ id: ic.id, label: ic.label, speak: ic.speak });
  const handleScenePhrase = (p) =>
    handleItem({ id: p.id, label: p.label, speak: p.speak });

  const speakPhrase = () => {
    if (phrase.length === 0) return;
    const text = phrase.map((t) => t.speak || t.label).join(" ");
    speakText(text, { voice: selectedVoice, rate, pitch, volume });
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

  // Left-nav counts
  const catCounts = useMemo(() => {
    const out = {};
    for (const c of categoriesNav) {
      if (c.id === "icons") out[c.id] = totalIconCount();
      else if (c.id === "scenes") out[c.id] = totalSceneCount();
      else out[c.id] = (VOCAB[c.id] || []).length;
    }
    return out;
  }, [categoriesNav]);

  const exportUsageCSV = () => {
    const rows = [["item_id", "label", "category", "count"]];
    for (const [catId, items] of Object.entries(VOCAB)) {
      items.forEach((it) =>
        rows.push([it.id, it.label, catId, usage[it.id] || 0])
      );
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

  // ! First → Then state
  const [ftFirst, setFtFirst] = useState("");
  const [ftThen, setFtThen] = useState("");
  const [ftDuration, setFtDuration] = useState(60); // seconds
  const [ftRemaining, setFtRemaining] = useState(60);
  const [ftRunning, setFtRunning] = useState(false);
  const [ftStep, setFtStep] = useState("first"); // "first" | "then"
  const ftTimerRef = useRef(null);

  const textFromPhrase = (arr) =>
    arr
      .map((t) => t.speak || t.label)
      .join(" ")
      .trim();

  const setFirstFromPhrase = () => {
    const txt = textFromPhrase(phrase);
    if (txt) setFtFirst(txt);
  };
  const setThenFromPhrase = () => {
    const txt = textFromPhrase(phrase);
    if (txt) setFtThen(txt);
  };
  const setFirstFromLast = () => {
    if (lastTapped) setFtFirst(lastTapped.speak || lastTapped.label);
  };
  const setThenFromLast = () => {
    if (lastTapped) setFtThen(lastTapped.speak || lastTapped.label);
  };
  const clearFirst = () => setFtFirst("");
  const clearThen = () => setFtThen("");

  // Timer control
  const ftStart = () => {
    if (!ftFirst && !ftThen) return;
    setFtRunning(true);
    setFtRemaining(ftDuration);
    clearInterval(ftTimerRef.current);
    ftTimerRef.current = setInterval(() => {
      setFtRemaining((r) => {
        if (r <= 1) {
          if (ftStep === "first" && ftThen) {
            // advance to THEN
            setFtStep("then");
            speakText(ftThen, { voice: selectedVoice, rate, pitch, volume });
            return ftDuration;
          } else {
            // finished
            clearInterval(ftTimerRef.current);
            setFtRunning(false);
            setFtStep("first");
            return 0;
          }
        }
        return r - 1;
      });
    }, 1000);
    // Speak current step at start
    const startText = ftStep === "first" ? ftFirst : ftThen;
    if (startText)
      speakText(startText, { voice: selectedVoice, rate, pitch, volume });
  };

  const ftPause = () => {
    setFtRunning(false);
    clearInterval(ftTimerRef.current);
  };
  const ftReset = () => {
    setFtRunning(false);
    clearInterval(ftTimerRef.current);
    setFtRemaining(ftDuration);
    setFtStep("first");
  };
  const ftSetDuration = (n) => {
    setFtDuration(n);
    setFtRemaining(n);
  };
  const ftSpeakFirst = () =>
    ftFirst &&
    speakText(ftFirst, { voice: selectedVoice, rate, pitch, volume });
  const ftSpeakThen = () =>
    ftThen && speakText(ftThen, { voice: selectedVoice, rate, pitch, volume });

  // Cleanup
  useEffect(() => () => clearInterval(ftTimerRef.current), []);

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
        {/* Left nav includes icons and scenes */}
        <CategoryBar
          categories={categoriesNav}
          activeId={activeCat}
          counts={catCounts}
          onPick={setActiveCat}
        />

        {/* Center: word board, icons, or scenes */}
        {activeCat === "icons" ? (
          <IconBoard
            packs={ICON_PACKS}
            iconsByPack={ICONS}
            onPick={handleIcon}
          />
        ) : activeCat === "scenes" ? (
          <SceneBoard
            scenes={SCENES}
            phrasesByScene={SCENE_PHRASES}
            onPick={handleScenePhrase}
          />
        ) : (
          <Board
            items={currentItems}
            favoritesSet={favoritesSet}
            onClickItem={handleItem}
          />
        )}

        {/* Right: phrase builder + First→Then */}
        <div className="right-col">
          <PhraseBar
            phraseTokens={phrase}
            onSpeak={speakPhrase}
            onClear={clearPhrase}
            onUndo={undoPhrase}
            onSaveFavorite={saveFavorites}
          />

          <FirstThen
            first={ftFirst}
            thenStep={ftThen}
            onSetFirstFromPhrase={setFirstFromPhrase}
            onSetThenFromPhrase={setThenFromPhrase}
            onSetFirstFromLast={setFirstFromLast}
            onSetThenFromLast={setThenFromLast}
            onClearFirst={clearFirst}
            onClearThen={clearThen}
            running={ftRunning}
            remaining={ftRemaining}
            duration={ftDuration}
            step={ftStep}
            onStart={ftStart}
            onPause={ftPause}
            onReset={ftReset}
            onDuration={ftSetDuration}
            onSpeakFirst={ftSpeakFirst}
            onSpeakThen={ftSpeakThen}
          />
        </div>
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
