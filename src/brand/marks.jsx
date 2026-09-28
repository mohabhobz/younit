import { useI18n } from '../lib/i18n.jsx'
import { LOCKUP_BOX, LOCKUP_PATH, LOCKUP_TRANSFORM } from './lockup.js'

/**
 * Brand marks, transcribed verbatim from the Claude Design source.
 *
 * The wordmark, the dot, the arch unit and the schematic step glyph are all
 * defined once as SVG <symbol>s and referenced with <use>, exactly as the
 * template does it — one definition, many sizes, no duplicated path data.
 *
 * Mount <BrandDefs /> once near the root; everything else references it.
 */

/**
 * The wordmark, traced from the client's own artwork — `Younit_Logo_EFG.png`
 * in the revised branding deck of 20 August. The letterforms are custom: a
 * blocked "younit" whose o carries the square counter the icon is cut from.
 *
 * One path rather than a stack of rectangles, because it is one drawing. It
 * takes its colour from the fill it is given, so the light and the dark cut
 * are the same mark.
 */
const WORDMARK = <path d="M 0,192 l 0,192 l 154.666666667,0 l 154.666666667,0 l 0,18.6666666667 l 0,18.6666666667 l -154.666666667,0 l -154.666666667,0 l 0,84 l 0,84.1333333333 l 166.4,-0.4 l 166.266666667,-0.4 l 13.3333333333,-3.73333333333 c 16,-4.4 39.3333333333,-15.6 51.4666666667,-24.8 c 10.9333333333,-8.4 25.7333333333,-23.8666666667 33.2,-34.8 c 8.13333333333,-12 16.9333333333,-31.2 21.0666666667,-46.2666666667 l 3.6,-13.0666666667 l 0.4,-233.066666667 l 0.266666666667,-232.933333333 l -84.6666666666,0 l -84.6666666666,0 l 0,105.2 c 0,65.8666666667 -0.533333333333,107.733333333 -1.33333333333,112.266666667 c -3.46666666667,18.4 -16.2666666667,35.0666666667 -32.9333333333,42.8 c -16.1333333333,7.6 -37.8666666667,6.53333333333 -53.2,-2.4 c -8.4,-4.93333333333 -18.8,-16.8 -23.6,-26.8 l -4.26666666667,-9.06666666666 l -0.4,-111.066666667 l -0.266666666667,-110.933333333 l -85.3333333333,0 l -85.3333333333,0 l 0,192 z M 2046.66666667,75.3333333333 l 0,75.3333333333 l 82.6666666666,0 l 82.6666666666,0 l 0,-75.3333333333 l 0,-75.3333333333 l -82.6666666666,0 l -82.6666666666,0 l 0,75.3333333333 z M 2305.33333333,82.6666666666 l 0,82.6666666666 l -180.666666667,0 l -180.666666667,0 l 0,39.3333333333 l 0,39.3333333333 l 47.3333333333,0 l 47.3333333333,0 l 0,134 l 0,134 l -47.3333333333,0 l -47.3333333333,0 l 0,38.6666666667 l 0,38.6666666667 l 185.333333333,0 l 185.333333333,0 l 0,-38.6666666667 l 0,-38.6666666667 l -47.3333333333,0 l -47.3333333333,0 l 0,-134 l 0,-134 l 42.6666666667,0 l 42.5333333333,0 l 0.533333333333,100.266666667 l 0.4,100.4 l 3.46666666667,14 c 16.8,67.8666666666 60.4,112.266666667 125.066666667,127.466666667 c 8.93333333333,2.13333333333 19.7333333333,2.4 95.7333333333,2.8 l 85.6,0.533333333333 l 0,-59.3333333333 l 0,-59.2 l -36.2666666667,-0.533333333333 c -32.8,-0.533333333333 -37.3333333333,-0.933333333333 -45.2,-3.46666666667 c -18.1333333333,-6 -31.2,-17.4666666667 -39.3333333333,-34.2666666667 c -8.26666666666,-17.2 -8.53333333333,-19.3333333333 -8.53333333333,-108.4 l 0,-80.2666666666 l 64.6666666667,0 l 64.6666666667,0 l 0,-39.3333333333 l 0,-39.3333333333 l -64.6666666667,0 l -64.6666666667,0 l 0,-82.6666666666 l 0,-82.6666666666 l -90.6666666666,0 l -90.6666666666,0 l 0,82.6666666666 z M 686.666666666,154.8 c -49.4666666667,6.4 -97.3333333333,29.0666666667 -132.666666667,62.8 c -40.1333333333,38.2666666667 -62.6666666667,83.4666666666 -68.5333333333,137.333333333 c -9.33333333333,84 31.4666666667,166 105.2,211.866666667 c 70.5333333333,43.7333333333 162.133333333,47.2 237.333333333,9.06666666666 c 23.8666666667,-12.2666666667 40.1333333333,-24 58.6666666667,-42.5333333333 c 54.2666666667,-54.2666666667 76.1333333333,-128.666666667 59.8666666667,-203.866666667 c -18,-82.9333333333 -85.8666666666,-149.733333333 -172.8,-170.133333333 c -23.2,-5.46666666667 -63.6,-7.6 -87.0666666666,-4.53333333333 z m 98.4,222.8 l 0.266666666667,59.7333333333 l -67.3333333333,0 l -67.3333333333,0 l 0,-59.0666666667 c 0,-32.5333333333 0.4,-59.6 0.933333333333,-60 c 0.4,-0.533333333333 30.6666666667,-0.8 66.9333333333,-0.666666666667 l 66.1333333333,0.4 l 0.4,59.6 z M 978.666666666,305.866666667 c 0,119.333333333 0.266666666667,142.266666667 2,152.266666667 c 11.3333333333,66.1333333333 63.0666666667,117.866666667 129.2,129.2 c 10.1333333333,1.73333333333 34.6666666667,2 168.266666667,2 l 156.533333333,0 l 0,-212 l 0,-212 l -84,0 l -83.8666666666,0 l -0.4,119.6 l -0.4,119.733333333 l -3.2,8.53333333333 c -6,16.1333333333 -20,30.4 -36.1333333333,36.8 c -9.06666666666,3.46666666667 -25.7333333333,4.13333333333 -35.3333333333,1.33333333333 c -11.3333333333,-3.2 -17.4666666667,-6.66666666666 -25.7333333333,-14.4 c -8.4,-8.13333333333 -12.9333333333,-15.3333333333 -16.4,-26.4 c -2.4,-7.73333333333 -2.53333333333,-14.2666666667 -2.53333333333,-126.666666667 l 0,-118.533333333 l -84,0 l -84,0 l 0,140.533333333 z M 1461.33333333,377.333333333 l 0,212 l 84,0 l 84,0 l 0,-117.066666667 c 0,-99.4666666666 0.266666666666,-118.133333333 2,-124.666666667 c 6.13333333333,-23.7333333333 24.4,-40.6666666667 48.4,-44.9333333333 c 30.6666666667,-5.46666666667 61.4666666667,16.1333333333 68.1333333333,47.7333333333 c 1.06666666667,4.8 1.46666666667,43.4666666667 1.46666666667,122.933333333 l 0,116 l 84,0 l 84,0 l 0,-212 l 0,-212 l -228,0 l -228,0 l 0,212 z" />

