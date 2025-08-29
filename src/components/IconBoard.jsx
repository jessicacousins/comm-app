import React, { useState } from "react";
import IconTile from "./IconTile.jsx";

export default function IconBoard({ packs, iconsByPack, onPick }) {
  const [pack, setPack] = useState(packs[0]?.id);

  return (
    <section className="panel" aria-label="Icon communication board">
      <div className="icon-packbar" role="tablist" aria-label="Icon sets">
        {packs.map((p) => {
          const active = p.id === pack;
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={active}
              className={`category-btn${active ? " active" : ""}`}
              onClick={() => setPack(p.id)}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="icon-board">
        {(iconsByPack[pack] || []).map((ic) => (
          <IconTile key={ic.id} item={ic} onClick={onPick} />
        ))}
      </div>
    </section>
  );
}
