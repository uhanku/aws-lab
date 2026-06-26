import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import './Landing.css'

const SYMBOL_COUNT = 88

function Landing() {
  const stageRef = useRef(null)
  const contentRef = useRef(null)
  const symbolsWrapRef = useRef(null)

  useLayoutEffect(() => {
    const content = contentRef.current
    const symbolsWrap = symbolsWrapRef.current

    if (!content || !symbolsWrap) {
      return undefined
    }

    const symbols = gsap.utils.toArray(symbolsWrap.querySelectorAll('.symbol'))

    gsap.set(symbols, {
      scale: () => gsap.utils.random(0.45, 1.35),
      rotation: () => gsap.utils.random(-35, 35),
      opacity: () => gsap.utils.random(0.35, 0.9),
    })

    const floatingTween = gsap.to(symbols, {
      y: 'random(-18, 18)',
      x: 'random(-14, 14)',
      rotation: '+=random(-10, 10)',
      duration: 'random(4, 7)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: { amount: 2.5, from: 'random' },
    })

    const handlePointerMove = (event) => {
      const { clientX: x, clientY: y } = event
      const nx = (x / window.innerWidth - 0.5) * 2
      const ny = (y / window.innerHeight - 0.5) * 2

      document.documentElement.style.setProperty('--mx', `${x}px`)
      document.documentElement.style.setProperty('--my', `${y}px`)

      gsap.to(content, {
        rotateY: nx * 12,
        rotateX: -ny * 10,
        x: nx * 16,
        y: ny * 12,
        duration: 0.7,
        ease: 'power3.out',
      })

      gsap.to(symbolsWrap, {
        x: -nx * 70,
        y: -ny * 55,
        rotate: -14 + nx * 2,
        duration: 1.1,
        ease: 'power3.out',
      })

      gsap.to(symbols, {
        x: () => nx * gsap.utils.random(-22, 22),
        y: () => ny * gsap.utils.random(-18, 18),
        duration: 1,
        ease: 'power3.out',
        stagger: { amount: 0.25, from: 'center' },
      })
    }

    const handlePointerLeave = () => {
      gsap.to(content, {
        rotateX: 0,
        rotateY: 0,
        x: 0,
        y: 0,
        duration: 1.1,
        ease: 'elastic.out(1, 0.45)',
      })

      gsap.to(symbolsWrap, {
        x: 0,
        y: 0,
        rotate: -14,
        duration: 1.2,
        ease: 'power3.out',
      })
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      floatingTween.kill()
      gsap.killTweensOf([content, symbolsWrap, ...symbols])
    }
  }, [])

  return (
    <main ref={stageRef} className="landing-stage">
      <div ref={symbolsWrapRef} className="symbols" aria-hidden="true">
        {Array.from({ length: SYMBOL_COUNT }, (_, index) => (
          <span key={index} className="symbol" />
        ))}
      </div>
      <div className="grain" aria-hidden="true" />

      <section ref={contentRef} className="content" aria-label="Interactive uhanku wordmark">
        <h1 className="name">uhanku</h1>
      </section>
    </main>
  )
}

export default Landing
