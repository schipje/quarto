import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useCamera, fileToDataUrl } from '../hooks/useCamera'
import { scoreWithClaude } from '../services/claude'
import { CapturedPhoto, PhotoStep } from '../types'

type Stage = 'capturing' | 'reviewing' | 'analyzing' | 'error'

export default function PhotoCaptureScreen() {
  const navigate = useNavigate()
  const { selectedGame, playerNames, apiKey, setScoreResult } = useApp()
  const { videoRef, error: camError, ready, startCamera, stopCamera, capturePhoto } = useCamera()

  const [steps, setSteps] = useState<PhotoStep[]>([])
  const [stepIndex, setStepIndex] = useState(0)
  const [photos, setPhotos] = useState<CapturedPhoto[]>([])
  const [preview, setPreview] = useState<string | null>(null)
  const [stage, setStage] = useState<Stage>('capturing')
  const [errorMsg, setErrorMsg] = useState('')
  const [useCam, setUseCam] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!selectedGame || playerNames.length === 0) {
      navigate('/')
      return
    }
    const s = selectedGame.buildPhotoSteps(playerNames)
    setSteps(s)
  }, [selectedGame, playerNames, navigate])

  useEffect(() => {
    if (stage === 'capturing' && useCam) {
      startCamera()
    }
    return () => {
      if (useCam) stopCamera()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, useCam])

  if (!selectedGame || steps.length === 0) return null

  const currentStep = steps[stepIndex]
  const progress = stepIndex / steps.length

  function handleCapture() {
    if (useCam) {
      const dataUrl = capturePhoto()
      if (dataUrl) {
        stopCamera()
        setPreview(dataUrl)
        setStage('reviewing')
      }
    }
  }

  function handleRetake() {
    setPreview(null)
    setStage('capturing')
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await fileToDataUrl(file)
      setPreview(dataUrl)
      setStage('reviewing')
    } catch {
      setErrorMsg('Failed to load image file.')
      setStage('error')
    }
    e.target.value = ''
  }

  async function handleAccept() {
    if (!preview || !currentStep) return

    const newPhoto: CapturedPhoto = {
      stepId: currentStep.id,
      label: currentStep.title,
      dataUrl: preview,
    }
    const updatedPhotos = [...photos, newPhoto]
    setPhotos(updatedPhotos)

    if (stepIndex < steps.length - 1) {
      setPreview(null)
      setStepIndex(i => i + 1)
      setStage('capturing')
    } else {
      // All photos collected — send to Claude
      setStage('analyzing')
      try {
        const photoData = updatedPhotos.map(p => ({ label: p.label, dataUrl: p.dataUrl }))
        const labels = photoData.map(p => p.label)
        const prompt = selectedGame!.buildScoringPrompt(playerNames, labels)
        const result = await scoreWithClaude(apiKey, prompt, photoData)
        setScoreResult(result)
        navigate('/results')
      } catch (e) {
        setErrorMsg((e as Error).message ?? 'Unknown error from Claude')
        setStage('error')
      }
    }
  }

  function handleRetry() {
    setErrorMsg('')
    setStage('capturing')
  }

  return (
    <div className="screen bg-gray-900 text-white">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-black bg-opacity-50 z-10">
        <button
          onClick={() => navigate(`/setup/${selectedGame.id}`)}
          className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          aria-label="Back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="text-xs text-gray-300">
            Step {stepIndex + 1} of {steps.length}
          </div>
          <div className="font-semibold text-sm truncate">{currentStep?.title}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-700">
        <div
          className="h-full bg-primary-400 transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Main content */}
      {stage === 'analyzing' ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <div className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-semibold text-center">Analyzing scores with Claude AI...</p>
          <p className="text-sm text-gray-400 text-center">This may take up to 30 seconds</p>
        </div>
      ) : stage === 'error' ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <div className="text-5xl">⚠️</div>
          <p className="text-lg font-semibold text-center">Something went wrong</p>
          <p className="text-sm text-red-400 text-center">{errorMsg}</p>
          <button onClick={handleRetry} className="btn-primary max-w-xs">
            Try Again
          </button>
        </div>
      ) : stage === 'reviewing' ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-black relative">
            {preview && (
              <img src={preview} alt="Captured" className="w-full h-full object-contain" />
            )}
          </div>
          <div className="p-4 bg-gray-900 space-y-3">
            <p className="text-center text-sm text-gray-300">{currentStep?.instruction}</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleRetake} className="btn-secondary !text-white !border-white hover:!bg-white hover:!bg-opacity-10">
                Retake
              </button>
              <button onClick={handleAccept} className="btn-primary">
                {stepIndex < steps.length - 1 ? 'Next' : 'Analyse'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Capturing stage */
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-black relative">
            {useCam ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {camError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black bg-opacity-80 p-6">
                    <p className="text-red-400 text-sm text-center">{camError}</p>
                    <button onClick={() => setUseCam(false)} className="btn-secondary !text-white !border-white text-sm">
                      Use File Upload Instead
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-5xl mb-3">📁</div>
                  <p className="text-sm">Tap below to upload a photo</p>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-900 space-y-3">
            <p className="text-center text-sm text-gray-300 leading-snug">
              {currentStep?.instruction}
            </p>
            {useCam ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setUseCam(false); stopCamera() }}
                  className="flex-none text-gray-400 hover:text-white text-xs py-2 px-3"
                >
                  Upload
                </button>
                <button
                  onClick={handleCapture}
                  disabled={!ready}
                  className="flex-1 btn-primary disabled:opacity-40"
                >
                  Take Photo
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setUseCam(true)}
                  className="flex-none text-gray-400 hover:text-white text-xs py-2 px-3"
                >
                  Camera
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 btn-primary"
                >
                  Choose Photo
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      )}
    </div>
  )
}
