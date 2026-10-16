"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  src: string;
  alt: string;
  href?: string;
  label?: string;
}

const SLIDE_DURATION_MS = 6000;

export function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setTimeout(
      () => setIndex((i) => (i + 1) % slides.length),
      SLIDE_DURATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [index, slides.length]);

  const current = slides[index];

  return (
    <>
      <div className="absolute inset-0 overflow-hidden bg-ink">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1400ms] ease-out",
              i === index ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              preload={i === 0}
              className="object-cover"
              style={
                i === index
                  ? { animation: `hero-zoom ${SLIDE_DURATION_MS + 1400}ms ease-out forwards` }
                  : undefined
              }
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
      </div>

      {slides.length > 1 && (
        <div className="absolute right-0 bottom-0 left-0 z-10">
          <div className="container-site flex items-end justify-between gap-6 pb-28 md:pb-10">
            <div className="flex gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  aria-label={`${i + 1}번째 사진 보기`}
                  onClick={() => setIndex(i)}
                  className="relative h-0.5 w-10 overflow-hidden bg-white/30 md:w-14"
                >
                  {i === index && (
                    <span
                      key={index}
                      className="absolute inset-0 origin-left bg-white"
                      style={{ animation: `hero-progress ${SLIDE_DURATION_MS}ms linear forwards` }}
                    />
                  )}
                  {i < index && <span className="absolute inset-0 bg-white/70" />}
                </button>
              ))}
            </div>
            {current?.href && current.label && (
              <Link
                href={current.href}
                className="hidden text-sm text-white/80 transition-colors hover:text-white md:block"
              >
                {String(index + 1).padStart(2, "0")} — {current.label}
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
