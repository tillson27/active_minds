import logoSrc from '../assets/logo-cropped.png'
import brainSrc from '../assets/brain.png'

export default function Logo({ height = 44, className = '', markOnly = false, alt }) {
  const src = markOnly ? brainSrc : logoSrc
  return (
    <img
      src={src}
      alt={alt ?? 'ACTive Minds Therapy & Consulting'}
      className={`${markOnly ? 'brand-mark' : 'brand-logo'} ${className}`.trim()}
      style={{ height, width: 'auto', display: 'block', flexShrink: 0 }}
      loading="eager"
      decoding="async"
    />
  )
}
