"use client";
import Image from "next/image";
import { useState } from "react";
export function ProfileAvatar({ large = false }: { large?: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-(--border) bg-(--surface) font-mono text-(--accent) ${large ? "size-24 text-2xl ring-4 ring-(--border)" : "size-10 text-xs"}`}
    >
      {failed ? (
        <span aria-label="KS avatar">KS</span>
      ) : (
        <Image
          src="/images/profile-avatar.png"
          width={large ? 96 : 40}
          height={large ? 96 : 40}
          alt="Khuram’s selected illustrated avatar"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
