/**
 * A photograph in a rounded band. WebP first, JPEG fallback, with the intrinsic
 * size declared so the browser reserves the space and nothing shifts on load.
 */
export default function Photo({ webp, jpg, alt, width, height, ratio = '3 / 1', radius = 'band' }) {
  return (
    <div
      style={{
        borderRadius: `var(--yn-r-${radius})`,
        aspectRatio: ratio,
        overflow: 'hidden',
        background: 'var(--yn-grey-dark)',
      }}
    >
      <picture>
        <source srcSet={webp} type="image/webp" />
        <img
          src={jpg}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </picture>
    </div>
  )
}
