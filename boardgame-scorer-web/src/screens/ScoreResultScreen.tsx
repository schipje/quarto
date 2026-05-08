import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PlayerScore } from '../types'

const MEDALS = ['🥇', '🥈', '🥉']

function rankPlayers(players: PlayerScore[]): Array<PlayerScore & { rank: number }> {
  const sorted = [...players].sort((a, b) => b.total - a.total)
  return sorted.map((p, i) => ({ ...p, rank: i + 1 }))
}

export default function ScoreResultScreen() {
  const navigate = useNavigate()
  const { scoreResult, selectedGame, playerNames, resetSession } = useApp()

  if (!scoreResult || !selectedGame) {
    navigate('/')
    return null
  }

  const ranked = rankPlayers(scoreResult!.players)

  function handleShare() {
    const lines = [
      `${selectedGame!.emoji} ${selectedGame!.displayName} — Final Scores`,
      '',
      ...ranked.map(p => {
        const medal = MEDALS[p.rank - 1] ?? `#${p.rank}`
        return `${medal} ${p.name}: ${p.total} pts`
      }),
    ]
    if (scoreResult!.notes) lines.push('', scoreResult!.notes)
    const text = lines.join('\n')

    if (navigator.share) {
      navigator.share({ text }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text).then(() => alert('Scores copied to clipboard!')).catch(() => {})
    }
  }

  function handlePlayAgain() {
    resetSession()
    navigate('/')
  }

  return (
    <div className="screen">
      <div className="top-bar">
        <span className="text-xl">{selectedGame.emoji}</span>
        <h1 className="text-xl font-bold flex-1">Results — {selectedGame.displayName}</h1>
        <button onClick={handleShare} className="p-2 rounded-full hover:bg-primary-700 transition-colors" aria-label="Share">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        {ranked.map(player => (
          <div key={player.name} className={`card ${player.rank === 1 ? 'border-yellow-300 shadow-md' : ''}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">
                {MEDALS[player.rank - 1] ?? `#${player.rank}`}
              </span>
              <span className={`flex-1 text-base ${player.rank === 1 ? 'font-bold' : 'font-semibold'}`}>
                {player.name}
              </span>
              <span className={`text-2xl font-bold ${player.rank === 1 ? 'text-primary-800' : 'text-gray-700'}`}>
                {player.total}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-2 space-y-1">
              {Object.entries(player.breakdown).map(([category, points]) => (
                <div key={category} className="flex justify-between text-sm">
                  <span className="text-gray-500 capitalize">{category.replace(/_/g, ' ')}</span>
                  <span className={`font-medium ${points < 0 ? 'text-red-500' : 'text-gray-700'}`}>
                    {points > 0 ? '+' : ''}{points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {scoreResult.notes && (
          <div className="card bg-primary-50 border-primary-200">
            <p className="text-sm text-gray-600 italic">{scoreResult.notes}</p>
          </div>
        )}

        <div className="text-xs text-gray-400 text-center pb-2">
          {playerNames.length} players &nbsp;·&nbsp; Scored by Claude AI
        </div>
      </div>

      <div className="px-4 pb-6">
        <button onClick={handlePlayAgain} className="btn-primary">
          Play Again
        </button>
      </div>
    </div>
  )
}
