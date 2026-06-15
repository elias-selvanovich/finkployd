import { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player'

export interface Track {
  title: string;
  duration: string;
  url: string;
  glowScale: number;
  glowOpacity: number;
  glowSpeed: string;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTrackIndex: number;
  playedFraction: number;
  playedSeconds: number;
  duration: number;
}

interface MusicPlayerProps {
  onStateChange: (state: PlayerState) => void;
}

export const TRACKS: Track[] = [
  {
    title: 'I. PIGS ON THE WING (PART ONE)',
    duration: '01:24',
    url: 'https://www.youtube.com/watch?v=iX8MNSINSuA',
    glowScale: 0.85,
    glowOpacity: 0.6,
    glowSpeed: '8s',
  },
  {
    title: 'II. DOGS',
    duration: '17:05',
    url: 'https://www.youtube.com/watch?v=tq3bYPLBcA4',
    glowScale: 1.15,
    glowOpacity: 0.7,
    glowSpeed: '4.5s',
  },
  {
    title: 'III. PIGS (THREE DIFFERENT ONES)',
    duration: '11:25',
    url: 'https://www.youtube.com/watch?v=ZUEGeWYWbuU',
    glowScale: 1.4,
    glowOpacity: 0.8,
    glowSpeed: '2.5s',
  },
  {
    title: 'IV. SHEEP',
    duration: '10:19',
    url: 'https://www.youtube.com/watch?v=B2MxUCENw2s',
    glowScale: 1.25,
    glowOpacity: 0.9,
    glowSpeed: '3.5s',
  },
  {
    title: 'V. PIGS ON THE WING (PART TWO)',
    duration: '01:32',
    url: 'https://www.youtube.com/watch?v=8rMN94FXi2Y',
    glowScale: 0.85,
    glowOpacity: 0.6,
    glowSpeed: '8s',
  },
]

export default function MusicPlayer({ onStateChange }: MusicPlayerProps) {
  const [hasStarted, setHasStarted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [playedFraction, setPlayedFraction] = useState(0)
  const [playedSeconds, setPlayedSeconds] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hasError, setHasError] = useState(false)

  const playerRef = useRef<any>(null)
  const Player = ReactPlayer as any

  // Report state changes up to App.tsx
  useEffect(() => {
    onStateChange({
      isPlaying,
      currentTrackIndex: hasStarted ? currentTrackIndex : -1,
      playedFraction,
      playedSeconds,
      duration,
    })
  }, [isPlaying, hasStarted, currentTrackIndex, playedFraction, playedSeconds, duration, onStateChange])

  const initiateTransmission = () => {
    setHasError(false)
    setHasStarted(true)
    setIsPlaying(true)
  }

  const handleError = (err: any) => {
    console.error('Playback transmission error:', err)
    setHasError(true)
  }

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    const played = isNaN(state.played) ? 0 : state.played
    const playedSecs = isNaN(state.playedSeconds) ? 0 : state.playedSeconds
    setPlayedFraction(played)
    setPlayedSeconds(playedSecs)
  }

  const handleDuration = (dur: number) => {
    setDuration(isNaN(dur) ? 0 : dur)
  }

  const handleEnded = () => {
    if (currentTrackIndex < TRACKS.length - 1) {
      // Advance to the next track
      setPlayedFraction(0)
      setPlayedSeconds(0)
      setDuration(0)
      setCurrentTrackIndex(currentTrackIndex + 1)
    } else {
      // Completed the entire album transmission
      setIsPlaying(false)
      setHasStarted(false)
      setCurrentTrackIndex(0)
      setPlayedFraction(0)
      setPlayedSeconds(0)
      setDuration(0)
    }
  }

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00'
    const minutes = Math.floor(secs / 60)
    const seconds = Math.floor(secs % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const getProgressBar = (progress: number) => {
    const cleanProgress = isNaN(progress) ? 0 : Math.max(0, Math.min(1, progress))
    const totalChars = 24
    const filledChars = Math.round(cleanProgress * totalChars)
    const emptyChars = totalChars - filledChars
    return `[${'█'.repeat(filledChars)}${'░'.repeat(emptyChars)}]`
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center select-none font-mono">
      {/* Invisible React Player styled to avoid Chrome background iframe throttling */}
      <div 
        className="absolute pointer-events-none" 
        style={{ 
          opacity: 0.001, 
          width: '200px', 
          height: '200px', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          zIndex: -50,
          overflow: 'hidden'
        }}
      >
        <Player
          ref={playerRef}
          src={TRACKS[currentTrackIndex].url}
          playing={isPlaying}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={handleEnded}
          onError={handleError}
          width="100%"
          height="100%"
        />
      </div>

      {/* Tracklist Display */}
      <div className="w-full mb-10 text-left space-y-4">
        {TRACKS.map((track, index) => {
          const isCurrent = hasStarted && index === currentTrackIndex
          const isPast = hasStarted && index < currentTrackIndex

          let textClass = 'text-zinc-800' // Default idle / upcoming
          if (isCurrent) {
            textClass = 'text-zinc-100 font-bold tracking-wider'
          } else if (isPast) {
            textClass = 'text-zinc-950 opacity-20'
          }

          return (
            <div
              key={index}
              className={`flex justify-between items-center transition-all duration-700 ${textClass}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-right text-xs">
                  {isCurrent ? (
                    <span className="text-red-600 animate-pulse">█</span>
                  ) : (
                    `${index + 1}.`
                  )}
                </span>
                <span className="tracking-widest text-xs sm:text-sm">{track.title}</span>
              </div>
              <span className="text-xs tracking-widest tabular-nums">
                {isCurrent && duration > 0 ? formatTime(playedSeconds) : track.duration}
              </span>
            </div>
          )
        })}
      </div>

      {/* Control Actions / Status Terminal */}
      <div className="w-full text-center">
        {!hasStarted ? (
          <button
            onClick={initiateTransmission}
            className="px-6 py-3 border border-zinc-800 text-zinc-400 hover:text-red-500 hover:border-red-800 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] text-xs tracking-[0.2em] transition-all duration-300 cursor-pointer bg-black/40"
          >
            [ INITIATE TRANSMISSION ]
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-500 text-xs tracking-wider">
            {hasError ? (
              <div className="text-red-600 font-bold tracking-[0.1em] text-[10px] animate-pulse">
                [ ERROR: TRANSMISSION BLOCKED // EMBED RESTRICTIONS APPLY ]
              </div>
            ) : (
              <div className="text-red-500/80 animate-pulse tracking-[0.15em] text-[10px]">
                TRANSMISSION ACTIVE: LINEAR FEED ENGAGED
              </div>
            )}
            <div className="font-mono text-zinc-400 mt-1 select-none tabular-nums">
              {getProgressBar(playedFraction)} {Math.round(playedFraction * 100)}%
            </div>
            <div className="text-[10px] text-zinc-600 tracking-widest mt-1 select-none uppercase">
              {hasError
                ? "Verify video URL allows external iframe embedding."
                : "No manual override permitted. Complete system control active."}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
