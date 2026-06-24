import { BookOpenText, Search } from "lucide-react";

import { PageHeader, PageShell, TopNav } from "@/components/layout/page-shell";
import { InputFrame } from "@/components/ui/field";
import { Surface } from "@/components/ui/surface";
import { getPeople } from "@/src/features/people/data";

export default async function DiaryIndexPage() {
  const people = await getPeople();
  const entries = people.flatMap((person) =>
    person.diaryEntries.map((entry) => ({ ...entry, person })),
  );

  return (
    <PageShell maxWidth="6xl" withAppNav>
      <TopNav />
      <PageHeader
        title="Diary"
        description="All your stories and memories."
        className="[&_h1]:md:text-4xl [&_p]:text-sm [&_p]:leading-6"
      />
      <InputFrame className="mb-6 bg-[#FFFDF9] shadow-none">
        <Search className="h-4 w-4 text-[#9B8B83]" />
        <input
          placeholder="Search diary..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </InputFrame>
      <section className="grid gap-4">
        {entries.map((entry) => (
          <Surface key={entry.id} className="grid gap-4 md:grid-cols-[90px_1fr_140px] md:items-center">
            <div className="text-sm font-semibold text-[#9B645C]">{entry.date}</div>
            <div>
              <h2 className="font-bold">{entry.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#6F5E57]">
                {entry.content}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7C6A62]">
              <BookOpenText className="h-4 w-4 text-[#D9798F]" />
              {entry.person.nickname}
            </div>
          </Surface>
        ))}
      </section>
    </PageShell>
  );
}
