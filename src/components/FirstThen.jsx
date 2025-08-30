import React, { useEffect, useRef } from "react";

export default function FirstThen({
  first,
  thenStep,
  onSetFirstFromPhrase,
  onSetThenFromPhrase,
  onSetFirstFromLast,
  onSetThenFromLast,
  onClearFirst,
  onClearThen,
  running,
  remaining,
  duration,
  step,
  onStart,
  onPause,
  onReset,
  onDuration,
  onSpeakFirst,
  onSpeakThen,
}) {
  const progressRef = useRef(null);

  useEffect(() => {
    if (!progressRef.current) return;
    const pct =
      duration > 0
        ? Math.max(0, Math.min(100, (remaining / duration) * 100))
        : 0;
    progressRef.current.style.width = `${pct}%`;
  }, [remaining, duration]);

  return (
    <section className="panel firstthen" aria-label="First then schedule">
      <div
        className="row"
        style={{ justifyContent: "space-between", marginBottom: 8 }}
      >
        <strong>First → Then</strong>
        <div className="row">
          <label className="row" title="Timer in seconds">
            Timer
            <input
              type="number"
              min="0"
              step="5"
              value={duration}
              onChange={(e) =>
                onDuration(Math.max(0, parseInt(e.target.value || 0, 10)))
              }
            />
          </label>
          {!running ? (
            <button
              className="button"
              onClick={onStart}
              disabled={!first && !thenStep}
            >
              Start
            </button>
          ) : (
            <button className="button" onClick={onPause}>
              Pause
            </button>
          )}
          <button className="button" onClick={onReset}>
            Reset
          </button>
        </div>
      </div>

      <div className="ft-steps">
        <div
          className={`ft-card ${step === "first" && running ? "active" : ""}`}
        >
          <div className="ft-header">
            <span className="badge">First</span>
            <div className="row">
              <button
                className="button"
                onClick={onSetFirstFromPhrase}
                title="Use current phrase"
              >
                Use phrase
              </button>
              <button
                className="button"
                onClick={onSetFirstFromLast}
                title="Use last tapped"
              >
                Use last
              </button>
              <button
                className="button"
                onClick={onSpeakFirst}
                disabled={!first}
              >
                Speak
              </button>
              <button className="button" onClick={onClearFirst}>
                Clear
              </button>
            </div>
          </div>
          <div className="ft-body">
            {first || <span className="muted">Set the first step…</span>}
          </div>
        </div>

        <div
          className={`ft-card ${step === "then" && running ? "active" : ""}`}
        >
          <div className="ft-header">
            <span className="badge">Then</span>
            <div className="row">
              <button
                className="button"
                onClick={onSetThenFromPhrase}
                title="Use current phrase"
              >
                Use phrase
              </button>
              <button
                className="button"
                onClick={onSetThenFromLast}
                title="Use last tapped"
              >
                Use last
              </button>
              <button
                className="button"
                onClick={onSpeakThen}
                disabled={!thenStep}
              >
                Speak
              </button>
              <button className="button" onClick={onClearThen}>
                Clear
              </button>
            </div>
          </div>
          <div className="ft-body">
            {thenStep || <span className="muted">Set the next step…</span>}
          </div>
        </div>
      </div>

      <div
        className={`ft-timer ${running ? "" : "is-paused"}`}
        aria-hidden={!running}
      >
        <div className="ft-progress" ref={progressRef}></div>
        <span className="ft-remaining">{remaining}s</span>
      </div>
    </section>
  );
}
