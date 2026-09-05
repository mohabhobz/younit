import { useEffect, useRef, useState } from 'react'

/**
 * A short film that plays itself.
 *
 * It is decoration, not content: no sound, no controls, no way to pause a
 * thing that carries no information the words beside it do not already carry.
 * The browser is told this three times over — muted, playsInline, and no audio
 * track in the file at all — because a phone will refuse to autoplay anything
 * that might make a noise.
 *
 * Someone who has asked their machine for less movement gets the poster frame
 * instead, as a still picture. That preference is read after the first paint,
 * never during render, so the server-rendered markup and the first client
 * render agree.
 */
export default function Clip({ mp4, webm, poster, alt, ratio = '16 / 9', radius = 'card' }) {
  const [still, setStill] = useState(false)
  const video = useRef(null)

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!query) return

    const apply = () => setStill(query.matches)
    apply()
    query.addEventListener?.('change', apply)
    return () => query.removeEventListener?.('change', apply)
  }, [])

  const frame = {
    aspectRatio: ratio,
    borderRadius: `var(--yn-r-${radius})`,
    border: '1px solid var(--yn-ink)',
    overflow: 'hidden',
    background: 'var(--yn-chrome)',
  }

  const fill = { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }

  if (still) {
    return (
      <div style={frame}>
        <img src={poster} alt={alt} loading="lazy" decoding="async" style={fill} />
      </div>
    )
  }

  return (
    <div style={frame}>
      {/* aria-label and role make the clip announce itself as a picture, which
          is what it is; without them a decorative video is silent to a screen
          reader. */}
      <video
        ref={video}
        role="img"
        aria-label={alt}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        style={fill}
      >
        <source src={webm} type="video/webm" />
        <source src={mp4} type="video/mp4" />
      </video>
    </div>
  )
}
