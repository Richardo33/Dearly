"use client";

import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputFrame } from "@/components/ui/field";
import { LinkButton } from "@/components/ui/link-button";
import { PersonCard } from "@/src/components/people/person-card";
import type { Person, PersonStatus } from "@/src/types/person";

const filters: Array<"All" | PersonStatus> = [
  "All",
  "Active",
  "Archived",
  "Hidden",
];

type PeopleDirectoryProps = {
  isAdmin?: boolean;
  people: Person[];
};

export function PeopleDirectory({ isAdmin = false, people }: PeopleDirectoryProps) {
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");

  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      const matchesFilter =
        activeFilter === "All" || person.status === activeFilter;
      const searchableText = [
        person.name,
        person.nickname,
        person.relationship,
        person.description,
        person.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return matchesFilter && searchableText.includes(query.toLowerCase());
    });
  }, [activeFilter, people, query]);

  return (
    <>
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_400px] lg:items-center">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter}
              type="button"
              variant={activeFilter === filter ? "secondary" : "outline"}
              size="sm"
              className={activeFilter === filter ? "bg-[#F3D6D0] text-[#7C4F46]" : ""}
              onClick={() => setActiveFilter(filter)}
            >
              {filter} (
              {filter === "All"
                ? people.length
                : people.filter((person) => person.status === filter).length}
              )
            </Button>
          ))}
        </div>

        <InputFrame className="w-full bg-[#FFFDF9] shadow-none">
          <Search className="h-4 w-4 text-[#9B8B83]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search people..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#9B8B83]"
          />
        </InputFrame>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {filteredPeople.map((person) => (
          <PersonCard key={person.id} isAdmin={isAdmin} person={person} />
        ))}

        {isAdmin ? (
          <LinkButton
            href="/admin/people/new"
            variant="outline"
            className="min-h-80 flex-col border-dashed bg-[#FFF8F3]"
          >
            <Plus className="h-7 w-7" />
            Add New
            <span className="text-xs font-normal text-[#8A746B]">Someone</span>
          </LinkButton>
        ) : null}
      </section>

      {filteredPeople.length === 0 ? (
        <div className="mt-6 rounded-[2rem] border border-dashed border-[#D9C9BC] bg-[#FFFDF9] p-8 text-center">
          <Badge variant="outline">No result</Badge>
          <p className="mt-3 font-semibold">No people yet.</p>
          <p className="mt-1 text-sm text-[#7C6A62]">
            Run `supabase/seed.sql` or add a new person from the admin page.
          </p>
        </div>
      ) : null}
    </>
  );
}
