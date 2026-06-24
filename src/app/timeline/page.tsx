import { Plus, Sparkles } from "lucide-react";

import { PageHeader, PageShell, TopNav } from "@/components/layout/page-shell";
import { LinkButton } from "@/components/ui/link-button";
import { Surface } from "@/components/ui/surface";
import { getPeople } from "@/src/features/people/data";

export default async function TimelinePage() {
  const people = await getPeople();
  const events = people.flatMap((person) =>
    person.timeline.map((event) => ({ ...event, person })),
  );

  return (
    <PageShell maxWidth="5xl" withAppNav>
      <TopNav />
      <PageHeader
        title="Timeline"
        description="Important moments in your journey."
        actions={
          <LinkButton href="/admin/people/new" size="sm">
            <Plus className="h-4 w-4" />
            Add Event
          </LinkButton>
        }
        className="[&_h1]:md:text-4xl [&_p]:text-sm [&_p]:leading-6"
      />
      <Surface padding="lg" className="bg-[#FFFDF9]">
        <div className="space-y-6 border-l border-[#D8C2B6] pl-6">
          {events.map((event) => (
            <article key={`${event.person.id}-${event.id}`} className="relative">
              <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#6E4B87]">
                <Sparkles className="h-2.5 w-2.5 text-white" />
              </span>
              <p className="text-xs font-semibold text-[#9B645C]">{event.date}</p>
              <h2 className="mt-1 font-bold">{event.title}</h2>
              <p className="mt-1 text-sm leading-6 text-[#6F5E57]">
                {event.description}
              </p>
              <p className="mt-1 text-xs font-semibold text-[#8A746B]">
                {event.person.name}
              </p>
            </article>
          ))}
        </div>
      </Surface>
    </PageShell>
  );
}
