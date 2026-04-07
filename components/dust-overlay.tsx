'use client'

import { useEffect, useRef } from 'react'
import { OVERLAY_VARIANT, type OverlayVariant } from '@/config/overlay'
import { drawScratch } from '@/components/overlays/draw-scratch'
import { drawDust } from '@/components/overlays/draw-dust'
import { drawFog } from '@/components/overlays/draw-fog'
import { drawFog2 } from '@/components/overlays/draw-fog2'

type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number) => (() => void) | void

const DRAW_FN: Record<OverlayVariant, DrawFn> = {
  scratch: drawScratch,
  dust: drawDust,
  fog: drawFog,
  fog2: drawFog2,
}

export function DustOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancel: (() => void) | null = null

    function init() {
      cancel?.()
      cancel = null

      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight

      canvas!.width = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width = `${w}px`
      canvas!.style.height = `${h}px`

      const ctx = canvas!.getContext('2d')
      if (!ctx) return

      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, w, h)

      const result = DRAW_FN[OVERLAY_VARIANT](ctx, w, h)
      if (typeof result === 'function') cancel = result
    }

    init()
    window.addEventListener('resize', init)

    return () => {
      window.removeEventListener('resize', init)
      cancel?.()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: -1,
      }}
    />
  )
}
