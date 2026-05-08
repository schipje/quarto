import { createContext, useContext, useState, ReactNode } from 'react'
import { GameDefinition, ScoreResult } from '../types'

interface AppState {
  selectedGame: GameDefinition | null
  playerNames: string[]
  scoreResult: ScoreResult | null
  apiKey: string
}

interface AppContextValue extends AppState {
  setSelectedGame: (game: GameDefinition) => void
  setPlayerNames: (names: string[]) => void
  setScoreResult: (result: ScoreResult) => void
  setApiKey: (key: string) => void
  resetSession: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedGame, setSelectedGame] = useState<GameDefinition | null>(null)
  const [playerNames, setPlayerNames] = useState<string[]>([])
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null)
  const [apiKey, setApiKeyState] = useState<string>(() => {
    return localStorage.getItem('claude_api_key') ?? ''
  })

  const setApiKey = (key: string) => {
    localStorage.setItem('claude_api_key', key)
    setApiKeyState(key)
  }

  const resetSession = () => {
    setSelectedGame(null)
    setPlayerNames([])
    setScoreResult(null)
  }

  return (
    <AppContext.Provider value={{
      selectedGame,
      playerNames,
      scoreResult,
      apiKey,
      setSelectedGame,
      setPlayerNames,
      setScoreResult,
      setApiKey,
      resetSession,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
