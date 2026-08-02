import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';

interface PropertyHeroImageProps {
  images?: string[];
  image?: string;           // legacy single-image compat
  propertyName?: string;
}

// ── Lightbox ────────────────────────────────────────────────────────────────
const Lightbox: React.FC<{
  images: string[];
  startIndex: number;
  onClose: () => void;
}> = ({ images, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, prev, next]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close gallery"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 font-space-mono text-sm text-white/70 tabular-nums">
        {current + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); prev(); }}
          className="absolute left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Image */}
      <div className="max-w-5xl max-h-[85vh] w-full px-16" onClick={e => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt={`Photo ${current + 1}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className="w-full h-full object-contain rounded-xl"
            style={{ maxHeight: '85vh' }}
          />
        </AnimatePresence>
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); next(); }}
          className="absolute right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Next photo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setCurrent(i); }}
              className={`w-12 h-8 rounded-md overflow-hidden transition-all ${
                i === current ? 'ring-2 ring-[#D4755B] opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ── Adaptive gallery ─────────────────────────────────────────────────────────
const PropertyHeroImage: React.FC<PropertyHeroImageProps> = ({ images = [], image, propertyName }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Normalize to array, de-dupe
  const allImages = [...new Set([
    ...(images.length > 0 ? images : []),
    ...(image && !images.includes(image) ? [image] : []),
  ])].filter(Boolean);

  const fallback = "https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?w=1200";
  const imgs = allImages.length > 0 ? allImages : [fallback];

  const open = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);

  // ── 1 image ───────────────────────────────────────────────────────────────
  if (imgs.length === 1) {
    return (
      <>
        <div className="relative w-full h-[65vh] min-h-[420px] overflow-hidden bg-[#1C1B1A] cursor-pointer" onClick={() => open(0)}>
          <img
            src={imgs[0]}
            alt={propertyName || 'Property'}
            className="w-full h-full object-cover opacity-90"
            style={{ outline: '1px solid rgba(0,0,0,0.08)', outlineOffset: '-1px' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
        <AnimatePresence>
          {lightboxIndex !== null && <Lightbox images={imgs} startIndex={lightboxIndex} onClose={close} />}
        </AnimatePresence>
      </>
    );
  }

  // ── 2+ images: Mobile layout vs Desktop grid ───────────────────────────
  const gridImgs = imgs.slice(0, 5);
  return (
    <>
      {/* Mobile Gallery Layout (< sm) */}
      <div className="sm:hidden relative bg-[#1C1B1A]">
        <div className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer" onClick={() => open(0)}>
          <img
            src={imgs[0]}
            alt={propertyName || 'Property'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <button
            onClick={(e) => { e.stopPropagation(); open(0); }}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white font-manrope font-semibold text-xs px-3 py-1.5 rounded-lg border border-white/20 shadow-sm"
          >
            <Images className="w-3.5 h-3.5" />
            1 / {imgs.length}
          </button>
        </div>
        {imgs.length > 1 && (
          <div className="flex gap-2 p-2 overflow-x-auto no-scrollbar bg-[#11100F]">
            {imgs.map((img, i) => (
              <button
                key={i}
                onClick={() => open(i)}
                className="relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden border border-white/10"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Gallery Layout (>= sm) */}
      <div className="hidden sm:block relative h-[60vh] min-h-[380px] bg-[#1C1B1A] overflow-hidden">
        <div className="grid grid-cols-4 grid-rows-2 gap-1 h-full">
          {/* Hero — spans 2 cols × 2 rows */}
          <div
            className="col-span-2 row-span-2 relative overflow-hidden cursor-pointer group"
            onClick={() => open(0)}
          >
            <img
              src={gridImgs[0]}
              alt={propertyName || 'Property'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              style={{ outline: '1px solid rgba(0,0,0,0.08)', outlineOffset: '-1px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* 4 thumbnails */}
          {gridImgs.slice(1, 5).map((img, i) => (
            <div
              key={i}
              className="relative overflow-hidden cursor-pointer group"
              onClick={() => open(i + 1)}
            >
              <img
                src={img}
                alt={`Photo ${i + 2}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                style={{ outline: '1px solid rgba(0,0,0,0.07)', outlineOffset: '-1px' }}
              />
              {/* "View all" overlay on last thumbnail */}
              {i === 3 && imgs.length > 5 && (
                <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1">
                  <Images className="w-5 h-5 text-white" />
                  <span className="font-manrope font-semibold text-white text-sm">
                    +{imgs.length - 5} more
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* "Show all photos" button */}
        <button
          onClick={() => open(0)}
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white text-[#221410] font-manrope font-semibold text-sm px-4 py-2 rounded-xl shadow-md transition-all active:scale-[0.96]"
        >
          <Images className="w-4 h-4" />
          Show all {imgs.length} photos
        </button>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && <Lightbox images={imgs} startIndex={lightboxIndex} onClose={close} />}
      </AnimatePresence>
    </>
  );
};

export default PropertyHeroImage;
