import Image from "next/image";

import { malaysianStates } from "@/data/states";
import type { StateSlug } from "@/types";

interface StateSelectorProps {
  selectedState: StateSlug | "";
  onSelect: (stateSlug: StateSlug) => void;
}

export function StateSelector({
  selectedState,
  onSelect
}: StateSelectorProps) {
  return (
    <>
      <div className="state-grid" role="group" aria-label="Pilih negeri">
        {malaysianStates.map((state) => {
          const selected = state.slug === selectedState;

          return (
            <button
              aria-label={state.name}
              aria-pressed={selected}
              className={`state-card${selected ? " selected" : ""}`}
              key={state.slug}
              type="button"
              onClick={() => onSelect(state.slug)}
            >
              <span className="state-symbols">
                <Image
                  alt={`Bendera ${state.name}`}
                  className="state-flag"
                  height={27}
                  src={state.flag}
                  width={43}
                />
                <Image
                  alt={`Jata ${state.name}`}
                  className="state-crest"
                  height={30}
                  src={state.crest}
                  width={27}
                />
              </span>
              <strong>{state.shortName}</strong>
              <i aria-hidden="true">✓</i>
            </button>
          );
        })}
      </div>
      <p className="state-prompt">
        Tekan satu kad untuk melihat Pandi bertukar pakaian.
      </p>
    </>
  );
}
