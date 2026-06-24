import { Plus } from "lucide-react";

import { PageHeader, PageShell, TopNav } from "@/components/layout/page-shell";
import { LinkButton } from "@/components/ui/link-button";
import { PeopleDirectory } from "@/src/components/people/people-directory";
import { getPeople } from "@/src/features/people/data";
import { isAdminSession } from "@/src/lib/admin/session";

export default async function PeoplePage() {
  const people = await getPeople();
  const isAdmin = await isAdminSession();

  return (
    <PageShell withAppNav>
      <TopNav
        action={
          isAdmin ? (
          <LinkButton href="/admin/people/new" size="sm">
            <Plus className="h-4 w-4" />
            Add Person
          </LinkButton>
          ) : null
        }
      />

      <PageHeader
        title="People"
        description="All the people you have added."
        className="[&_h1]:md:text-4xl [&_p]:text-sm [&_p]:leading-6"
      />

      <PeopleDirectory isAdmin={isAdmin} people={people} />
    </PageShell>
  );
}
