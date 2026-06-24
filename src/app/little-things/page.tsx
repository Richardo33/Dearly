import { Plus } from "lucide-react";

import { PageHeader, PageShell, TopNav } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Surface } from "@/components/ui/surface";
import { getPeople } from "@/src/features/people/data";

const colors = ["bg-[#FFF3D7]", "bg-[#F7DDE5]", "bg-[#E9DDF6]", "bg-[#F4E5D5]"];

export default async function LittleThingsPage() {
  const people = await getPeople();
  const notes = people.flatMap((person) =>
    person.littleThings.map((note) => ({ ...note, person })),
  );

  return (
    <PageShell maxWidth="7xl" withAppNav>
      <TopNav />
      <PageHeader
        title="Little Things"
        description="Tiny things you do not want to forget."
        actions={
          <LinkButton href="/admin/people/new" size="sm">
            <Plus className="h-4 w-4" />
            Add Note
          </LinkButton>
        }
        className="[&_h1]:md:text-4xl [&_p]:text-sm [&_p]:leading-6"
      />
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {notes.map((note, index) => (
          <Surface
            key={note.id}
            className={`${colors[index % colors.length]} min-h-40 rotate-[-1deg]`}
          >
            <Badge variant="outline">{note.category}</Badge>
            <p className="mt-5 font-semibold leading-7">{note.text}</p>
            <p className="mt-4 text-xs font-semibold text-[#8A746B]">
              {note.person.nickname}
            </p>
          </Surface>
        ))}
      </section>
    </PageShell>
  );
}
