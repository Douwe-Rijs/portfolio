import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

/**
 * Draggable before/after image comparison — ideal for perception work (raw
 * frame vs. detector output). The slider handle is keyboard-accessible (focus +
 * arrow keys) out of the box.
 */
interface Img {
  src: string;
  srcSet?: string;
  alt: string;
}
interface Props {
  one: Img;
  two: Img;
  labelOne?: string;
  labelTwo?: string;
}

export default function Compare({ one, two, labelOne, labelTwo }: Props) {
  return (
    <div style={{ position: 'relative' }}>
      <ReactCompareSlider
        itemOne={<ReactCompareSliderImage src={one.src} srcSet={one.srcSet} alt={one.alt} />}
        itemTwo={<ReactCompareSliderImage src={two.src} srcSet={two.srcSet} alt={two.alt} />}
        style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }}
      />
      {labelOne && <span style={{ ...pill, left: '0.75rem' }}>{labelOne}</span>}
      {labelTwo && <span style={{ ...pill, right: '0.75rem' }}>{labelTwo}</span>}
    </div>
  );
}

const pill: React.CSSProperties = {
  position: 'absolute',
  top: '0.75rem',
  padding: '0.2rem 0.6rem',
  borderRadius: '999px',
  background: 'rgba(0,0,0,0.6)',
  color: '#fff',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.7rem',
  letterSpacing: '0.05em',
  pointerEvents: 'none',
};
