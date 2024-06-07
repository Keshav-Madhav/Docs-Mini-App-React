import * as React from 'react';
import {
  MdPlayArrow,
  MdPause,
  MdSkipNext,
  MdSkipPrevious,
  MdVolumeUp,
  MdVolumeOff,
} from 'react-icons/md';
import { CgSpinner } from 'react-icons/cg';
import IconButton from './IconButton';
import AudioProgressBar from './AudioProgressBar';
import VolumeInput from './VolumeInput';

function formatDurationDisplay(duration: number) {
  const min = Math.floor(duration / 60);
  const sec = Math.floor(duration - min * 60);

  const formatted = [min, sec].map((n) => (n < 10 ? '0' + n : n)).join(':');

  return formatted;
}

interface AudioPlayerProps {
  currentSong: { title: string; src: string };
}

export default function AudioPlayer({
  currentSong,
}: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const [isReady, setIsReady] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [currrentProgress, setCurrrentProgress] = React.useState(0);
  const [buffered, setBuffered] = React.useState(0);
  const [volume, setVolume] = React.useState(0.2);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const durationDisplay = formatDurationDisplay(duration);
  const elapsedDisplay = formatDurationDisplay(currrentProgress);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleBufferProgress: React.ReactEventHandler<HTMLAudioElement> = (
    e
  ) => {
    const audio = e.currentTarget;
    const dur = audio.duration;
    if (dur > 0) {
      for (let i = 0; i < audio.buffered.length; i++) {
        if (
          audio.buffered.start(audio.buffered.length - 1 - i) <
          audio.currentTime
        ) {
          const bufferedLength = audio.buffered.end(
            audio.buffered.length - 1 - i
          );
          setBuffered(bufferedLength);
          break;
        }
      }
    }
  };

  const handleMuteUnmute = () => {
    if (!audioRef.current) return;

    if (audioRef.current.volume !== 0) {
      audioRef.current.volume = 0;
    } else {
      audioRef.current.volume = 1;
    }
  };

  const handleVolumeChange = (volumeValue: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = volumeValue;
    setVolume(volumeValue);
  };

  return (
    <div className="bg-transparent-900 text-slate-400 relative mt-2">
      <audio
        ref={audioRef}
        preload="metadata"
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onCanPlay={(e) => {
          e.currentTarget.volume = volume;
          setIsReady(true);
        }}
        onTimeUpdate={(e) => {
          setCurrrentProgress(e.currentTarget.currentTime);
          handleBufferProgress(e);
        }}
        onProgress={handleBufferProgress}
        onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
      >
        <source type="audio/mpeg" src={currentSong.src} />
      </audio>
        
      <AudioProgressBar
        duration={duration}
        currentProgress={currrentProgress}
        buffered={buffered}
        onChange={(e) => {
          if (!audioRef.current) return;
          audioRef.current.currentTime = e.currentTarget.valueAsNumber;
          setCurrrentProgress(e.currentTarget.valueAsNumber);
        }}
      />

      <div className="flex items-center justify-between mt-3">
        <div className='flex items-center gap-3'>
          <IconButton
            disabled={!isReady}
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            size="md"
            intent="secondary"
          >
            {!isReady && currentSong ? (
              <CgSpinner size={24} className="animate-spin" />
            ) : isPlaying ? (
              <MdPause size={30} />
            ) : (
              <MdPlayArrow size={30} />
            )}
          </IconButton>

          <span className="text-xs">
            {elapsedDisplay} / {durationDisplay}
          </span>
        </div>

        <div className="flex gap-3 items-center justify-self-end">
          <VolumeInput volume={volume} onVolumeChange={handleVolumeChange} />
          <IconButton
            intent="secondary"
            size="md"
            onClick={handleMuteUnmute}
            aria-label={volume === 0 ? 'unmute' : 'mute'}
          >
            {volume === 0 ? (
              <MdVolumeOff size={20} />
            ) : (
              <MdVolumeUp size={20} />
            )}
          </IconButton>
        </div>
      </div>
    </div>
  );
}
