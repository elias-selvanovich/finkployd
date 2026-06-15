import { useState } from 'react'
import logo from './assets/logo.svg'
import MusicPlayer, { TRACKS, type PlayerState } from './components/MusicPlayer'

function App() {
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTrackIndex: -1,
    playedFraction: 0,
    playedSeconds: 0,
    duration: 0,
  })

  const isIdle = playerState.currentTrackIndex === -1
  const currentTrack = !isIdle ? TRACKS[playerState.currentTrackIndex] : null

  // Programmatically resolve glow variables depending on active track
  const glowScale = currentTrack ? currentTrack.glowScale : 1.0
  const glowOpacity = currentTrack ? currentTrack.glowOpacity : 0.3
  const glowSpeed = currentTrack ? currentTrack.glowSpeed : '6s'

  // We write these custom properties directly to the style element
  // so CSS variables in index.css automatically react to state changes.
  const glowStyles = {
    '--glow-base-scale': glowScale,
    '--glow-base-opacity': glowOpacity,
    '--glow-speed': glowSpeed,
  } as React.CSSProperties

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between py-12 px-6 overflow-hidden bg-black text-zinc-100 select-none">
      {/* Subtle grid backdrop for industrial visual flavor */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(39,39,42,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(39,39,42,0.06)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_65%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      {/* Center Section: Logo + Pulsing Ambient Glow */}
      <main className="flex-grow flex flex-col justify-center items-center relative py-12 sm:py-20 z-10">
        <div className="logo-container relative flex items-center justify-center w-full px-6">
          {/* Ambient red glow behind logo */}
          <div
            className="glow-backdrop breathing"
            style={glowStyles}
          />
          {/* Centered logo */}
          <img src={logo} className="logo" alt="Fink Ployd Logo" />
        </div>
      </main>

      {/* Lower Section: Media Player */}
      <footer className="w-full pb-6 z-10">
        <MusicPlayer onStateChange={setPlayerState} />
      </footer>
    </div>
  )
}

export default App