/** The natural size of the mark, for the viewBox and the aspect ratio. */
const WORDMARK_BOX = { w: 2616.0, h: 602.21 }

/** One arch unit in flat isometric, 146 x 176. `fill` is the front face. */
function archUnit(fill) {
  return (
    <>
      <polygon points="0,26 26,0 146,0 120,26" fill="var(--yn-ink)" />
      <polygon points="120,26 146,0 146,150 120,176" fill="var(--yn-ink)" />
      <rect x="0" y="26" width="120" height="150" fill={fill} stroke="var(--yn-ink)" strokeWidth="3" />
      <path d="M37 176 V101 a23 23 0 0 1 46 0 V176 Z" fill="var(--yn-grey)" stroke="var(--yn-ink)" strokeWidth="3" />
    </>
  )
}

export function BrandDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="wm" viewBox={`0 0 ${WORDMARK_BOX.w} ${WORDMARK_BOX.h}`}>
          <g fill="var(--yn-ink)">{WORDMARK}</g>
        </symbol>
        <symbol id="wm-w" viewBox={`0 0 ${WORDMARK_BOX.w} ${WORDMARK_BOX.h}`}>
          <g fill="var(--yn-white)">{WORDMARK}</g>
        </symbol>
        <symbol id="dot" viewBox="0 0 467.65 448.82">
          <path d="M 202.517407757,1.40852882211 c -49.4666666667,6.4 -97.3333333333,29.0666666667 -132.666666667,62.8 c -40.1333333333,38.2666666667 -62.6666666667,83.4666666666 -68.5333333333,137.333333333 c -9.33333333333,84 31.4666666667,166 105.2,211.866666667 c 70.5333333333,43.7333333333 162.133333333,47.2 237.333333333,9.06666666666 c 23.8666666667,-12.2666666667 40.1333333333,-24 58.6666666667,-42.5333333333 c 54.2666666667,-54.2666666667 76.1333333333,-128.666666667 59.8666666667,-203.866666667 c -18,-82.9333333333 -85.8666666666,-149.733333333 -172.8,-170.133333333 c -23.2,-5.46666666667 -63.6,-7.6 -87.0666666666,-4.53333333333 z m 98.4,222.8 l 0.266666666667,59.7333333333 l -67.3333333333,0 l -67.3333333333,0 l 0,-59.0666666667 c 0,-32.5333333333 0.4,-59.6 0.933333333333,-60 c 0.4,-0.533333333333 30.6666666667,-0.8 66.9333333333,-0.666666666667 l 66.1333333333,0.4 l 0.4,59.6 z" fill="currentColor" />
        </symbol>
        <symbol id="archunit" viewBox="0 0 146 176">
          {archUnit('var(--yn-blue)')}
        </symbol>
        <symbol id="archunit-p" viewBox="0 0 146 176">
          {archUnit('var(--yn-purple)')}
        </symbol>
        {/* The arches in the header's own colour. It reads the chrome token
            rather than the blue, so if the band moves again — and it has, from
            blue to purple and back — the artwork moves with it instead of
            being found a week later still wearing last month's colour. */}
        <symbol id="archunit-c" viewBox="0 0 146 176">
          {archUnit('var(--yn-chrome)')}
        </symbol>
      </defs>
    </svg>
  )
}

