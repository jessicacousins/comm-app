import React, { useRef } from "react";

export default function VocabButton({ item, onClick, isFavorite }) {
  const ref = useRef(null);

  const press = () => {
    // Visual pressed feedback for obvious highlighting
    ref.current?.classList.add("is-pressed");
    setTimeout(() => ref.current?.classList.remove("is-pressed"), 130);
    onClick(item);
  };

  return (
    <button
      ref={ref}
      className="vocab-btn"
      onClick={press}
      aria-label={`Say: ${item.label}`}
    >
      <span className="label">{item.label}</span>
      {isFavorite ? (
        <span className="fav" aria-hidden>
          ★
        </span>
      ) : null}
    </button>
  );
}
