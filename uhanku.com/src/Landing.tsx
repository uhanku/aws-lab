import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import './Landing.css'

const SYMBOL_COUNT = 88

function Landing({ onNavigate }) {
  const stageRef = useRef(null)
  const contentRef = useRef(null)
  const symbolsWrapRef = useRef(null)
  const backgroundRef = useRef(null)
  const canvasRef = useRef(null)

  useLayoutEffect(() => {
    const stage = stageRef.current
    const content = contentRef.current
    const symbolsWrap = symbolsWrapRef.current
    const background = backgroundRef.current
    const canvas = canvasRef.current

    if (!stage || !content || !symbolsWrap || !background || !canvas) {
      return undefined
    }

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) {
      return undefined
    }

    const trailCanvas = document.createElement('canvas')
    const trailCtx = trailCanvas.getContext('2d', { alpha: true })

    if (!trailCtx) {
      return undefined
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const clamp = gsap.utils.clamp

    const config = {
      particleCount: 3900,
      speed: 0.6,
      trailFade: 0.22,
      hueStart: 188,
      hueRange: 78,
      mouseForce: 155,
      bounceForce: 12,
      fieldScale: 0.0022,
      curlStrength: 1.35,
      lineWidth: 3,
      maxDpr: 2,
    }

    const pointer = {
      x: -9999,
      y: -9999,
      px: -9999,
      py: -9999,
      active: false,
      velocity: 0,
    }

    const TWO_PI = Math.PI * 2
    const HASH_SCALE = 43758.5453123

    let width = 1
    let height = 1
    let dpr = 1
    let frame = 0
    let particles = []
    let rafId = 0
    let useTicker = true

    const symbols = gsap.utils.toArray(symbolsWrap.querySelectorAll('.symbol'))

    const fract = (value) => value - Math.floor(value)
    const smoothstep = (t) => t * t * (3 - 2 * t)

    function hash2(ix, iy, seed) {
      return fract(Math.sin(ix * 127.1 + iy * 311.7 + seed * 74.7) * HASH_SCALE)
    }

    function noise2(x, y, seed) {
      const ix = Math.floor(x)
      const iy = Math.floor(y)
      const fx = x - ix
      const fy = y - iy
      const ux = smoothstep(fx)
      const uy = smoothstep(fy)

      const a = hash2(ix, iy, seed)
      const b = hash2(ix + 1, iy, seed)
      const c = hash2(ix, iy + 1, seed)
      const d = hash2(ix + 1, iy + 1, seed)

      const x1 = a + (b - a) * ux
      const x2 = c + (d - c) * ux

      return x1 + (x2 - x1) * uy
    }

    function fbm(x, y, seed) {
      let value = 0
      let amplitude = 0.55
      let frequency = 1

      for (let octave = 0; octave < 4; octave += 1) {
        value += amplitude * noise2(x * frequency, y * frequency, seed + octave * 19.19)
        frequency *= 2.03
        amplitude *= 0.52
      }

      return value
    }

    function flowAngle(x, y, t) {
      const scale = config.fieldScale
      const nx = x * scale
      const ny = y * scale

      const a = fbm(nx + Math.sin(t * 0.00019) * 0.9, ny, 11.4)
      const b = fbm(nx * 0.72 - t * 0.00006, ny * 0.72 + t * 0.00004, 27.2)
      const c = Math.sin((x * 0.0017 + y * 0.0011) + t * 0.00042)

      return (a * 2.8 + b * 2.1 + c * 0.45) * TWO_PI * config.curlStrength
    }

    function makeParticle(index, randomizeAge) {
      const edgeBias = Math.random()
      let x
      let y

      if (edgeBias < 0.22) {
        x = Math.random() < 0.5 ? -20 : width + 20
        y = Math.random() * height
      } else if (edgeBias < 0.44) {
        x = Math.random() * width
        y = Math.random() < 0.5 ? -20 : height + 20
      } else {
        x = Math.random() * width
        y = Math.random() * height
      }

      const life = 80 + Math.random() * 190
      const hue = config.hueStart + Math.random() * config.hueRange
      const saturation = 72 + Math.random() * 22
      const lightness = 52 + Math.random() * 24

      return {
        x,
        y,
        px: x,
        py: y,
        vx: 0,
        vy: 0,
        repelX: 0,
        repelY: 0,
        repelPower: 0,
        hoverCooldown: 0,
        life,
        maxLife: life,
        age: randomizeAge ? Math.random() * life : 0,
        speed: 0.55 + Math.random() * 1.65,
        hue,
        saturation,
        lightness,
        alpha: 0.08 + Math.random() * 0.32,
        width: config.lineWidth * (0.55 + Math.random() * 1.55),
        seed: index * 17.13 + Math.random() * 101,
      }
    }

    function resetParticles() {
      particles = Array.from({ length: config.particleCount }, (_, index) => makeParticle(index, true))
    }

    function resize() {
      const rect = background.getBoundingClientRect()

      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      dpr = Math.min(config.maxDpr, window.devicePixelRatio || 1)

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      trailCanvas.width = canvas.width
      trailCanvas.height = canvas.height
      trailCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      trailCtx.clearRect(0, 0, width, height)

      resetParticles()
    }

    function setPointerVars(x, y) {
      stage.style.setProperty('--mx', `${x}px`)
      stage.style.setProperty('--my', `${y}px`)
    }

    function updatePointer(event) {
      const rect = canvas.getBoundingClientRect()

      pointer.px = pointer.x
      pointer.py = pointer.y
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.active = true

      const dx = pointer.x - pointer.px
      const dy = pointer.y - pointer.py
      pointer.velocity = Math.min(80, Math.hypot(dx, dy))

      setPointerVars(event.clientX, event.clientY)
    }

    function releasePointer() {
      pointer.active = false
      pointer.x = -9999
      pointer.y = -9999
      pointer.velocity = 0
      setPointerVars('50%', '50%')
    }

    function triggerHoverBounce(p, nx, ny, force) {
      if (p.hoverCooldown > 0) {
        return
      }

      p.hoverCooldown = 16 + Math.floor(Math.random() * 12)
      p.repelX = nx * force
      p.repelY = ny * force

      gsap.killTweensOf(p, 'repelPower')
      gsap.fromTo(
        p,
        { repelPower: 1 },
        {
          repelPower: 0,
          duration: 0.72,
          ease: 'elastic.out(1.15, 0.42)',
          overwrite: true,
        }
      )
    }

    function drawParticle(p, t) {
      p.px = p.x
      p.py = p.y

      const angle = flowAngle(p.x + p.seed, p.y - p.seed, t)
      const flowX = Math.cos(angle)
      const flowY = Math.sin(angle)

      p.vx += flowX * 0.34 * config.speed * p.speed
      p.vy += flowY * 0.34 * config.speed * p.speed

      if (pointer.active) {
        const dx = p.x - pointer.x
        const dy = p.y - pointer.y
        const distanceSq = dx * dx + dy * dy
        const radius = config.mouseForce + pointer.velocity * 1.65
        const radiusSq = radius * radius

        if (distanceSq < radiusSq && distanceSq > 0.001) {
          const distance = Math.sqrt(distanceSq)
          const nx = dx / distance
          const ny = dy / distance
          const forceRatio = 1 - distance / radius

          const softRepulsion = forceRatio * forceRatio * (1.15 + pointer.velocity * 0.018)
          p.vx += nx * softRepulsion
          p.vy += ny * softRepulsion

          if (forceRatio > 0.42) {
            const bounce = config.bounceForce * (0.65 + forceRatio) * (1 + pointer.velocity * 0.012)
            triggerHoverBounce(p, nx, ny, bounce)
          }
        }
      }

      if (p.repelPower > 0.001) {
        p.vx += p.repelX * p.repelPower
        p.vy += p.repelY * p.repelPower
      }

      if (p.hoverCooldown > 0) {
        p.hoverCooldown -= 1
      }

      if (p.repelPower > 0) {
        p.repelPower *= 0.88
      }

      const drag = 0.865
      p.vx *= drag
      p.vy *= drag

      const velocityLimit = 4.5 * config.speed * p.speed + config.bounceForce * 0.9
      const velocity = Math.hypot(p.vx, p.vy)

      if (velocity > velocityLimit) {
        p.vx = (p.vx / velocity) * velocityLimit
        p.vy = (p.vy / velocity) * velocityLimit
      }

      p.x += p.vx
      p.y += p.vy
      p.age += 1

      const outside = p.x < -80 || p.x > width + 80 || p.y < -80 || p.y > height + 80

      if (outside || p.age > p.maxLife) {
        Object.assign(p, makeParticle(p.seed, false))
        return
      }

      const lifeRatio = p.age / p.maxLife
      const fadeIn = clamp(0, 1, lifeRatio * 6)
      const fadeOut = clamp(0, 1, (1 - lifeRatio) * 3.5)
      const hoverGlow = clamp(0, 1, p.repelPower)
      const alpha = p.alpha * fadeIn * fadeOut * (1 + hoverGlow * 1.7)
      const lineWidth = p.width * (1 + hoverGlow * 1.9)

      trailCtx.beginPath()
      trailCtx.moveTo(p.px, p.py)
      trailCtx.lineTo(p.x, p.y)
      trailCtx.lineWidth = lineWidth
      trailCtx.lineCap = 'round'
      trailCtx.strokeStyle =
        `hsla(${p.hue.toFixed(1)}, ${p.saturation.toFixed(1)}%, ${(p.lightness + hoverGlow * 15).toFixed(1)}%, ${alpha.toFixed(3)})`
      trailCtx.stroke()
    }

    function render() {
      const reducedMotion = prefersReducedMotion.matches
      const time = useTicker ? gsap.ticker.time * 1000 : performance.now()

      frame += 1

      trailCtx.globalCompositeOperation = 'source-over'
      trailCtx.fillStyle = `rgba(2, 6, 23, ${config.trailFade})`
      trailCtx.fillRect(0, 0, width, height)

      trailCtx.globalCompositeOperation = 'lighter'

      const step = reducedMotion ? 3 : 1
      for (let i = frame % step; i < particles.length; i += step) {
        drawParticle(particles[i], time)
      }

      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(trailCanvas, 0, 0, width, height)

      if (pointer.active) {
        const glowRadius = config.mouseForce * 1.45 + pointer.velocity
        const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, glowRadius)

        glow.addColorStop(0, 'rgba(125, 211, 252, 0.17)')
        glow.addColorStop(0.42, 'rgba(34, 197, 94, 0.06)')
        glow.addColorStop(1, 'rgba(34, 197, 94, 0)')

        ctx.globalCompositeOperation = 'screen'
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(pointer.x, pointer.y, glowRadius, 0, TWO_PI)
        ctx.fill()
        ctx.globalCompositeOperation = 'source-over'
      }

      pointer.velocity *= 0.92
    }

    function rafRender() {
      render()
      rafId = requestAnimationFrame(rafRender)
    }

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

      updatePointer(event)

      gsap.to(symbolsWrap, {
        x: -nx * 70,
        y: -ny * 55,
        rotate: -14 + nx * 2,
        duration: 1.1,
        ease: 'power3.out',
        overwrite: true,
      })

      gsap.to(symbols, {
        x: () => nx * gsap.utils.random(-22, 22),
        y: () => ny * gsap.utils.random(-18, 18),
        duration: 1,
        ease: 'power3.out',
        stagger: { amount: 0.25, from: 'center' },
        overwrite: true,
      })
    }

    const handlePointerLeave = () => {
      releasePointer()

      gsap.to(symbolsWrap, {
        x: 0,
        y: 0,
        rotate: -14,
        duration: 1.2,
        ease: 'power3.out',
        overwrite: true,
      })
    }

    const handleResize = () => {
      resize()
      render()
    }

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true })
    window.addEventListener('blur', handlePointerLeave)

    setPointerVars('50%', '50%')
    resize()

    if (useTicker) {
      gsap.ticker.fps(60)
      gsap.ticker.add(render)
    } else {
      rafId = requestAnimationFrame(rafRender)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('blur', handlePointerLeave)
      floatingTween.kill()
      gsap.killTweensOf([content, symbolsWrap, ...symbols, ...particles])

      if (useTicker) {
        gsap.ticker.remove(render)
      } else {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])

  const handleWordmarkClick = (event) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return
    }

    event.preventDefault()
    onNavigate('/me')
  }

  return (
    <main ref={stageRef} className="landing-stage">
      <div ref={backgroundRef} className="magic-flow-bg" aria-hidden="true">
        <canvas ref={canvasRef} className="magic-flow-canvas" />
      </div>
      <div ref={symbolsWrapRef} className="symbols" aria-hidden="true">
        {Array.from({ length: SYMBOL_COUNT }, (_, index) => (
          <span key={index} className="symbol" />
        ))}
      </div>
      <div className="grain" aria-hidden="true" />

      <section ref={contentRef} className="content" aria-label="Interactive uhanku wordmark">
        <h1 className="name">
          <a className="name-link" href="/me" onClick={handleWordmarkClick}>
            uhanku
          </a>
        </h1>
      </section>
    </main>
  )
}

export default Landing
