"use client";

import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { PlayerContext } from "@/layouts/Layout";
import {
  ListMusic,
  Pause,
  Play,
  Repeat,
  Repeat1,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeOff,
} from "lucide-react";

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [previousVolume, setPreviousVolume] = useState(50);
  const [repeatSong, setRepeatSong] = useState(false);

  const context = useContext(PlayerContext);
  if (!context) throw new Error("Player context must be within a provider");

  const {
    isQueueModalOpen,
    setIsQueueModalOpen,
    currentMusic,
    playNextSong,
    playPrevSong,
  } = context;

  // ✅ Toggle play/pause button
  const togglePlayBtn = async () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.log("Audio toggle error:", err);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume / 100;
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(previousVolume);
      if (audioRef.current) audioRef.current.volume = previousVolume / 100;
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  // ✅ Update time and duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
    };
  }, []);

  // ✅ Handle song change and play
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentMusic) return;

    const playAudio = async () => {
      try {
        // Pause before switching track
        audio.pause();

        // Only set src if it's a new song
        if (audio.src !== currentMusic.audio) {
          audio.src = currentMusic.audio;
          audio.load();
        }

        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.log("AudioPlay err:", err);
        setIsPlaying(false);
      }
    };

    playAudio();
  }, [currentMusic]);

  // ✅ Handle song end (repeat or next)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleSongEnd = () => {
      if (repeatSong) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNextSong();
      }
    };

    audio.addEventListener("ended", handleSongEnd);

    return () => {
      audio.removeEventListener("ended", handleSongEnd);
    };
  }, [repeatSong, playNextSong]);

  //  Keep volume synced
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  if (!currentMusic) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black text-white px-4 py-3 shadow-md z-50">
      <audio src={currentMusic?.audio || ""} ref={audioRef}></audio>

      <div className="max-w-8xl w-[95%] mx-auto flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <Image
            src={currentMusic.cover_image || ""}
            alt="cover-image"
            width={50}
            height={50}
            className="w-13 h-13 object-cover rounded-md"
          />
          <div className="text-sm">
            <p className="text-white">{currentMusic.title}</p>
            <p className="text-secondary-text font-normal">
              {currentMusic.artist}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="max-w-[400px] w-full flex items-center flex-col gap-3">
          <div className="flex gap-4">
            <button onClick={playPrevSong}>
              <SkipBack />
            </button>
            <button
              onClick={togglePlayBtn}
              className="bg-white text-black w-10 h-10 rounded-full grid place-items-center"
            >
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button onClick={playNextSong}>
              <SkipForward />
            </button>
          </div>

          <div className="w-full flex justify-center items-center gap-2">
            <span>{formatTime(currentTime)}</span>
            <input
              onChange={handleSeek}
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              className="w-full accent-white"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          {repeatSong ? (
            <button
              className="text-primary"
              onClick={() => setRepeatSong(false)}
            >
              <Repeat1 />
            </button>
          ) : (
            <button onClick={() => setRepeatSong(true)}>
              <Repeat />
            </button>
          )}
          <button onClick={() => setIsQueueModalOpen(!isQueueModalOpen)}>
            <ListMusic />
          </button>
          <button onClick={toggleMute}>
            {volume === 0 ? <VolumeOff /> : <Volume2 />}
          </button>
          <input
            onChange={handleVolumeChange}
            value={volume}
            type="range"
            min="0"
            max="100"
            className="w-[100px] accent-white"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
