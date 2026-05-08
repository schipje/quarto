import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getGame } from '../games'

export default function PlayerSetupScreen() {
  const { gameId } = useParams<{ gameId: string }>()
  const navigate = useNavigate()
  const { setPlayerNames, setSelectedGame } = useApp()

  const game = getGame(gameId ?? '')

  const [names, setNames] = useState<string[]>(() => {
    if (!game) return []
    return Array.from({ length: game.minPlayers }, (_, i) => `Player ${i + 1}`)
  })

  if (!game) {
    navigate('/')
    return null
  }

  function updateName(index: number, value: string) {
    setNames(prev => prev.map((n, i) => (i === index ? value.slice(0, 50) : n)))
  }

  function addPlayer() {
    if (names.length < game!.maxPlayers) {
      setNames(prev => [...prev, `Player ${prev.length + 1}`])
    }
  }

  function removePlayer(index: number) {
    if (names.length > game!.minPlayers) {
      setNames(prev => prev.filter((_, i) => i !== index))
    }
  }

  function handleStart() {
    const trimmed = names.map(n => n.trim()).filter(Boolean)
    setSelectedGame(game!)
    setPlayerNames(trimmed)
    navigate('/capture')
  }

  const canStart = names.every(n => n.trim().length > 0)

  return (
    <div className="screen">
      <div className="top-bar">
        <button onClick={() => navigate('/')} className="p-1 rounded-full hover:bg-primary-700 transition-colors" aria-label="Back">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-xl">{game.emoji}</span>
        <h1 className="text-xl font-bold flex-1">{game.displayName}</h1>
      </div>

      <div className="flex-1 px-4 py-4 flex flex-col gap-4">
        <h2 className="font-semibold text-gray-700">Player Names</h2>

        <div className="space-y-3">
          {names.map((name, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center text-sm font-bold shrink-0">
                {i + 1}
              </span>
              <input
                className="input-field flex-1"
                type="text"
                value={name}
                onChange={e => updateName(i, e.target.value)}
                placeholder={`Player ${i + 1}`}
              />
              {names.length > game.minPlayers && (
                <button
                  onClick={() => removePlayer(i)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove player"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {names.length < game.maxPlayers && (
          <button onClick={addPlayer} className="btn-secondary flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Player
          </button>
        )}

        <div className="text-xs text-gray-400 text-center">
          {game.minPlayers}–{game.maxPlayers} players supported
        </div>

        <div className="flex-1" />

        <button onClick={handleStart} disabled={!canStart} className="btn-primary">
          Start Scoring
        </button>
      </div>
    </div>
  )
}
