import { supabase } from "@/lib/SupabaseClient";
import { useQueryClient } from "@tanstack/react-query";

import { Trash } from "lucide-react";

type DeleteBtnProp = {
  songId: number;
  imgPath: string;
  audioPath: string;
};

const DeleteBtn = ({ songId, imgPath, audioPath }: DeleteBtnProp) => {
  const queryClient = useQueryClient();

  const deleteSong = async () => {
    //delete the image
    const { error: imgError } = await supabase.storage
      .from("cover-images")
      .remove([imgPath]);

    if (imgError) {
      console.log("Image delete error:", imgError.message);
      return;
    }

    //delete the audio
    const { error: audioError } = await supabase.storage
      .from("songs")
      .remove([audioPath]);

    if (audioError) {
      console.log("Audio delete error:", audioError.message);
      return;
    }

    //delete the song from the songs table in db(supabase)
    const { error: deleteError } = await supabase
      .from("songs")
      .delete()
      .eq("id", songId);

    if (deleteError) {
      console.log("Songs table delete error:", deleteError.message);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["allSongs"] });
    queryClient.invalidateQueries({ queryKey: ["userSongs"] });
  };

  return (
    <button
      onClick={deleteSong}
      className="text-secondary-text absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer hidden group-hover:block"
    >
      <Trash />
    </button>
  );
};

export default DeleteBtn;
