import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Lightweight 360° panorama strip viewer for equirectangular images (e.g. shot
 * inside a pipe). Drag / arrow keys pan horizontally with seamless wrap-around;
 * when idle it drifts slowly so viewers notice it is explorable. No WebGL —
 * two tiled copies of the image keep the island tiny and the page fast.
 * Auto-drift is disabled under `prefers-reduced-motion`; dragging still works
 * (user-initiated motion is fine).
 */
interface Props {
  src: string;
  alt: string;
  /** Viewport height, e.g. "60vh". */
  height?: string;
  /** Auto-drift speed in px/s (0 disables). */
  driftSpeed?: number;
}

export default function Pano360({ src, alt, height = '60vh', driftSpeed = 12 }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const imgWidth = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const interactedAt = useRef(0);
  const [loaded, setLoaded] = useState(false);

  const apply = useCallback(() => {
    const w = imgWidth.current;
    if (!w || !stripRef.current) return;
    // Wrap into [-w, 0) so the two tiled copies always cover the viewport.
    offset.current = ((offset.current % w) + w) % w;
    stripRef.current.style.transform = `translateX(${-offset.current}px)`;
    // Reflect heading in slider semantics without re-rendering every frame.
    viewportRef.current?.setAttribute(
      'aria-valuenow',
      String(Math.round((offset.current / w) * 360)),
    );
  }, []);

  // Measure the rendered image width (scaled to viewport height).
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const vp = viewportRef.current;
      if (!vp) return;
      const scale = vp.clientHeight / img.naturalHeight;
      imgWidth.current = img.naturalWidth * scale;
      setLoaded(true);
      apply();
    };
    img.src = src;
  }, [src, apply]);

  // Idle auto-drift (rAF), paused for 4s after any interaction.
  useEffect(() => {
    if (!loaded || driftSpeed <= 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = (now - prev) / 1000;
      prev = now;
      if (!dragging.current && now - interactedAt.current > 4000) {
        offset.current += driftSpeed * dt;
        apply();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loaded, driftSpeed, apply]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    interactedAt.current = performance.now();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    offset.current -= e.clientX - lastX.current;
    lastX.current = e.clientX;
    interactedAt.current = performance.now();
    apply();
  };
  const endDrag = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = 60;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      offset.current += e.key === 'ArrowRight' ? step : -step;
      interactedAt.current = performance.now();
      apply();
    }
  };

  return (
    <div
      ref={viewportRef}
      role="slider"
      aria-roledescription="360-degree panorama viewer"
      aria-label={`${alt} — drag or use arrow keys to look around`}
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={0}
      aria-valuetext="viewing direction in degrees"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      style={{
        position: 'relative',
        height,
        overflow: 'hidden',
        cursor: 'grab',
        touchAction: 'pan-y',
        userSelect: 'none',
        background: '#000',
      }}
    >
      <div
        ref={stripRef}
        style={{ position: 'absolute', inset: 0, display: 'flex', willChange: 'transform' }}
      >
        {/* Two copies give a seamless wrap as the strip translates. */}
        <img src={src} alt="" draggable={false} style={imgStyle} />
        <img src={src} alt="" aria-hidden="true" draggable={false} style={imgStyle} />
      </div>
      <span
        style={{
          position: 'absolute',
          bottom: '0.75rem',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '0.25rem 0.75rem',
          borderRadius: '999px',
          background: 'rgba(0,0,0,0.55)',
          color: 'rgba(255,255,255,0.85)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          letterSpacing: '0.08em',
          pointerEvents: 'none',
        }}
      >
        ⟲ 360° — drag to look around
      </span>
    </div>
  );
}

const imgStyle: React.CSSProperties = {
  height: '100%',
  width: 'auto',
  maxWidth: 'none',
  flex: 'none',
  pointerEvents: 'none',
};
