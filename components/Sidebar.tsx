"use client";

import Link from "next/link";

import { useState } from "react";
import useUserSession from "@/custom-hooks/useUserSession";
import UserSongs from "./UserSongs";

import { PanelLeft, Plus } from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { session, loading } = useUserSession();
  const user_id = session?.user.id;

  if (loading)
    return (
      <aside
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
        } fixed left-2 top-15 bg-background w-75 rounded-lg h-[90vh] p-2 overflow-y-auto transition-transform duration-300 lg:translate-x-0`}
      >
        <div className="flex justify-between text-primary-text items-center p-2 mb-4">
          <h2 className="font-bold">Your Library</h2>
          <Link href="/upload">
            <Plus size={20} />
          </Link>
        </div>
        {[...Array(10)].map((_, index) => (
          <div key={index} className="flex gap-2 mb-4 animate-pulse">
            <div className="w-10 h-10 rounded-md bg-hover"></div>
            <div className="h-5 w-[80%] rounded-md bg-hover"></div>
          </div>
        ))}
      </aside>
    );

  return (
    <>
      {session ? (
        <div>
          <aside
            className={`${
              open ? "translate-x-0" : "-translate-x-full"
            } fixed left-2 z-50 top-15 bg-background w-75 rounded-lg h-[90vh] p-2 overflow-y-auto transition-transform duration-300 lg:translate-x-0`}
          >
            <div className="flex justify-between text-primary-text items-center p-2 mb-4">
              <h2 className="font-bold">Your Library</h2>
              <Link href="/upload">
                <Plus size={20} />
              </Link>
            </div>
            <UserSongs userId={user_id} />
          </aside>

          <button className="lg:hidden fixed bottom-23 left-5 bg-background w-12 h-12 grid place-items-center text-white rounded-full z-50 cursor-pointer">
            <PanelLeft onClick={() => setOpen(!open)} />
          </button>
        </div>
      ) : (
        <div>
          <aside
            className={`${
              open ? "translate-x-0" : "-translate-x-full"
            } fixed left-2 z-50 top-15 bg-background w-75 rounded-lg h-[90vh] p-2 overflow-y-auto transition-transform duration-300 lg:translate-x-0`}
          >
            <div className="py-8 text-center">
              <Link
                href="/login"
                className="bg-white px-6 py-2 rounded-full font-semibold hover:bg-text-secondary-text"
              >
                Login
              </Link>
              <p className="mt-4 text-white">Login to view your library</p>
            </div>
          </aside>

          <button className="lg:hidden fixed bottom-23 right-5 bg-background w-12 h-12 grid place-items-center text-white rounded-full z-50 cursor-pointer">
            <PanelLeft onClick={() => setOpen(!open)} />
          </button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
