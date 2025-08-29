import React, { useRef } from "react";

export default function IconTile({ item, onClick }) {
  const ref = useRef(null);

  const press = () => {
    ref.current?.classList.add("is-pressed");
    setTimeout(() => ref.current?.classList.remove("is-pressed"), 130);
    onClick?.(item);
  };

  return (
    <button
      ref={ref}
      className="icon-btn"
      onClick={press}
      aria-label={item.label || item.speak}
    >
      <span className="icon-emoji" aria-hidden="true">
        {item.emoji}
      </span>
      <span className="sr-only">{item.label || item.speak}</span>
    </button>
  );
}
