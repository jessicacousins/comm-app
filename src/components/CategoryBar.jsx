import React from "react";

export default function CategoryBar({
  categories,
  activeId,
  counts = {},
  onPick,
}) {
  return (
    <nav className="panel categories" aria-label="Vocabulary categories">
      {categories.map((c) => {
        const isActive = c.id === activeId;
        const count = counts[c.id] ?? 0;
        return (
          <button
            key={c.id}
            className={`category-btn${isActive ? " active" : ""}`}
            onClick={() => onPick(c.id)}
            aria-pressed={isActive}
            aria-label={`Category ${c.label}`}
          >
            <span>{c.label}</span>
            <span className="count">{count}</span>
          </button>
        );
      })}
    </nav>
  );
}