/** The wordmark. `tone="light"` is the reversed cut, for ink and blue grounds. */
/**
 * The Arabic wordmark, from `Younit_Arabic Logo.png` in the same deck. Built
 * on the Latin's skeleton rather than transliterated from it, which is why it
 * is its own drawing and not a mirrored copy.
 */
const WORDMARK_AR = <path d="M 830.183333333,0.933333333333 l -97.0666666666,0.4 l 0,140.666666667 l 0,140.533333333 l 159.066666667,-0.8 c 87.3333333333,-0.4 159.066666667,-0.933333333333 159.333333333,-1.06666666667 c 0.266666666667,-0.266666666667 0,-63.4666666667 -0.533333333333,-140.533333333 l -0.933333333333,-140.133333333 l -61.4666666667,0.266666666667 c -33.8666666667,0.266666666667 -105.066666667,0.533333333333 -158.4,0.666666666667 z M 2268.98333333,1.33333333333 c -0.533333333333,2.53333333333 0.533333333333,276 1.06666666667,278.266666667 l 0.666666666667,3.06666666667 l 116.266666667,0 c 64,0 135.466666667,-0.4 158.8,-0.933333333333 l 42.4,-0.8 l -0.8,-139.333333333 c -0.533333333333,-76.6666666666 -1.06666666667,-139.466666667 -1.33333333333,-139.733333333 c -0.666666666667,-0.533333333333 -316.933333333,-1.2 -317.066666667,-0.533333333333 z M 379.783333333,142.266666667 l 0,140.8 l 71.0666666666,-0.8 c 38.9333333333,-0.533333333333 110.4,-0.933333333333 158.666666667,-0.933333333333 l 87.6,0 l 0,-119.733333333 c 0,-66 -0.4,-128.933333333 -0.933333333333,-140 l -0.8,-20.2666666667 l -157.866666667,0 l -157.733333333,0 l 0,140.933333333 z M 1534.85,12.9333333333 l -46.9333333333,0.4 l 0.666666666667,399.066666667 c 0.266666666667,219.333333333 0.933333333333,464 1.33333333333,543.466666667 l 0.8,144.533333333 l 124.933333333,-0.8 c 68.6666666666,-0.533333333333 145.066666667,-0.933333333333 169.866666667,-0.933333333333 l 44.9333333333,0 l -0.266666666667,-543.066666667 l -0.4,-542.933333333 l -124,0 c -68.1333333333,0 -145.066666667,0.133333333333 -170.933333333,0.266666666666 z M 0.45,312.266666667 c -0.4,0.933333333333 -0.533333333333,178.4 -0.4,394.4 l 0.4,392.666666667 l 716.4,0.4 l 716.266666666,0.266666666666 l 0,-394.666666667 l 0,-394.666666667 l -157.066666667,0 l -157.2,0 l -0.8,54.9333333333 c -0.533333333333,30.2666666667 -0.933333333333,85.0666666666 -1.06666666667,121.733333333 c 0,36.6666666667 -0.533333333333,88.8 -1.2,116 c -0.933333333333,47.2 -1.2,49.8666666667 -4.53333333333,62.6666666667 c -15.0666666667,57.2 -62.6666666667,99.7333333333 -130.133333333,116.4 c -13.7333333333,3.33333333333 -14.9333333333,3.33333333333 -72,3.86666666667 c -31.8666666667,0.266666666667 -149.466666667,-0.4 -261.333333333,-1.46666666667 c -217.733333333,-2 -208.266666667,-1.73333333333 -228.533333333,-8.66666666666 c -49.6,-17.3333333333 -89.8666666666,-66.8 -103.6,-127.466666667 l -3.06666666667,-13.3333333333 l -0.4,-162.4 l -0.533333333333,-162.266666667 l -155.333333333,0 c -122.933333333,0 -155.466666667,0.4 -155.866666667,1.6 z M 1887.38333333,704.266666666 c -0.4,216.4 -0.533333333333,394 -0.133333333333,394.666666667 c 0.8,1.33333333333 707.333333333,1.46666666667 924.266666666,0.133333333333 l 152.266666667,-0.8 l 0,-393.866666667 l 0,-393.733333333 l -157.333333333,0 l -157.333333333,0 l 0,26.9333333333 c 0,14.9333333333 -0.933333333333,93.6 -2,175.066666667 c -1.86666666667,141.733333333 -2,148.4 -4.66666666667,158.666666667 c -10.8,42 -52.6666666667,86 -98,103.066666667 c -13.6,5.2 -36,8.53333333333 -72.6666666666,10.8 c -40.8,2.66666666667 -102.266666667,1.2 -132,-3.2 c -68,-9.86666666666 -124.133333333,-65.6 -135.333333333,-134.533333333 c -1.73333333333,-10 -2.13333333333,-40.6666666667 -2.93333333333,-174.533333333 l -0.8,-162.266666667 l -156.266666667,0 l -156.266666667,0 l -0.8,393.6 z M 3021.11666667,548.266666667 c 0,130.8 0.4,308.4 0.933333333333,394.666666667 l 0.8,157.066666667 l 224.4,0 l 224.266666667,0 l 1.6,4.26666666667 c 0.933333333333,2.4 2,12.9333333333 2.26666666667,23.2 c 0.533333333333,14.8 0.266666666667,21.2 -1.46666666667,29.0666666667 l -2.26666666667,10.1333333333 l -217.066666667,0 c -119.333333333,0 -221.6,0.4 -227.333333333,0.8 l -10.1333333333,0.933333333333 l 0.266666666666,158.133333333 l 0.4,158.133333333 l 202.666666667,-0.533333333333 c 246.4,-0.533333333333 295.2,-1.33333333333 316.266666667,-5.33333333333 c 104.533333333,-19.6 185.066666667,-96.5333333333 211.733333333,-202.133333333 c 7.6,-29.7333333333 8.8,-44.9333333333 9.86666666666,-114.666666667 l 0.8,-62.6666666667 l 370.666666667,0 l 370.666666667,0 l 0.400000000001,-394.4 l 0.266666666666,-394.266666667 l -61.6,0 c -34,0 -104.533333333,0.4 -156.666666667,0.933333333333 l -95.0666666666,0.8 l 0,102.933333333 c 0,56.5333333333 -0.400000000001,163.333333333 -0.933333333333,237.066666667 l -0.8,134.266666667 l -213.866666667,0 l -213.733333333,0 l 0,-73.7333333333 c 0,-40.6666666667 -0.4,-147.733333333 -0.933333333333,-238 l -0.8,-164.266666667 l -367.866666667,0 l -367.733333333,0 l 0,237.6 z m 484,139.066666667 l 0,120.666666667 l -120.933333333,0 l -120.8,0 l 0.8,-44.2666666667 c 0.533333333333,-24.2666666667 0.933333333333,-78.5333333333 0.933333333333,-120.666666667 l 0,-76.4 l 120,0 l 120,0 l 0,120.666666667 z M 1491.78333333,1261.33333333 l 0,94.6666666666 l -48.2666666667,0.266666666667 l -48.4,0.4 l -0.4,54.6666666667 c -0.266666666667,30.1333333333 0,58.4 0.4,62.9333333333 l 0.933333333333,8.4 l 217.866666667,0 l 217.866666667,0 l 0,-63.3333333333 l 0,-63.3333333333 l -20.9333333333,-0.133333333333 c -11.6,-0.133333333333 -35.2,-0.533333333333 -52.4,-1.06666666667 l -31.2,-0.8 l -1.6,-5.33333333333 c -4.93333333333,-16.1333333333 0.4,-48.8 8.4,-52 c 1.33333333333,-0.533333333333 23.7333333333,-2 49.7333333333,-3.33333333333 c 26,-1.33333333333 47.4666666667,-2.53333333333 47.7333333333,-2.53333333333 c 0.133333333333,-0.133333333333 0.266666666667,-28 0.266666666667,-62.1333333333 l 0,-62 l -170,0 l -170,0 l 0,94.6666666666 z M 3827.78333333,1308.66666667 l 0,142 l 159.333333333,0 l 159.333333333,0 l 0,-142 l 0,-142 l -159.333333333,0 l -159.333333333,0 l 0,142 z M 4198.85,1167.6 l -9.73333333333,0.533333333333 l 0,141.2 l 0,141.333333333 l 158.4,-0.266666666666 l 158.266666667,-0.4 l 0.400000000001,-40 c 0.266666666666,-22 0,-85.7333333333 -0.533333333334,-141.733333333 l -0.799999999999,-101.6 l -148.266666667,0.266666666666 c -81.4666666666,0.133333333333 -152.533333333,0.533333333333 -157.733333333,0.666666666667 z" />

