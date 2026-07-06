import { withBasePath } from "@/lib/paths";
import type { MalaysianState, StateSlug } from "@/types";

const stateNames: ReadonlyArray<
  readonly [StateSlug, string, string]
> = [
  ["johor", "Johor", "Johor"],
  ["kedah", "Kedah", "Kedah"],
  ["kelantan", "Kelantan", "Kelantan"],
  ["melaka", "Melaka", "Melaka"],
  ["negeri-sembilan", "Negeri Sembilan", "Negeri Sembilan"],
  ["pahang", "Pahang", "Pahang"],
  ["perak", "Perak", "Perak"],
  ["perlis", "Perlis", "Perlis"],
  ["pulau-pinang", "Pulau Pinang", "Pulau Pinang"],
  ["sabah", "Sabah", "Sabah"],
  ["sarawak", "Sarawak", "Sarawak"],
  ["selangor", "Selangor", "Selangor"],
  ["terengganu", "Terengganu", "Terengganu"],
  ["kuala-lumpur", "W.P. Kuala Lumpur", "Kuala Lumpur"],
  ["labuan", "W.P. Labuan", "Labuan"],
  ["putrajaya", "W.P. Putrajaya", "Putrajaya"]
] as const;

export const malaysianStates: readonly MalaysianState[] = stateNames.map(
  ([slug, name, shortName]) => ({
    slug,
    name,
    shortName,
    flag: withBasePath(`/assets/states/flags/${slug}.svg`),
    crest: withBasePath(`/assets/states/crests/${slug}.svg`),
    pandiScene: withBasePath(`/assets/states/pandi/${slug}.webp`)
  })
);

export const defaultPandiScene = withBasePath(
  "/assets/states/pandi/default.webp"
);

export function getState(slug: StateSlug | ""): MalaysianState | undefined {
  return malaysianStates.find((state) => state.slug === slug);
}
