import React from "react";
import VocabButton from "./VocabButton.jsx";

export default function Board({ items, favoritesSet, onClickItem }) {
  return (
    <section className="panel" aria-label="Communication board">
      <div className="board">
        {items.map((it) => (
          <VocabButton
            key={it.id}
            item={it}
            isFavorite={favoritesSet.has(it.id)}
            onClick={onClickItem}
          />
        ))}
      </div>
    </section>
  );
}