const WORDMARK_AR_BOX = { w: 4506.29, h: 1484.67 }

export function Wordmark({ width = 116, tone = 'dark', style }) {
  const { locale } = useI18n()

  // Arabic has its own wordmark, from the brand PDF. It is the same mark, not a
  // transliteration, so the header carries it wherever the page is Arabic.
  if (locale === 'ar') {
    return (
      <svg
        viewBox={`0 0 ${WORDMARK_AR_BOX.w} ${WORDMARK_AR_BOX.h}`}
        role="img"
        aria-label="يون إت"
        fill={tone === 'light' ? 'var(--yn-white)' : 'var(--yn-ink)'}
        style={{
          width,
          height: (width / WORDMARK_AR_BOX.w) * WORDMARK_AR_BOX.h,
          display: 'block',
          ...style,
        }}
      >
        {WORDMARK_AR}
      </svg>
    )
  }

  return (
    <svg
      viewBox={`0 0 ${WORDMARK_BOX.w} ${WORDMARK_BOX.h}`}
      role="img"
      aria-label="younit"
      style={{
        width,
        height: (width / WORDMARK_BOX.w) * WORDMARK_BOX.h,
        display: 'block',
        ...style,
      }}
    >
      <use href={tone === 'light' ? '#wm-w' : '#wm'} />
    </svg>
  )
}

