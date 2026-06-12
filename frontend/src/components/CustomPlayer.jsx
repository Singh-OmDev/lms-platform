import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, RotateCcw, FastForward, PlayCircle } from 'lucide-react';
import { useStore, api } from '../store/useStore';

export default function CustomPlayer({ video, onProgressUpdate, onCompleted }) {
  const { addToast } = useStore();
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [resumePrompt, setResumePrompt] = useState(false);
  const [savedTime, setSavedTime] = useState(0);
  
  const lastSavedTimeRef = useRef(0);
  const currentTimeRef = useRef(0);

  // Load saved progress initially
  useEffect(() => {
    if (video.progress && video.progress.currentTime > 0 && video.progress.currentTime < video.duration - 5) {
      setSavedTime(video.progress.currentTime);
      setResumePrompt(true);
    } else {
      setPlaying(false); // Let user manually click play to prevent browser autoplay blocking
    }
  }, [video.id]);

  // Save watch progress immediately when unmounting or switching videos
  useEffect(() => {
    return () => {
      const time = currentTimeRef.current;
      if (time > 0 && Math.abs(time - lastSavedTimeRef.current) > 1) {
        api.post('/progress', {
          videoId: video.id,
          currentTime: time
        }).catch(e => console.error('Unmount save progress error:', e));
      }
    };
  }, [video.id]);

  // Sync playing state to native video element
  useEffect(() => {
    if (playerRef.current) {
      if (playing) {
        playerRef.current.play().catch(e => {
          console.error('Native play policy block:', e);
          setPlaying(false);
        });
      } else {
        playerRef.current.pause();
      }
    }
  }, [playing]);

  // Sync volume, muted, and playbackRate states to native video element
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.muted = muted;
    }
  }, [muted]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, playing]);

  // Autohide controls logic
  useEffect(() => {
    let timeoutId;
    if (playing && showControls) {
      timeoutId = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [playing, showControls]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          setPlaying((prev) => !prev);
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          setMuted((prev) => !prev);
          break;
        case 'arrowright':
          e.preventDefault();
          seekForward(10);
          break;
        case 'arrowleft':
          e.preventDefault();
          seekBackward(10);
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume((v) => Math.min(v + 0.1, 1));
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume((v) => Math.max(v - 0.1, 0));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setMuted(newVol === 0);
  };

  const toggleMuted = () => {
    setMuted(!muted);
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;

    if (!isFullscreen) {
      if (playerContainerRef.current.requestFullscreen) {
        playerContainerRef.current.requestFullscreen();
      } else if (playerContainerRef.current.webkitRequestFullscreen) {
        playerContainerRef.current.webkitRequestFullscreen();
      } else if (playerContainerRef.current.msRequestFullscreen) {
        playerContainerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Keep state sync in fullscreen change
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const seekForward = (secs) => {
    if (playerRef.current) {
      const newTime = Math.min(playerRef.current.currentTime + secs, duration);
      playerRef.current.currentTime = newTime;
      setPlayedSeconds(newTime);
      currentTimeRef.current = newTime;
    }
  };

  const seekBackward = (secs) => {
    if (playerRef.current) {
      const newTime = Math.max(playerRef.current.currentTime - secs, 0);
      playerRef.current.currentTime = newTime;
      setPlayedSeconds(newTime);
      currentTimeRef.current = newTime;
    }
  };

  const handleScrubberChange = (e) => {
    const value = parseFloat(e.target.value);
    if (playerRef.current) {
      playerRef.current.seekTo(value);
      setPlayedSeconds(value);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh > 0) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  // Native Video HTML5 Handlers
  const handleTimeUpdate = () => {
    if (playerRef.current) {
      const time = playerRef.current.currentTime;
      setPlayedSeconds(time);
      currentTimeRef.current = time;

      if (Math.abs(time - lastSavedTimeRef.current) >= 10) {
        saveProgressToBackend(time);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (playerRef.current) {
      setDuration(playerRef.current.duration);
    }
  };

  const handlePause = () => {
    if (playerRef.current) {
      saveProgressToBackend(playerRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    if (playerRef.current) {
      saveProgressToBackend(playerRef.current.duration);
    }
  };

  const saveProgressToBackend = async (time) => {
    try {
      lastSavedTimeRef.current = time;
      const res = await api.post('/progress', {
        videoId: video.id,
        currentTime: time
      });
      if (onProgressUpdate) {
        onProgressUpdate(res.data);
      }
      if (res.data.newlyCompleted && onCompleted) {
        onCompleted(res.data);
      }
    } catch (e) {
      console.error('Failed to auto-save watch progress', e);
    }
  };

  const handleResume = () => {
    if (playerRef.current) {
      playerRef.current.currentTime = savedTime;
      setPlayedSeconds(savedTime);
      lastSavedTimeRef.current = savedTime;
    }
    setResumePrompt(false);
    setPlaying(true);
  };

  const handleStartOver = () => {
    if (playerRef.current) {
      playerRef.current.currentTime = 0;
      setPlayedSeconds(0);
      lastSavedTimeRef.current = 0;
    }
    setResumePrompt(false);
    setPlaying(true);
    saveProgressToBackend(0);
  };

  return (
    <div 
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
      className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden border border-slate-700/40 shadow-2xl group"
    >
      {/* Resume modal overlay */}
      {resumePrompt && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6">
          <div className="bg-slate-900 border border-slate-700/60 p-6 rounded-2xl max-w-sm w-full text-center shadow-xl">
            <PlayCircle className="w-12 h-12 text-indigo-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-bold text-white mb-2">Resume Watching?</h3>
            <p className="text-slate-400 text-sm mb-6">
              You left off at <span className="text-indigo-400 font-semibold">{formatTime(savedTime)}</span>. Would you like to continue?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleResume}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white transition-all shadow-lg shadow-indigo-600/30"
              >
                Resume
              </button>
              <button
                onClick={handleStartOver}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold transition-all"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actual HTML5 Video Player */}
      <video
        ref={playerRef}
        src={video.videoUrl}
        className="absolute top-0 left-0 w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={(e) => {
          console.error('HTML5 video error:', e);
          addToast('Video playback error: Check format support or network connection', 'danger');
        }}
        preload="auto"
        controls={false}
      />

      {/* Controls Overlay */}
      {showControls && !resumePrompt && (
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/45 flex flex-col justify-between p-4 z-10 transition-opacity duration-300">
          {/* Top Header */}
          <div className="flex justify-between items-center text-white">
            <h4 className="font-semibold text-lg drop-shadow truncate max-w-md">{video.title}</h4>
            <span className="text-xs bg-indigo-500/25 border border-indigo-500/30 px-3 py-1 rounded-full text-indigo-300 font-medium">
              {video.category}
            </span>
          </div>

          {/* Center Play Button Overlay for Mobile */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button 
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg pointer-events-auto transform transition active:scale-95 hover:bg-indigo-500 hover:scale-105 opacity-0 group-hover:opacity-100 duration-300"
            >
              {playing ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>
          </div>

          {/* Bottom Control Bar */}
          <div className="space-y-4 w-full">
            {/* Scrubber Progress Slider */}
            <div className="flex items-center gap-3 w-full">
              <span className="text-xs font-semibold text-slate-300 tabular-nums">
                {formatTime(playedSeconds)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={playedSeconds}
                onChange={handleScrubberChange}
                className="flex-grow accent-indigo-500 h-1.5 rounded-full cursor-pointer bg-slate-700/50 hover:h-2 transition-all outline-none"
              />
              <span className="text-xs font-semibold text-slate-300 tabular-nums">
                {formatTime(duration)}
              </span>
            </div>

            {/* Sub Controls */}
            <div className="flex justify-between items-center">
              {/* Left Buttons */}
              <div className="flex items-center gap-4 text-white">
                <button onClick={handlePlayPause} className="hover:text-indigo-400 transition-colors">
                  {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                
                <button onClick={() => seekBackward(10)} className="hover:text-indigo-400 transition-colors">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button onClick={() => seekForward(10)} className="hover:text-indigo-400 transition-colors">
                  <FastForward className="w-5 h-5" />
                </button>

                {/* Volume Section */}
                <div className="flex items-center gap-2 group/volume">
                  <button onClick={toggleMuted} className="hover:text-indigo-400 transition-colors">
                    {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={muted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-0 group-hover/volume:w-16 transition-all duration-300 accent-indigo-500 h-1 rounded bg-slate-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Right Buttons */}
              <div className="flex items-center gap-4 text-white relative">
                {/* Speed rate selection */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="text-xs font-bold bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all"
                  >
                    {playbackRate}x
                  </button>
                  
                  {showSpeedMenu && (
                    <div className="absolute bottom-8 right-0 bg-slate-900 border border-slate-700 rounded-lg p-1.5 flex flex-col gap-1 w-20 shadow-xl z-20">
                      {[0.5, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => handlePlaybackRateChange(rate)}
                          className={`text-xs font-semibold text-left px-2 py-1.5 rounded hover:bg-slate-800 transition-colors ${
                            playbackRate === rate ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fullscreen toggle */}
                <button onClick={toggleFullscreen} className="hover:text-indigo-400 transition-colors">
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
