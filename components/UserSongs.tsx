import Image from "next/image";

import { supabase } from "@/lib/SupabaseClient";
import { useQuery } from "@tanstack/react-query";

import { Song } from "@/types/songs";

import DeleteBtn from "./DeleteBtn";
import { useContext } from "react";
import { PlayerContext } from "@/layouts/Layout";
import useUserSession from "@/custom-hooks/useUserSession";

type UserSongsProps = {
  userId: string | undefined;
};

const UserSongs = ({ userId }: UserSongsProps) => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("Player context must be within a provider");
  }

  const { setQueue, setCurrentMusicIndex } = context;

  const getUserSongs = async () => {
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.log("Fetch user songs error:", error.message);
    }

    return data;
  };

  const {
    data: songs,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryFn: getUserSongs,
    queryKey: ["userSongs"],
  });

  const startPlayingSong = (songs: Song[], index: number) => {
    setCurrentMusicIndex(index);
    setQueue(songs);
  };

  if (isLoading)
    return (
      <div>
        {[...Array(10)].map((_, index) => (
          <div key={index} className="flex gap-2 mb-4 animate-pulse">
            <div className="w-10 h-10 rounded-md bg-hover"></div>
            <div className="h-5 w-[80%] rounded-md bg-hover"></div>
          </div>
        ))}
      </div>
    );

  if (isError)
    return <h2 className="text-center text-white text-2xl">{error.message}</h2>;

  if (!songs || songs.length === 0) {
    return (
      <h3 className="text-center font-semibold text-white">
        You have no songs in your library
      </h3>
    );
  }

  return (
    <div>
      {songs?.map((song: Song, index) => (
        <div
          key={song.id}
          onClick={() => startPlayingSong(songs, index)}
          className="relative flex gap-2 items-center cursor-pointer mb-4 p-2 rounded-lg hover:bg-hover group"
        >
          <DeleteBtn
            songId={song.id}
            imgPath={song.cover_image}
            audioPath={song.audio}
          />
          <Image
            src={song.cover_image}
            alt="cover-image"
            width={300}
            height={300}
            className="w-10 h-10 object-cover rounded-md"
          />
          <div>
            <p className="text-primary-text font-semibold">{song.title}</p>
            <p className="text-secondary-text text-sm">{song.artist}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserSongs;
