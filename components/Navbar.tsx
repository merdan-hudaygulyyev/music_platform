"use client";

import useUserSession from "@/custom-hooks/useUserSession";

import Image from "next/image";
import Link from "next/link";

import { HomeIcon, Search } from "lucide-react";

import logoutUser from "@/lib/auth/logoutUser";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { session, loading } = useUserSession();

  const router = useRouter();

  const handleLogout = async () => {
    const res = await logoutUser();

    if (res?.error) {
      router.push("/");
    }
  };

  return (
    <nav className="h-15 flex justify-between items-center px-6 fixed top-0 left-0 w-full bg-black z-100">
      <div className="flex gap-6 items-center">
        <Image
          src="/images/s_logo.png"
          alt="Logo"
          width={500}
          height={500}
          className="w-9 h-9"
        />
        <Link
          href="/"
          className="bg-background w-11 h-11 grid place-items-center text-white text-3xl rounded-full"
        >
          <HomeIcon />
        </Link>
        <div className="bg-background hidden lg:flex items-center gap-3 px-3 h-11 w-90 text-primary-text rounded-full">
          <Search className="text-primary-text shrink-0" size={22} />
          <input
            className="h-full w-full outline-none placeholder:text-primary-text"
            type="text"
            placeholder="What do you want to play?"
          />
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="hidden lg:flex gap-2 text-secondary-text font-bold border-r-2 border-primary-text pr-6">
          <a href="#" className="hover:text-primary-text">
            Premium
          </a>
          <a href="#" className="hover:text-primary-text">
            Support
          </a>
          <a href="#" className="hover:text-primary-text">
            Dowload
          </a>
        </div>
        <div>
          {!loading && (
            <>
              {session ? (
                <button
                  onClick={handleLogout}
                  className="cursor-pointer h-11 grid px-5 place-items-center bg-white text-gray-950 rounded-full font-bold hover:bg-secondary-text"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="h-11 grid px-5 place-items-center bg-white text-gray-950 rounded-full font-bold hover:bg-secondary-text"
                >
                  Login
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
