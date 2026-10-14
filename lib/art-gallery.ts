import collection from "./art-collection.json";
export type Artwork = {
  id: number;
  title: string;
  artist: string;
  date: string;
  image: string;
  width: number;
  height: number;
};
/** Small public-domain museum collection cached from the API on 14 October 2026. */
export const artCollection: Artwork[] = collection;
export const initialArt = artCollection.slice(0, 3);
export function dealArt(pool: Artwork[], previous: Artwork[] = []): Artwork[] {
  const fresh = pool.filter(
    (art) => !previous.some((old) => old.id === art.id),
  );
  const choices = [...(fresh.length >= 3 ? fresh : pool)];
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return choices.slice(0, 3);
}
