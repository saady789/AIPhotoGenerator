"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export interface Output {
  id: string;
  imageUrl: string;
  modelId: string;
  userId: string;
  prompt: string;
  falAiRequestId: string;
  status: "Pending" | "Generated" | "Failed";
  createdAt: string;
  updatedAt: string;
}

export function Gallary({
  output,
  loading,
}: {
  output: Output[];
  loading: boolean;
}) {
  const { user } = useUser();

  const items = useMemo(
    () =>
      [...output].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [output]
  );

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  // natural image size for perfect fit
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);

  const open = (idx: number) => {
    setOpenIndex(idx);
    setNatural(null);
  };
  const close = () => {
    setOpenIndex(null);
    setNatural(null);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4">
        <Header title="Your Gallery" subtitle="" count={0} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-2xl bg-neutral-200/70 dark:bg-neutral-800/60 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Header title="Your Gallery" subtitle="nothing here yet" count={0} />
        <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 p-10">
          <p className="text-neutral-500">generate an image to see it here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4">
      <Header title="Your Gallery" subtitle="" count={items.length} />

      {/* grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, idx) => (
          <figure
            key={item.id}
            className="relative overflow-hidden rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 shadow-sm hover:shadow-lg transition-all"
          >
            <button
              onClick={() => open(idx)}
              className="block w-full h-full focus:outline-none cursor-pointer"
              aria-label="open image"
            >
              <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-900">
                <Image
                  src={item.imageUrl ?? ""}
                  alt={item.prompt || "image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority={idx < 3}
                />
              </div>
            </button>
          </figure>
        ))}
      </div>

      {/* focus view: centered, fits viewport, no crop, no bars, no UI */}
      <Dialog open={isOpen} onOpenChange={(o) => (!o ? close() : null)}>
        {isOpen && openIndex !== null ? (
          <DialogContent className="m-0 p-0 border-0 w-screen h-screen max-w-none rounded-none bg-black/90">
            <button
              aria-label="close"
              onClick={close}
              className="absolute inset-0 z-10 cursor-pointer"
              tabIndex={-1}
            />

            <div className="absolute inset-0 z-20 flex items-center justify-center">
              {(() => {
                const src = items[openIndex]?.imageUrl ?? "";

                // compute display size only when natural size is known
                let displayW = 0;
                let displayH = 0;
                if (natural) {
                  const vw = Math.min(
                    window.innerWidth * 0.95,
                    window.innerWidth
                  );
                  const vh = Math.min(
                    window.innerHeight * 0.95,
                    window.innerHeight
                  );
                  const scale = Math.min(vw / natural.w, vh / natural.h);
                  displayW = Math.floor(natural.w * scale);
                  displayH = Math.floor(natural.h * scale);
                }

                return (
                  <div className="relative">
                    {natural ? (
                      <Image
                        src={src}
                        alt={items[openIndex]?.prompt || "image"}
                        width={displayW}
                        height={displayH}
                        className="select-none rounded-md shadow-2xl"
                        draggable={false}
                        priority
                        onClick={close}
                      />
                    ) : (
                      // first render uses fill to read natural size, then we switch
                      <div className="relative w-[60vw] max-w-[1200px] aspect-[4/3]">
                        <Image
                          src={src}
                          alt={items[openIndex]?.prompt || "image"}
                          fill
                          sizes="100vw"
                          className="object-contain opacity-0"
                          priority
                          draggable={false}
                          onLoadingComplete={(img) => {
                            setNatural({
                              w: img.naturalWidth,
                              h: img.naturalHeight,
                            });
                          }}
                        />
                        <div className="absolute inset-0 grid place-items-center">
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
}

function Header({
  title,
  subtitle,
  count,
}: {
  title: string;
  subtitle?: string;
  count: number;
}) {
  return (
    <div className="mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-neutral-500">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
        <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 px-3 py-1">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          {count} total
        </span>
      </div>
    </div>
  );
}
