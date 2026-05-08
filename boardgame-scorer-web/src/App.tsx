import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import HomeScreen from './screens/HomeScreen'
import PlayerSetupScreen from './screens/PlayerSetupScreen'
import PhotoCaptureScreen from './screens/PhotoCaptureScreen'
import ScoreResultScreen from './screens/ScoreResultScreen'
import SettingsScreen from './screens/SettingsScreen'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/setup/:gameId" element={<PlayerSetupScreen />} />
          <Route path="/capture" element={<PhotoCaptureScreen />} />
          <Route path="/results" element={<ScoreResultScreen />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
