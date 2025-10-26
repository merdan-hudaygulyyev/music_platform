"use client";

import { PlayerContext } from "@/layouts/Layout";
import { useContext } from "react";

import Image from "next/image";
import { Song } from "@/types/songs";

const Queue = () => {
  const context = useContext(PlayerContext);

  if (!context) throw new Error("Player context must be within a provider");

  const {
    isQueueModalOpen,
    currentMusic,
    currentMusicIndex,
    queue,
    setCurrentMusicIndex,
    setQueue,
  } = context;

  const startPlayingSong = (songs: Song[], index: number) => {
    setCurrentMusicIndex(index);
    setQueue(songs);
  };

  if (!isQueueModalOpen) return null;

  return (
    <div className="fixed top-18 right-6 z-50 max-w-[300px] w-full h-[75vh] bg-black border-1 p-4 overflow-y-auto rounded-md">
      <h2>Queue</h2>
      <div className="mt-8">
        <h2 className="text-white font-bold mb-3">Now PLaying</h2>
        <div className="flex items-center gap-2 cursor-pointer mb-2 p-2 rounded-lg hover:bg-hover">
          {currentMusic && (
            <Image
              src={currentMusic?.cover_image}
              alt="queue-image"
              width={300}
              height={300}
              className="w-10 h-10 object-cover rounded-md"
            />
          )}
          <div>
            <p className="text-primary font-semibold">{currentMusic?.title}</p>
            <p className="text-sm text-secondary-text">
              {currentMusic?.artist}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-white font-bold mb-3">Queue List</h2>
        {queue.map((song: Song, index) => (
          <div
            onClick={() => startPlayingSong(queue, index)}
            key={song.id}
            className="flex items-center gap-2 cursor-pointer mb-2 p-2 rounded-lg hover:bg-hover"
          >
            <Image
              src={song.cover_image}
              alt="queue-image"
              width={300}
              height={300}
              className="w-10 h-10 object-cover rounded-md"
            />
            <div>
              <p
                className={`font-semibold ${
                  currentMusicIndex === index ? "text-primary" : "text-white "
                }`}
              >
                {song.title}
              </p>
              <p className="text-sm text-secondary-text">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Queue;
