"use client";

import { useState } from "react";
import Image from "next/image";
import { formatImageUrl } from "@/lib/image";

export function ImageGallery({
  images,
  title,
}: {
  images?: string[];
  title: string;
}) {
  const formattedList =
    images && images.length > 0
      ? images.map((img) => formatImageUrl(img))
      : [formatImageUrl(undefined)];

  const [activeImage, setActiveImage] = useState(formattedList[0]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 800px"
          className="object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      {formattedList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {formattedList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border transition-all ${
                activeImage === img
                  ? "border-indigo-500 ring-2 ring-indigo-500/50"
                  : "border-slate-800 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
