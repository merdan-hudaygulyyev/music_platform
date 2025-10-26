"use client";

import useUserSession from "@/custom-hooks/useUserSession";
import { supabase } from "@/lib/SupabaseClient";

import Image from "next/image";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { session } = useUserSession();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/");
      } else {
        setPageLoading(false);
      }
    });
  }, [router]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title.trim() || !artist.trim() || !audioFile || !coverImage) {
      setMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      // Upload Song File
      const timeStamp = Date.now();
      //upload the image
      const imagePath = `${timeStamp}_${coverImage.name}`;
      const { error: imgError } = await supabase.storage
        .from("cover-images")
        .upload(imagePath, coverImage);

      if (imgError) {
        setMessage(imgError.message);
        setLoading(false);
        return;
      }
      //get public url of the image
      const {
        data: { publicUrl: imgUrl },
      } = supabase.storage.from("cover-images").getPublicUrl(imagePath);

      const audioPath = `${timeStamp}_${audioFile.name}`;
      const { error: audioError } = await supabase.storage
        .from("songs")
        .upload(audioPath, audioFile);

      if (audioError) {
        setMessage(audioError.message);
        setLoading(false);
        return;
      }

      const {
        data: { publicUrl: audioUrl },
      } = supabase.storage.from("songs").getPublicUrl(audioPath);

      //save songs to supabase table
      const { error: insertError } = await supabase.from("songs").insert({
        title,
        artist,
        cover_image: imgUrl,
        audio: audioUrl,
        user_id: session?.user.id,
      });

      if (insertError) {
        setMessage(insertError.message);
        setLoading(false);
        return;
      }

      setTitle("");
      setArtist("");
      setCoverImage(null);
      setAudioFile(null);
      setMessage("Song uploaded successfully");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err) {
      console.log("Catched error:", err);
    }
  };

  if (pageLoading) return null;

  return (
    <div className="h-screen flex justify-center items-center w-full bg-hover">
      <div className="bg-background flex flex-col items-center px-6 lg:px-12 py-6 rounded-md max-w-[400px] w-[90%]">
        <Image
          src="/images/s_logo.png"
          alt="Logo"
          width={500}
          height={500}
          className="h-11 w-11"
        />
        <h2 className="text-2xl font-bold text-white my-2 mb-8 text-center">
          Upload to Spotify
        </h2>
        <form onSubmit={handleUpload}>
          {message && (
            <p className="bg-primary font-semibold text-center mb-4 py-1">
              {message}
            </p>
          )}
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            placeholder="Title"
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />
          <input
            onChange={(e) => setArtist(e.target.value)}
            value={artist}
            type="text"
            placeholder="Artist"
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />
          <label htmlFor="audio" className="block py-1 text-secondary-text">
            Audio
          </label>
          <input
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              const file = files[0];
              setAudioFile(file);
            }}
            accept="audio/*"
            id="audio"
            type="file"
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />
          <label htmlFor="cover" className="block py-1 text-secondary-text">
            Cover Image
          </label>
          <input
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              const file = files[0];
              setCoverImage(file);
            }}
            accept="images/*"
            id="cover"
            type="file"
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />

          {loading ? (
            <button className="bg-primary hover:bg-primary/80 py-3 rounded-full w-full font-bold cursor-pointer">
              Uploading...
            </button>
          ) : (
            <button className="bg-primary hover:bg-primary/80 py-3 rounded-full w-full font-bold cursor-pointer">
              Add Song
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
