import { useEffect } from 'react'

/**
 * The homepage motion system, ported from the Claude Design source.
 *
 * Everything is driven by data attributes on the markup, so a section opts in
 * by carrying one — no component needs to know the animation exists:
 *
 *   data-type    a line that types itself in, in document order
 *   data-cta     lands after the last typed line finishes
 *   data-unit    an arch unit; its CSS keyframe delay does the work
 *   data-rule    a hairline that draws from the leading edge
 *   data-reveal  a group whose children rise, staggered, when it enters
 *   data-count   a number that counts up to its printed value
 *   data-draw    an SVG whose strokes draw themselves
 *   data-rise    bars that grow from their base
 *   data-cell    progress cells that fill in sequence
 *   data-seq     children that appear one after another
 *
 * Cleanup restores every element it touched, so React's double-invoked effects
 * in development do not leave half-typed text or stuck opacity behind.
 */
export default function useMotion(mode = 'full') {
  useEffect(() => {
    const reduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const units = [...document.querySelectorAll('[data-unit]')]

    if (mode === 'off' || reduced) {
      units.forEach((u) => {
        u.style.animation = 'none'
      })
      return () => {
        units.forEach((u) => {
          u.style.animation = ''
        })
      }
    }

    const ease = 'cubic-bezier(.2,.75,.3,1)'
    const dur = mode === 'subtle' ? 380 : 620
    const timers = []
    const frames = []
    const restore = []
    const wait = (fn, ms) => timers.push(setTimeout(fn, ms))

    /* --- hero: the copy types, then the buttons land --------------------- */

    const speeds = mode === 'subtle' ? [8, 18, 5] : [14, 32, 9]
    const lines = [...document.querySelectorAll('[data-type]')].map((el) => {
      const text = el.textContent
      const minHeight = el.style.minHeight
      el.style.minHeight = `${el.getBoundingClientRect().height}px`
      el.textContent = ''
      restore.push(() => {
        el.textContent = text
        el.style.minHeight = minHeight
      })
      return { el, text }
    })

    const cta = document.querySelector('[data-cta]')
    if (cta) {
      cta.style.opacity = '0'
      cta.style.transform = 'translateY(14px)'
      cta.style.transition = `opacity 520ms ${ease}, transform 520ms ${ease}`
      restore.push(() => {
        cta.style.opacity = ''
        cta.style.transform = ''
        cta.style.transition = ''
      })
    }

    const typeLine = (i) => {
      if (i >= lines.length) {
        // Release the reserved heights. Keeping them would freeze the hero at
        // whatever it measured before the webfont swapped in, and leave a
        // phantom gap for the rest of the page's life once the window widens.
        lines.forEach(({ el }) => {
          el.style.minHeight = ''
        })
        if (cta) {
          cta.style.opacity = '1'
          cta.style.transform = 'translateY(0)'
        }
        return
      }
      const { el, text } = lines[i]
      const step = speeds[i] || 12
      let n = 0
      const tick = () => {
        el.textContent = text.slice(0, ++n)
        if (n < text.length) wait(tick, step)
        else wait(() => typeLine(i + 1), 180)
      }
      tick()
    }
    wait(() => typeLine(0), mode === 'subtle' ? 900 : 1400)

    /* --- hairlines draw from the leading edge ---------------------------- */

    const rules = [...document.querySelectorAll('[data-rule]')]
    rules.forEach((r) => {
      r.style.clipPath = 'inset(0 100% 0 0)'
      r.style.transition = `clip-path ${dur + 200}ms ${ease}`
      restore.push(() => {
        r.style.clipPath = ''
        r.style.transition = ''
      })
    })

    /* --- groups rise once, children staggered ---------------------------- */

    const groups = [...document.querySelectorAll('[data-reveal]')]
    const kidsOf = new Map()
    groups.forEach((g) => {
      const kids = g.children.length > 1 ? [...g.children] : [g]
      kids.forEach((k) => {
        k.style.opacity = '0'
        k.style.transform = `translateY(${mode === 'subtle' ? 10 : 18}px)`
        k.style.transition = `opacity ${dur}ms ${ease}, transform ${dur}ms ${ease}`
        restore.push(() => {
          k.style.opacity = ''
          k.style.transform = ''
          k.style.transition = ''
          k.style.transitionDelay = ''
        })
      })
      kidsOf.set(g, kids)
    })

    /* --- progress cells fill in sequence --------------------------------- */

    const cells = [...document.querySelectorAll('[data-cell]')]
    const cellFill = cells.map((c) => c.style.background)
    cells.forEach((c) => {
      c.style.background = 'var(--yn-white)'
      c.style.transition = 'background 260ms steps(1, end)'
    })
    restore.push(() =>
      cells.forEach((c, i) => {
        c.style.background = cellFill[i]
        c.style.transition = ''
      }),
    )

    /* --- counters -------------------------------------------------------- */

    const easeOut = (t) => 1 - Math.pow(1 - t, 3)
    const counters = [...document.querySelectorAll('[data-count]')]
      .map((el) => {
        const m = el.textContent.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/)
        if (!m) return null
        const printed = el.textContent
        const intLen = m[2].split('.')[0].length
        const dec = (m[2].split('.')[1] || '').length
        el.textContent =
          m[1] + '0'.padStart(intLen, '0') + (dec ? `.${'0'.repeat(dec)}` : '') + m[3]
        restore.push(() => {
          el.textContent = printed
        })
        return { el, pre: m[1], target: parseFloat(m[2]), post: m[3], intLen, dec }
      })
      .filter(Boolean)

    const runCounter = (c) => {
      const span = mode === 'subtle' ? 620 : 1000
      const t0 = performance.now()
      const step = (now) => {
        const p = Math.min(1, (now - t0) / span)
        const v = c.target * easeOut(p)
        const s = c.dec ? v.toFixed(c.dec) : String(Math.round(v))
        const [i, d] = s.split('.')
        c.el.textContent = c.pre + i.padStart(c.intLen, '0') + (d ? `.${d}` : '') + c.post
        if (p < 1) frames.push(requestAnimationFrame(step))
      }
      frames.push(requestAnimationFrame(step))
    }

    /* --- strokes, risers, sequences -------------------------------------- */

    const strokes = [
      ...document.querySelectorAll(
        '[data-draw] path, [data-draw] rect, [data-seq] svg path, [data-seq] svg rect',
      ),
    ]
    strokes.forEach((p) => {
      const len = p.getTotalLength ? p.getTotalLength() : 80
      p.style.strokeDasharray = len
      p.style.strokeDashoffset = len
      p.style.transition = `stroke-dashoffset 700ms ${ease}`
      restore.push(() => {
        p.style.strokeDasharray = ''
        p.style.strokeDashoffset = ''
        p.style.transition = ''
      })
    })

    const risers = [...document.querySelectorAll('[data-rise] rect')]
    risers.forEach((r) => {
      r.style.transformOrigin = 'center bottom'
      r.style.transform = 'scaleY(0)'
      r.style.transition = `transform 480ms ${ease}`
      restore.push(() => {
        r.style.transform = ''
        r.style.transition = ''
      })
    })

    const seqs = [...document.querySelectorAll('[data-seq]')]
    seqs.forEach((s) =>
      [...s.children].forEach((k) => {
        k.style.opacity = '0'
        k.style.transform = 'translateY(8px)'
        k.style.transition = `opacity 340ms ${ease}, transform 340ms ${ease}`
        restore.push(() => {
          k.style.opacity = ''
          k.style.transform = ''
          k.style.transition = ''
        })
      }),
    )

    const beats = (el) => {
      counters.forEach((c) => {
        if (el.contains(c.el)) runCounter(c)
      })
      strokes.forEach((p, i) => {
        if (el.contains(p)) wait(() => (p.style.strokeDashoffset = '0'), 220 + (i % 6) * 90)
      })
      risers.forEach((r, i) => {
        if (el.contains(r)) wait(() => (r.style.transform = 'scaleY(1)'), 260 + i * 130)
      })
      seqs.forEach((s) => {
        if (!el.contains(s)) return
        ;[...s.children].forEach((k, i) =>
          wait(
            () => {
              k.style.opacity = '1'
              k.style.transform = 'translateY(0)'
            },
            300 + i * (mode === 'subtle' ? 110 : 240),
          ),
        )
      })
    }

    const cellHost = cells.length ? cells[0].closest('[data-reveal]') : null

    const play = (el) => {
      if (el.hasAttribute('data-rule')) {
        el.style.clipPath = 'inset(0 0 0 0)'
        return
      }
      const kids = kidsOf.get(el) || [el]
      kids.forEach((k, i) => {
        k.style.transitionDelay = `${(mode === 'subtle' ? 40 : 70) * (i % 3)}ms`
        k.style.opacity = '1'
        k.style.transform = 'translateY(0)'
      })
      if (el === cellHost) {
        cells.forEach((c, i) => wait(() => (c.style.background = 'var(--yn-amber)'), 260 + i * 130))
      }
      beats(el)
    }

    /* --- entry ----------------------------------------------------------- */

    const pending = new Set([...rules, ...groups])
    const fire = (el) => {
      if (!pending.has(el)) return
      pending.delete(el)
      play(el)
      io.unobserve(el)
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && fire(e.target)),
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    )
    pending.forEach((el) => io.observe(el))

    // Safety net: anything already at or above the fold plays even if the
    // observer never samples it.
    const sweep = () => {
      const limit = window.innerHeight * 0.94
      ;[...pending].forEach((el) => {
        if (el.getBoundingClientRect().top < limit) fire(el)
      })
      if (!pending.size) window.removeEventListener('scroll', onScroll)
    }
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        sweep()
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    wait(sweep, 60)

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      timers.forEach(clearTimeout)
      frames.forEach(cancelAnimationFrame)
      if (raf) cancelAnimationFrame(raf)
      restore.forEach((fn) => fn())
    }
  }, [mode])
}
