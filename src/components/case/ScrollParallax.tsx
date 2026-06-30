import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Subtle scroll-linked parallax for a hero/feature image — the image drifts and
 * is slightly over-scaled so it moves within an overflow-clipped frame as the
 * page scrolls. Under `prefers-reduced-motion` it renders perfectly still.
 */
interface Props {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  className?: string;
  /** Parallax travel as a % of image height (kept inside the 20% over-scale). */
  strength?: number;
  eager?: boolean;
}

export default function ScrollParallax({
  src,
  srcSet,
  sizes,
  alt,
  className = '',
  strength = 8,
  eager = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  const common = {
    src,
    srcSet,
    sizes,
    loading: eager ? ('eager' as const) : ('lazy' as const),
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {reduce ? (
        <img
          {...common}
          alt={alt}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <motion.img
          {...common}
          alt={alt}
          style={{
            y,
            scale: 1.2,
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transformOrigin: 'center',
            willChange: 'transform',
          }}
        />
      )}
    </div>
  );
}
