import { useCallback, useEffect, useRef, useState } from 'react';

interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * Tiny click-to-zoom island for the `gallery` vibe. It enhances the static
 * gallery rendered by Gallery.astro: on mount it finds the sibling images
 * (marked `data-zoom-index`) inside the same `[data-gallery]` block and opens a
 * full-screen overlay on click. Keyboard accessible; loads only `client:visible`.
 */
export default function Lightbox({ images }: { images: LightboxImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  );
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length],
  );

  // Wire the static gallery thumbnails to the overlay.
  useEffect(() => {
    const gallery = rootRef.current?.closest('[data-gallery]');
    if (!gallery) return;
    const thumbs = Array.from(gallery.querySelectorAll<HTMLElement>('[data-zoom-index]'));
    const handlers = thumbs.map((el) => {
      const i = Number(el.dataset.zoomIndex);
      const handler = () => setIndex(i);
      el.style.cursor = 'zoom-in';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.addEventListener('click', handler);
      el.addEventListener('keydown', (e) => {
        if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
          e.preventDefault();
          handler();
        }
      });
      return { el, handler };
    });
    return () => handlers.forEach(({ el, handler }) => el.removeEventListener('click', handler));
  }, []);

  // Keyboard controls while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, next, prev]);

  return (
    <div ref={rootRef}>
      {open && index !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 80,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.92)',
            padding: '2rem 1rem',
          }}
        >
          {/* Backdrop is a real button so click-to-close stays keyboard-accessible. */}
          <button
            onClick={close}
            aria-label="Close image viewer"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'transparent',
              border: 'none',
              cursor: 'zoom-out',
            }}
          />
          <button onClick={close} aria-label="Close" style={closeBtn}>
            ✕
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                style={{ ...navBtn, left: '1rem' }}
              >
                ‹
              </button>
              <button onClick={next} aria-label="Next image" style={{ ...navBtn, right: '1rem' }}>
                ›
              </button>
            </>
          )}
          <img
            src={images[index].src}
            alt={images[index].alt}
            style={{
              position: 'relative',
              maxHeight: '85vh',
              maxWidth: '92vw',
              objectFit: 'contain',
            }}
          />
          {images[index].caption && (
            <p
              style={{
                position: 'relative',
                marginTop: '0.75rem',
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
              }}
            >
              {images[index].caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const closeBtn: React.CSSProperties = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  color: '#fff',
  background: 'transparent',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  lineHeight: 1,
};
const navBtn: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#fff',
  background: 'rgba(255,255,255,0.08)',
  border: 'none',
  fontSize: '2rem',
  width: '2.75rem',
  height: '2.75rem',
  borderRadius: '999px',
  cursor: 'pointer',
  lineHeight: 1,
};
