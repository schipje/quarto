import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { GAMES } from '../games'
import { GameDefinition } from '../types'

export default function HomeScreen() {
  const navigate = useNavigate()
  const { setSelectedGame, resetSession } = useApp()

  function handleSelect(game: GameDefinition) {
    resetSession()
    setSelectedGame(game)
    navigate(`/setup/${game.id}`)
  }

  return (
    <div className="screen">
      <div className="top-bar">
        <span className="text-2xl">🎲</span>
        <h1 className="text-xl font-bold flex-1">Board Game Scorer</h1>
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-full hover:bg-primary-700 transition-colors"
          aria-label="Settings"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        <p className="text-sm text-gray-500 mb-2">Select a game to start scoring</p>
        {GAMES.map(game => (
          <button
            key={game.id}
            onClick={() => handleSelect(game)}
            className="card w-full text-left hover:shadow-md hover:border-primary-300 active:bg-primary-50 transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{game.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-bold text-gray-900 text-base">{game.displayName}</h2>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {game.minPlayers}–{game.maxPlayers} players
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{game.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
