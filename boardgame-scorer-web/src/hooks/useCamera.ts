import { useRef, useState, useCallback, useEffect } from 'react'

const MAX_WIDTH = 1280
const MAX_HEIGHT = 960
const JPEG_QUALITY = 0.85

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  const startCamera = useCallback(async () => {
    setError(null)
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      })
      setStream(s)
      if (videoRef.current) {
        videoRef.current.srcObject = s
        videoRef.current.onloadedmetadata = () => setReady(true)
      }
    } catch (e) {
      setError((e as Error).message ?? 'Camera access denied')
    }
  }, [])

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach(t => t.stop())
    setStream(null)
    setReady(false)
  }, [stream])

  const capturePhoto = useCallback((): string | null => {
    const video = videoRef.current
    if (!video) return null

    const canvas = document.createElement('canvas')
    const vw = video.videoWidth
    const vh = video.videoHeight
    const scale = Math.min(1, MAX_WIDTH / vw, MAX_HEIGHT / vh)
    canvas.width = Math.round(vw * scale)
    canvas.height = Math.round(vh * scale)

    const ctx = canvas.getContext('2d')!
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
  }, [])

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach(t => t.stop())
    }
  }, [stream])

  return { videoRef, stream, error, ready, startCamera, stopCamera, capturePhoto }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Scale down large images
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, MAX_WIDTH / img.width, MAX_HEIGHT / img.height)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY))
      }
      img.onerror = reject
      img.src = result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
