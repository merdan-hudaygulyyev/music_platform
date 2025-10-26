"use client";

import React, { createContext, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import MusicPlayer from "@/components/Musicplayer";
import Navbar from "@/components/Navbar";
import Queue from "@/components/Queue";
import Sidebar from "@/components/Sidebar";
import { Song } from "@/types/songs";

type PlayerContextType = {
  isQueueModalOpen: boolean;
  setIsQueueModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentMusic: Song | null;
  setCurrentMusic: React.Dispatch<React.SetStateAction<Song | null>>;
  queue: Song[];
  setQueue: (songs: Song[]) => void;
  playNextSong: () => void;
  playPrevSong: () => void;
  setCurrentMusicIndex: React.Dispatch<React.SetStateAction<number>>;
  currentMusicIndex: number;
};

export const PlayerContext = createContext<PlayerContextType | undefined>(
  undefined
);

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = new QueryClient();

  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);

  const [currentMusic, setCurrentMusic] = useState<null | Song>(null);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [queue, setQueue] = useState<Song[]>([]);

  const playNextSong = () => {
    if (currentMusicIndex < queue.length - 1) {
      setCurrentMusicIndex((prevIndex) => prevIndex + 1);
    }
  };

  const playPrevSong = () => {
    if (currentMusicIndex > 0) {
      setCurrentMusicIndex((prevIndex) => prevIndex - 1);
    }
  };

  useEffect(() => {
    if (
      queue.length > 0 &&
      currentMusicIndex >= 0 &&
      currentMusicIndex < queue.length
    ) {
      setCurrentMusic(queue[currentMusicIndex]);
    }
  }, [currentMusicIndex, queue]);

  return (
    <QueryClientProvider client={queryClient}>
      <PlayerContext.Provider
        value={{
          isQueueModalOpen,
          setIsQueueModalOpen,
          currentMusic,
          setCurrentMusic,
          queue,
          setQueue,
          playNextSong,
          playPrevSong,
          setCurrentMusicIndex,
          currentMusicIndex,
        }}
      >
        <div className="min-h-screen">
          <Navbar />
          <main>
            <Sidebar />
            <Queue />
            {currentMusic && <MusicPlayer />}
            {children}
          </main>
        </div>
      </PlayerContext.Provider>
    </QueryClientProvider>
  );
}
