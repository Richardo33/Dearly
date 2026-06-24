import { Search } from "lucide-react";

import { PageHeader, PageShell, TopNav } from "@/components/layout/page-shell";
import { InputFrame } from "@/components/ui/field";
import { Surface } from "@/components/ui/surface";
import { getPeople } from "@/src/features/people/data";

export default async function SearchPage() {
  const people = await getPeople();
  const diaryEntries = people.flatMap((person) =>
    person.diaryEntries.map((entry) => ({ ...entry, person })),
  );

  return (
    <PageShell maxWidth="6xl" withAppNav>
      <TopNav />
      <PageHeader
        title="Search Results"
        description="Find people, diary entries, wishlist items, and little things."
        className="[&_h1]:md:text-4xl [&_p]:text-sm [&_p]:leading-6"
      />
      <InputFrame className="mb-6 bg-[#FFFDF9] shadow-none">
        <Search className="h-4 w-4 text-[#9B8B83]" />
        <input
          placeholder="Search anything..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </InputFrame>
      <section className="space-y-4">
        {diaryEntries.map((entry) => (
          <Surface key={entry.id}>
            <p className="text-xs font-semibold text-[#9B645C]">
              Diary - {entry.person.name}
            </p>
            <h2 className="mt-1 font-bold">{entry.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#6F5E57]">
              {entry.content}
            </p>
          </Surface>
        ))}
      </section>
    </PageShell>
  );
}
