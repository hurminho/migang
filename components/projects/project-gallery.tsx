"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  onClose: () => void;
}

export function ImageLightbox({
  images,
  initialIndex = 0,
  onClose,
}: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight")
        setIndex((i) => Math.min(images.length - 1, i + 1));
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [images.length, onClose]);

  const current = images[index];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute right-4 top-4 text-white"
      >
        <X size={28} />
      </button>

      {index > 0 && (
        <button
          type="button"
          aria-label="이전"
          onClick={(e) => {
            e.stopPropagation();
            setIndex(index - 1);
          }}
          className="absolute left-4 text-white"
        >
          <ChevronLeft size={36} />
        </button>
      )}

      <div
        className="relative max-h-[85vh] w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={current.src}
            alt={current.alt ?? ""}
            fill
            className="object-contain"
            sizes="100vw"
          />
        </div>
        {current.caption && (
          <p className="mt-4 text-center text-sm text-white/80">
            {current.caption}
          </p>
        )}
      </div>

      {index < images.length - 1 && (
        <button
          type="button"
          aria-label="다음"
          onClick={(e) => {
            e.stopPropagation();
            setIndex(index + 1);
          }}
          className="absolute right-4 text-white"
        >
          <ChevronRight size={36} />
        </button>
      )}
    </div>
  );
}

interface GalleryProps {
  images: LightboxImage[];
}

export function ProjectGallery({ images }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images.length) return null;

  return (
    <>
      <div className="grid w-full min-w-0 grid-cols-1 gap-2.5">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className="group relative aspect-[4/3] w-full min-w-0 overflow-hidden bg-[#f5f5f5] text-left"
          >
            <Image
              src={img.src}
              alt={img.alt ?? ""}
              fill
              sizes="(max-width: 1023px) calc(100vw - 2rem), calc((100vw - 220px) / 2)"
              className="object-cover transition group-hover:opacity-90"
            />
            {img.caption && (
              <span className="absolute bottom-0 left-0 right-0 bg-black/40 px-3 py-2 text-xs text-white opacity-0 transition group-hover:opacity-100">
                {img.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