/**
 * The wordmark with its endorsement, as the brand file draws it.
 *
 * Arabic keeps its own wordmark: there is no Arabic cut of the endorsed
 * lockup in the artwork we were given, so the page sets the Arabic mark and
 * leaves the endorsement to the English side rather than inventing one.
 */
export function Lockup({ width = 168, tone = 'dark', style }) {
  const { locale } = useI18n()

  if (locale === 'ar') {
    return <Wordmark width={Math.round(width * 0.7)} tone={tone} style={style} />
  }

  return (
    <svg
      viewBox={`0 0 ${LOCKUP_BOX.w} ${LOCKUP_BOX.h}`}
      role="img"
      aria-label="younit — powered by EFG Hermes"
      style={{
        width,
        height: (width / LOCKUP_BOX.w) * LOCKUP_BOX.h,
        display: 'block',
        ...style,
      }}
    >
      <g
        transform={LOCKUP_TRANSFORM}
        fill={tone === 'light' ? 'var(--yn-white)' : 'var(--yn-ink)'}
      >
        <path d={LOCKUP_PATH} />
      </g>
    </svg>
  )
}

/** Icon A — the o alone. */
export function Dot({ size = 24, style, ...rest }) {
  return (
    <svg viewBox="0 0 467.65 448.82" style={{ width: size, height: size, ...style }} {...rest}>
      <use href="#dot" />
    </svg>
  )
}

