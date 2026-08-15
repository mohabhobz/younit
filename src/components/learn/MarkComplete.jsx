import { useEffect, useState } from 'react'
import { Button } from '../ui/Button.jsx'

/**
 * Session progress, carried over from the original site: a per-slug flag in
 * localStorage, nothing sent anywhere. Renders nothing until mounted so the
 * markup never flashes the wrong state.
 */
const storageKey = (slug) => `younit:complete:${slug}`

export default function MarkComplete({ slug }) {
  const [done, setDone] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      setDone(Boolean(window.localStorage.getItem(storageKey(slug))))
    } catch {
      // Storage can be unavailable (private mode, blocked cookies). The button
      // still works for this session; it just will not persist.
    }
  }, [slug])

  function toggle() {
    const next = !done
    setDone(next)
    try {
      if (next) window.localStorage.setItem(storageKey(slug), '1')
      else window.localStorage.removeItem(storageKey(slug))
    } catch {
      /* see above */
    }
  }

  if (!mounted) return null

  return (
    <Button
      tone={done ? 'amber' : 'white'}
      onClick={toggle}
      aria-pressed={done}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 14,
          height: 14,
          borderRadius: 'var(--yn-r-pill)',
          border: '1px solid currentColor',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 9,
          lineHeight: 1,
        }}
      >
        {done ? '✓' : ''}
      </span>
      {done ? 'Completed' : 'Mark complete'}
    </Button>
  )
}
