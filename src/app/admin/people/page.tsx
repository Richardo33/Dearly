import { Pencil, Plus } from "lucide-react";

import { PageHeader, PageShell, TopNav } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Surface } from "@/components/ui/surface";
import { DeletePersonButton } from "@/src/components/people/delete-person-button";
import { PersonPhoto } from "@/src/components/people/person-photo";
import { getPeople } from "@/src/features/people/data";

export default async function AdminPeoplePage() {
  const people = await getPeople();

  return (
    <PageShell maxWidth="7xl" withAppNav>
      <TopNav backHref="/admin" backLabel="Back to Admin" />

      <PageHeader
        title="People"
        description="Create, archive, and manage profiles."
        actions={
          <LinkButton href="/admin/people/new" className="w-full md:w-fit">
            <Plus className="h-4 w-4" />
            Add Person
          </LinkButton>
        }
        className="[&_h1]:md:text-4xl [&_p]:text-sm [&_p]:leading-6"
      />

      <section className="grid gap-4 lg:grid-cols-2">
        {people.map((person) => (
          <Surface
            key={person.id}
            className="grid gap-5 bg-[#FFFDF9] sm:grid-cols-[120px_1fr] sm:items-center"
          >
            <PersonPhoto
              alt={person.name}
              src={person.photo}
              className="aspect-square rounded-[1.25rem] [background-image:var(--photo-url)]"
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">{person.name}</h2>
                  <p className="text-xs font-semibold text-[#9B645C]">
                    @{person.nickname}
                  </p>
                </div>
                <Badge variant={person.status === "Active" ? "accent" : "outline"}>
                  {person.status}
                </Badge>
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#6F5E57]">
                {person.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <LinkButton
                  href={`/admin/people/${person.id}/edit`}
                  variant="secondary"
                  size="sm"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </LinkButton>
                <DeletePersonButton personId={person.id} personName={person.name} />
              </div>
            </div>
          </Surface>
        ))}
      </section>
    </PageShell>
  );
}