/** The mark at text size, as the separator inside the tagline. */
export function Bullet() {
  return (
    <svg
      viewBox="0 0 467.65 448.82"
      aria-hidden="true"
      style={{ width: 9, height: 9, verticalAlign: 'baseline' }}
    >
      <use href="#dot" />
    </svg>
  )
}

/**
 * A schematic mark: the rising step line, or the three bars.
 *
 * These are drawn inline rather than referenced with <use>, because the motion
 * system animates their stroke — and a <use> instance lives in a shadow tree
 * that `querySelectorAll` cannot reach, which silently made the draw a no-op.
 */
export function Glyph({ kind = 'step', width = 52, height = 38, ...rest }) {
  return (
    <svg viewBox="0 0 48 36" style={{ width, height }} aria-hidden="true" {...rest}>
      {kind === 'bar' ? (
        <g fill="none" stroke="var(--yn-ink)" strokeWidth="2">
          <rect x="10" y="20" width="7" height="12" />
          <rect x="21" y="12" width="7" height="20" />
          <rect x="32" y="6" width="7" height="26" />
        </g>
      ) : (
        <>
          <path
            d="M2 32 L10 32 L10 24 L18 24 L18 27 L26 27 L26 14 L34 14 L34 8 L42 8"
            fill="none"
            stroke="var(--yn-ink)"
            strokeWidth="2"
          />
          <path d="M36 4 L44 4 L44 12" fill="none" stroke="var(--yn-ink)" strokeWidth="2" />
        </>
      )}
    </svg>
  )
}

/**
 * The 5-3-2 pyramid. Coordinates are the template's: units are 146 x 176 on a
 * 120 x 150 lattice inside a 626 x 476 frame, so the extrusions interlock.
 * Painted top row first, so each lower row covers the row behind it.
 */
const UNITS = [
  { x: 180, y: 0, delay: 0.62 },
  { x: 300, y: 0, delay: 0.69 },
  { x: 120, y: 150, delay: 0.4 },
  { x: 240, y: 150, delay: 0.47 },
  { x: 360, y: 150, delay: 0.54 },
  { x: 0, y: 300, delay: 0.06 },
  { x: 120, y: 300, delay: 0.13 },
  { x: 240, y: 300, delay: 0.2 },
  { x: 360, y: 300, delay: 0.27 },
  { x: 480, y: 300, delay: 0.34 },
]

/**
 * The block forms.
 *
 * Marketing asked for the composition from the branding deck — "the block
 * forms are designed to be rearranged in multiple compositions" — in place of
 * the arch pyramid the homepage was carrying, and for it to move.
 *
 * It is the deck's own arrangement: two cubes, four, six, and the same again
 * below, so the shape reads twice and is symmetrical about its middle. The
 * cubes are drawn rather than traced, because they are a lattice and not a
 * picture: a face, a lid and a cheek, seamed in the page's own background so
 * the blocks read as separate solids the way the deck draws them.
 *
 * Rows are painted top-first, so every row covers the one behind it.
 */
const CUBE = { face: 120, depth: 20, step: 110 }

/**
 * Two compositions, one set of cubes.
 *
 * The deck is explicit that the block forms "are designed to be rearranged in
 * multiple compositions", so when Build and Learn both needed the black
 * artwork and marketing did not want to meet the same picture twice, the
 * answer was a second arrangement rather than a second drawing. Same lattice,
 * same cube, same frame — so the two pages still read as one brand, and
 * neither hero shifts when a reader moves between them.
 *
 * `stack` is the deck's own arrangement: two cubes, four, six, and the same
 * again below, so the shape reads twice and is symmetrical about its middle.
 * It stays on Build, where a stack of parts is the point.
 *
 * `steps` is Learn's: three treads, each two cubes deep, climbing left to
 * right. The left silhouette is a staircase and so is the top, which is what
 * learning looks like — you arrive at the top of one tread and the next one
 * is there. Twenty-four cubes either way, so the two carry the same weight.
 *
 * Every row is a list of columns, painted top row first so each row covers
 * the one behind it and the extrusions interlock.
 */
