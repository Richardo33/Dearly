"use client";

import Link from "next/link";
import { BookOpenText, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { InputFrame } from "@/components/ui/field";
import { LinkButton } from "@/components/ui/link-button";
import { Surface } from "@/components/ui/surface";
import { getPersonPath } from "@/lib/person-path";
import type { Person } from "@/src/types/person";

type ProfileDiarySectionProps = {
  isAdmin?: boolean;
  person: Person;
};

export function ProfileDiarySection({
  isAdmin = false,
  person,
}: ProfileDiarySectionProps) {
  const [query, setQuery] = useState("");
  const personPath = getPersonPath(person);
  const normalizedQuery = query.trim().toLowerCase();

  const entries = useMemo(() => {
    return [...person.diaryEntries].sort((firstEntry, secondEntry) =>
      secondEntry.date.localeCompare(firstEntry.date),
    );
  }, [person.diaryEntries]);

  const filteredEntries = useMemo(() => {
    if (!normalizedQuery) {
      return entries;
    }

    return entries.filter((entry) => {
      const haystack = [
        entry.title,
        entry.date,
        entry.content,
        entry.mood,
        ...entry.tags,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [entries, normalizedQuery]);

  return (
    <section className="space-y-4">
      <Surface padding="lg" className="bg-[#FFFDF9]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <BookOpenText className="h-5 w-5 text-[#D9798F]" />
              Diary Entries
            </h2>
            <p className="mt-2 text-sm text-[#6F5E57]">
              Cari dan baca catatan kecil tanpa keluar dari profile ini.
            </p>
          </div>
          {isAdmin ? (
            <LinkButton href={`${personPath}/diary/new`}>
              <Plus className="h-4 w-4" />
              Add Diary Entry
            </LinkButton>
          ) : null}
        </div>

        <InputFrame
          className="mt-5 bg-[#FFFDF9]"
          icon={<Search className="h-5 w-5 text-[#9B8B83]" />}
        >
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search diary entries..."
            className="min-w-0 flex-1 bg-transparent text-sm text-[#3D2F2A] outline-none placeholder:text-[#9B8B83]"
          />
        </InputFrame>
      </Surface>

      {filteredEntries.length > 0 ? (
        filteredEntries.map((entry) => (
          <Link
            key={entry.id}
            href={`${personPath}/diary/${entry.id}`}
            className="block rounded-[2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98276]/25"
          >
            <Surface className="grid gap-4 bg-[#FFFDF9] transition hover:-translate-y-0.5 hover:border-[#D9B7AD] hover:shadow-md md:grid-cols-[1fr_220px] md:items-center">
              <div>
                <p className="text-xs font-semibold text-[#9B645C]">
                  {entry.date} - Mood: {entry.mood}
                </p>
                <h2 className="mt-1 font-bold">{entry.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#6F5E57]">
                  {entry.content}
                </p>
              </div>
              {entry.image ? (
                <div
                  className="aspect-video rounded-2xl bg-cover bg-center"
                  style={{ backgroundImage: `url(${entry.image})` }}
                />
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-[#D9C9BC] text-xs font-semibold text-[#8A746B]">
                  No image
                </div>
              )}
            </Surface>
          </Link>
        ))
      ) : (
        <Surface className="border-dashed bg-[#FFFDF9] text-center">
          <BookOpenText className="mx-auto mb-3 h-8 w-8 text-[#D9798F]" />
          <p className="font-bold">No diary entries found</p>
          <p className="mt-1 text-sm text-[#6F5E57]">
            Coba keyword lain atau tambah catatan baru.
          </p>
        </Surface>
      )}
    </section>
  );
}
