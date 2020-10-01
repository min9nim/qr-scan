import React, { useEffect, useRef } from 'react'
import { videoOff } from './QRScan.fn'

export default function Scanner({ video, tick }: any) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvasElement: any = canvasRef.current
    requestAnimationFrame(() => tick({ canvasElement, video }))
    return () => {
      videoOff(video)
    }
  }, [])

  return (
    <canvas ref={canvasRef} />
  )
}