const LAYOUTS = {
  stack: [
    [2, 3],
    [1, 2, 3, 4],
    [0, 1, 2, 3, 4, 5],
    [2, 3],
    [1, 2, 3, 4],
    [0, 1, 2, 3, 4, 5],
  ],
  steps: [
    [4, 5],
    [4, 5],
    [2, 3, 4, 5],
    [2, 3, 4, 5],
    [0, 1, 2, 3, 4, 5],
    [0, 1, 2, 3, 4, 5],
  ],
}

const blocksFor = (rows) =>
  rows.flatMap((columns, row) =>
    columns.map((column, i) => ({
      x: column * CUBE.face,
      y: row * CUBE.step,
      // Each row lands after the one above it, and each cube a beat after its
      // neighbour, so the shape builds from the top down rather than appearing.
      delay: 0.06 * row + 0.035 * i,
    })),
  )

const BLOCKS = Object.fromEntries(
  Object.entries(LAYOUTS).map(([name, rows]) => [name, blocksFor(rows)]),
)

function Cube({ x, y }) {
  const { face: w, depth: e } = CUBE
  const seam = { stroke: 'var(--yn-white)', strokeWidth: 3, strokeLinejoin: 'round' }

  return (
    <g transform={`translate(${x} ${y + e})`} fill="var(--yn-ink)" {...seam}>
      <polygon points={`0,0 ${e},${-e} ${w + e},${-e} ${w},0`} />
      <polygon points={`${w},0 ${w + e},${-e} ${w + e},${w - e} ${w},${w}`} />
      <rect x="0" y="0" width={w} height={w} />
    </g>
  )
}

export function BlockForms({ layout = 'stack', animate = true, style }) {
  const { t } = useI18n()
  // The frame is the six-by-six lattice, not the arrangement inside it, so
  // every composition draws at the same size and in the same place.
  const width = 6 * CUBE.face + CUBE.depth
  const height = 5 * CUBE.step + CUBE.face + CUBE.depth
  const blocks = BLOCKS[layout] ?? BLOCKS.stack

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={t('common.artwork')}
      style={{ width: '100%', height: 'auto', display: 'block', ...style }}
    >
      {blocks.map((b) => (
        <g
          key={`${b.x}-${b.y}`}
          data-unit={animate ? '' : undefined}
          style={
            animate
              ? {
                  // The drop, then the float that does not stop — the same
                  // pair the arches ride.
                  animation: [
                    `younit-unit-in 0.62s var(--yn-ease) ${b.delay}s both`,
                    `younit-unit-float 4.2s ease-in-out ${(b.delay + 0.62).toFixed(2)}s infinite`,
                  ].join(', '),
                }
              : undefined
          }
        >
          <Cube x={b.x} y={b.y} />
        </g>
      ))}
    </svg>
  )
}

export function ArchPyramid({ tone = 'blue', animate = true, style }) {
  const { t } = useI18n()
  const href =
    tone === 'purple' ? '#archunit-p' : tone === 'chrome' ? '#archunit-c' : '#archunit'

  return (
    <svg
      viewBox="0 0 626 476"
      role="img"
      aria-label={t('common.artwork')}
      style={{ width: '100%', height: 'auto', display: 'block', ...style }}
    >
      <g>
        {UNITS.map((u) => (
          <use
            key={`${u.x}-${u.y}`}
            data-unit={animate ? '' : undefined}
            href={href}
            x={u.x}
            y={u.y}
            width="146"
            height="176"
            style={
              animate
                ? {
                    // Two animations, one after the other: the drop, then the
                    // float that does not stop. The float starts where the
                    // drop finished, so there is no jump between them.
                    animation: [
                      `younit-unit-in 0.62s var(--yn-ease) ${u.delay}s both`,
                      `younit-unit-float 4.2s ease-in-out ${(u.delay + 0.62).toFixed(2)}s infinite`,
                    ].join(', '),
                  }
                : undefined
            }
          />
        ))}
      </g>
    </svg>
  )
}
