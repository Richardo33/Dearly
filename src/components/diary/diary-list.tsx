"use client";

import Link from "next/link";
import { BookOpenText, Heart, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { InputFrame } from "@/components/ui/field";
import { LinkButton } from "@/components/ui/link-button";
import { Surface } from "@/components/ui/surface";
import type { DiaryEntry, Person } from "@/src/types/person";

type DiaryListProps = {
  person: Person;
};

function getLocalEntries(personId: string): DiaryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawEntries = window.localStorage.getItem(`dearly.diary.${personId}`);

  if (!rawEntries) {
    return [];
  }

  try {
    return JSON.parse(rawEntries) as DiaryEntry[];
  } catch {
    return [];
  }
}

export function DiaryList({ person }: DiaryListProps) {
  const [query, setQuery] = useState("");
  const [localEntries] = useState(() => getLocalEntries(person.id));

  const entries = useMemo(() => {
    const entryMap = new Map<string, DiaryEntry>();

    for (const entry of person.diaryEntries) {
      entryMap.set(entry.id, entry);
    }

    for (const entry of localEntries) {
      entryMap.set(entry.id, entry);
    }

    return Array.from(entryMap.values());
  }, [localEntries, person.diaryEntries]);

  const filteredEntries = entries.filter((entry) => {
    const value = `${entry.title} ${entry.date} ${entry.content}`.toLowerCase();
    return value.includes(query.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <Surface padding="lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3D6D0]">
              <BookOpenText className="h-6 w-6 text-[#9B645C]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {person.nickname}&apos;s Diary
              </h1>
              <p className="mt-1 text-sm text-[#6F5E57]">
                Cari, baca, dan lanjutkan catatan kecil yang pernah disimpan.
              </p>
            </div>
          </div>

          <LinkButton href={`/people/${person.id}/diary/new`} className="w-full md:w-auto">
            <Plus className="h-4 w-4" />
            New Diary Entry
          </LinkButton>
        </div>

        <InputFrame className="mt-6 bg-[#FFFDF9] shadow-none">
          <Search className="h-5 w-5 text-[#9B8B83]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search diary entries..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#9B8B83]"
          />
          {query ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Clear search"
              onClick={() => setQuery("")}
            >
              <X className="h-3 w-3" />
            </Button>
          ) : null}
        </InputFrame>
      </Surface>

      <div className="grid gap-4">
        {filteredEntries.map((entry) => (
          <Link key={entry.id} href={`/people/${person.id}/diary/${entry.id}`}>
            <Surface className="grid gap-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md sm:grid-cols-[72px_1fr_auto] sm:items-center">
              <div className="w-fit rounded-2xl bg-[#FFF8F3] px-4 py-3 text-center sm:w-auto">
                <p className="text-lg font-bold text-[#3D2F2A]">
                  {entry.date.split(" ")[0]}
                </p>
                <p className="text-xs font-semibold text-[#9B645C]">
                  {entry.date.split(" ").slice(1).join(" ")}
                </p>
              </div>

              <div>
                <h2 className="font-bold">{entry.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#6F5E57]">
                  {entry.content}
                </p>
                <p className="mt-2 text-xs font-semibold text-[#9B645C]">
                  Mood: {entry.mood}
                </p>
                {entry.image ? (
                  <p className="mt-1 text-xs font-semibold text-[#D9798F]">
                    Has image
                  </p>
                ) : null}
              </div>

              {entry.image ? (
                <div
                  className="aspect-video w-full rounded-2xl bg-cover bg-center sm:h-20 sm:w-28"
                  style={{ backgroundImage: `url(${entry.image})` }}
                />
              ) : (
                <Heart className="h-5 w-5 text-[#C98276]" />
              )}
            </Surface>
          </Link>
        ))}
      </div>

      {filteredEntries.length === 0 ? (
        <Surface className="text-center">
          <p className="font-semibold">No diary entries found</p>
          <p className="mt-2 text-sm text-[#6F5E57]">
            Coba keyword lain atau buat entry baru untuk {person.nickname}.
          </p>
        </Surface>
      ) : null}
    </div>
  );
}
