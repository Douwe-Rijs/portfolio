import { useEffect, useRef, useState } from 'react';
import NumberFlow from '@number-flow/react';
import { useInView, useReducedMotion } from 'framer-motion';

/**
 * A metric value that counts up from zero once it scrolls into view — the
 * Stripe/Linear "live data" feel. Built on NumberFlow (smooth digit transitions)
 * and Framer Motion's `useInView`. Under `prefers-reduced-motion` it renders the
 * final value immediately with no animation.
 */
interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Decimal places to preserve (NumberFlow Intl format). */
  decimals?: number;
}

export default function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (inView) setDisplay(value);
  }, [inView, value]);

  return (
    <span ref={ref}>
      <NumberFlow
        value={display}
        prefix={prefix}
        suffix={suffix}
        format={{ minimumFractionDigits: decimals, maximumFractionDigits: decimals }}
        respectMotionPreference
      />
    </span>
  );
}
