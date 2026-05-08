import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { testConnection } from '../services/claude'

type ConnectionState = 'idle' | 'testing' | 'success' | 'failure'

export default function SettingsScreen() {
  const navigate = useNavigate()
  const { apiKey, setApiKey } = useApp()

  const [draft, setDraft] = useState(apiKey)
  const [showKey, setShowKey] = useState(false)
  const [connState, setConnState] = useState<ConnectionState>('idle')
  const [connMsg, setConnMsg] = useState('')

  function handleSave() {
    setApiKey(draft.trim())
    setConnState('idle')
  }

  function handleClear() {
    setDraft('')
    setApiKey('')
    setConnState('idle')
  }

  async function handleTest() {
    const key = draft.trim()
    if (!key) return
    setConnState('testing')
    setConnMsg('')
    try {
      await testConnection(key)
      setConnState('success')
      setConnMsg('Connection successful!')
    } catch (e) {
      setConnState('failure')
      setConnMsg((e as Error).message ?? 'Connection failed')
    }
  }

  const saved = draft.trim() === apiKey

  return (
    <div className="screen">
      <div className="top-bar">
        <button onClick={() => navigate('/')} className="p-1 rounded-full hover:bg-primary-700 transition-colors" aria-label="Back">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold flex-1">Settings</h1>
      </div>

      <div className="flex-1 px-4 py-6 space-y-6">
        <div className="card space-y-3">
          <h2 className="font-semibold text-gray-800">Claude API Key</h2>
          <p className="text-sm text-gray-500">
            Required to analyse game photos. Get your key from{' '}
            <a
              href="https://console.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 underline"
            >
              console.anthropic.com
            </a>
          </p>

          <div className="relative">
            <input
              className="input-field pr-12"
              type={showKey ? 'text' : 'password'}
              value={draft}
              onChange={e => { setDraft(e.target.value); setConnState('idle') }}
              placeholder="sk-ant-..."
              autoComplete="off"
              spellCheck={false}
            />
            <button
              onClick={() => setShowKey(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {connState !== 'idle' && (
            <div className={`text-sm px-3 py-2 rounded-lg ${
              connState === 'success' ? 'bg-green-50 text-green-700' :
              connState === 'failure' ? 'bg-red-50 text-red-700' :
              'bg-gray-50 text-gray-500'
            }`}>
              {connState === 'testing' ? 'Testing connection...' : connMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button onClick={handleSave} disabled={saved || !draft.trim()} className="btn-primary !py-2 text-sm">
              Save
            </button>
            <button onClick={handleClear} disabled={!draft} className="btn-secondary !py-2 text-sm">
              Clear
            </button>
          </div>

          <button
            onClick={handleTest}
            disabled={!draft.trim() || connState === 'testing'}
            className="btn-ghost w-full text-sm"
          >
            {connState === 'testing' ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        <div className="card bg-primary-50 border-primary-200">
          <h3 className="font-semibold text-primary-900 text-sm mb-1">Privacy Note</h3>
          <p className="text-xs text-primary-700">
            Your API key is stored in your browser's local storage and never sent anywhere except directly to Anthropic's servers.
            Photos are only sent when you trigger analysis and are not stored.
          </p>
        </div>
      </div>
    </div>
  )
}
