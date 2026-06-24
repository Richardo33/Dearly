import Link from "next/link";
import { BookHeart, Heart, LockKeyhole, Sparkles } from "lucide-react";

import { appConfig } from "@/src/constants/app";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFF8F4] px-4 py-4 text-[#322439] sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col rounded-[2rem] border border-[#F0DFD8] bg-white/70 p-5 shadow-sm sm:p-8">
        <nav className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            Dearly
            <Heart className="h-4 w-4 text-[#D9798F]" />
          </Link>

          <div className="hidden items-center gap-6 text-sm font-semibold text-[#6F5E57] md:flex">
            <Link href="/">Home</Link>
            <Link href="/people">People</Link>
            <Link href="/admin">Dashboard</Link>
          </div>

          <Link
            href="/admin/login"
            className="rounded-full bg-[#2B1D32] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Admin Login
          </Link>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              A place to remember the{" "}
              <span className="text-[#D9798F]">people</span> who matter.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#6F5E57] sm:text-base">
              {appConfig.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/people"
                className="rounded-full bg-[#2B1D32] px-6 py-3 text-sm font-semibold text-white"
              >
                View People
              </Link>
              <Link
                href="/wishlist"
                className="rounded-full border border-[#E7D8CB] bg-white/80 px-6 py-3 text-sm font-semibold"
              >
                How it works
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="rotate-[-8deg] rounded-[1.5rem] border border-[#D1A6A0] bg-[#9B6268] p-8 text-white shadow-2xl">
              <BookHeart className="mb-20 h-10 w-10 text-[#F4C0C8]" />
              <p className="text-2xl font-bold">Memory Binder</p>
              <p className="mt-2 text-sm text-white/75">
                Favorites, diary, wishlist, timeline, and little things.
              </p>
            </div>
            <div className="absolute -bottom-6 -left-4 rotate-[-6deg] rounded-2xl bg-white p-3 shadow-xl">
              <div className="h-28 w-24 rounded-xl bg-[url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80')] bg-cover bg-center" />
            </div>
            <div className="absolute -right-2 top-8 rounded-full bg-[#F3D6D0] p-4 shadow-lg">
              <Sparkles className="h-6 w-6 text-[#9B645C]" />
            </div>
          </div>
        </div>

        <section className="grid gap-3 rounded-[1.5rem] bg-[#FFFDF9] p-4 sm:grid-cols-3">
          {[
            ["All in one place", "Store everything about them in one beautiful space."],
            ["Easy to remember", "Organized, searchable, and always accessible."],
            ["Private & secure", "Your memories are safe and only you can manage them."],
          ].map(([title, description]) => (
            <div key={title} className="flex gap-3 rounded-2xl p-3">
              <LockKeyhole className="h-5 w-5 shrink-0 text-[#D9798F]" />
              <div>
                <p className="font-bold">{title}</p>
                <p className="mt-1 text-xs leading-5 text-[#7C6A62]">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
