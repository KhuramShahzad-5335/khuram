"use client";
import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, RotateCcw, Shuffle } from "lucide-react";
import {
  initialArt,
  dealArt,
  artCollection,
  type Artwork,
} from "@/lib/art-gallery";

function ArtCard({ art, index }: { art: Artwork; index: number }) {
  const [flipped, setFlipped] = useState(false),
    [failed, setFailed] = useState(false);
  return (
    <article className={`art-card art-card-${index}`}>
      <div className="art-card-tape" aria-hidden="true" />
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] text-(--muted)">
        <span>COLLECTION / 0{index + 1}</span>
        <span className="flex items-center gap-1">
          <RotateCcw size={11} aria-hidden="true" />
          flip me
        </span>
      </div>
      <button
        type="button"
        className="art-flip relative block aspect-[4/3] w-full rounded-lg"
        aria-label={`${flipped ? "Show artwork" : "Flip art card"}: ${art.title}`}
        aria-pressed={flipped}
        onClick={() => setFlipped(!flipped)}
      >
        <span
          className={`art-face art-front ${flipped ? "art-front-flipped" : ""}`}
          aria-hidden={flipped}
        >
          {failed ? (
            <span className="flex h-full items-center justify-center p-6 text-sm text-(--muted)">
              Image taking a break. The museum link is below.
            </span>
          ) : (
            <Image
              src={art.image}
              width={art.width}
              height={art.height}
              sizes="(max-width: 700px) 90vw, 30vw"
              loading="lazy"
              unoptimized
              alt={art.title}
              onError={() => setFailed(true)}
              className="h-full w-full object-contain"
            />
          )}
        </span>
        <span
          className={`art-face art-back ${flipped ? "art-back-visible" : ""}`}
          aria-hidden={!flipped}
        >
          <span className="font-mono text-[10px]">A LITTLE CONTEXT</span>
          <strong className="mt-2 block text-base">{art.artist}</strong>
          <span className="mt-2 block text-xs">{art.date}</span>
          <span className="mt-3 block font-mono text-[8px]">
            ART INSTITUTE OF CHICAGO
            <br />
            PUBLIC-DOMAIN SELECTION
          </span>
        </span>
      </button>
      <div className="mt-4 min-h-24">
        <h3 className="text-base font-medium leading-6">{art.title}</h3>
        <p className="mt-2 text-xs text-(--muted)">{art.artist}</p>
      </div>
      <a
        href={`https://www.artic.edu/artworks/${art.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-link mt-3 inline-flex text-xs"
        aria-label={`View ${art.title} at the museum`}
      >
        Meet the artwork <ArrowUpRight size={13} aria-hidden="true" />
      </a>
    </article>
  );
}
export function ArtGallery({ home = false }: { home?: boolean }) {
  const [art, setArt] = useState(initialArt);
  const [message, setMessage] = useState(
    "Three little windows into someone else’s imagination.",
  );
  const id = useId();
  useEffect(() => setArt(dealArt(artCollection)), []);
  function shuffle() {
    setArt((previous) => dealArt(artCollection, previous));
    setMessage("A fresh deal. Flip a card, find a favorite.");
  }
  return (
    <section
      className={
        home
          ? "section art-gallery"
          : "art-gallery my-16 rounded-2xl border border-(--border) p-5 sm:p-8"
      }
      aria-labelledby={id}
      id={home ? "art-desk" : undefined}
    >
      <div
        className="mb-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end"
        data-reveal
      >
        <div>
          <span className="eyebrow">A LITTLE VISUAL DETOUR</span>
          <h2 id={id} className="mt-3">
            The inspiration desk<span className="accent">.</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-(--muted)">
            A tiny art break. Deal a new set, flip a card, follow your
            curiosity.
          </p>
        </div>
        <button
          type="button"
          onClick={shuffle}
          className="button primary disabled:opacity-50"
        >
          <Shuffle size={15} aria-hidden="true" />
          Deal me three
        </button>
      </div>
      <div className="art-desk grid grid-cols-1 gap-8 px-2 py-6 md:grid-cols-3 md:gap-6">
        {art.map((item, index) => (
          <ArtCard key={item.id} art={item} index={index} />
        ))}
      </div>
      <p role="status" className="mt-7 min-h-6 text-xs text-(--muted)">
        {message}
      </p>
      <p className="mt-2 text-[10px] leading-6 text-(--muted)">
        Artwork and collection data:{" "}
        <a
          className="underline"
          href="https://www.artic.edu/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Art Institute of Chicago
        </a>
        . Public-domain selections; original artwork colors preserved.
      </p>
      <noscript>
        <p className="mt-3 text-xs text-(--muted)">
          The saved collection remains available. Shuffling and card flips need
          JavaScript.
        </p>
      </noscript>
    </section>
  );
}
