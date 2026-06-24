import { Gift, Plus } from "lucide-react";

import { PageHeader, PageShell, TopNav } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Surface } from "@/components/ui/surface";
import { getPeople } from "@/src/features/people/data";
import { isAdminSession } from "@/src/lib/admin/session";

export default async function WishlistPage() {
  const people = await getPeople();
  const isAdmin = await isAdminSession();
  const wishlist = people.flatMap((person) =>
    person.wishlist.map((item) => ({ ...item, person })),
  );

  return (
    <PageShell maxWidth="6xl" withAppNav>
      <TopNav />
      <PageHeader
        title="Wishlist"
        description="Things they casually mentioned, so you can remember later."
        actions={
          isAdmin ? (
          <LinkButton href="/admin/people/new" size="sm">
            <Plus className="h-4 w-4" />
            Add Wishlist Item
          </LinkButton>
          ) : null
        }
        className="[&_h1]:md:text-4xl [&_p]:text-sm [&_p]:leading-6"
      />
      <section className="grid gap-4 md:grid-cols-2">
        {wishlist.map((item) => (
          <Surface key={item.id} className="bg-[#FFFDF9]">
            <div className="flex items-start justify-between gap-4">
              <Gift className="h-5 w-5 text-[#D9798F]" />
              <Badge variant="outline">{item.status}</Badge>
            </div>
            <h2 className="mt-4 font-bold">{item.title}</h2>
            <p className="mt-1 text-sm text-[#6F5E57]">{item.person.name}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="muted">{item.category}</Badge>
              <Badge variant="accent">{item.priority}</Badge>
            </div>
          </Surface>
        ))}
      </section>
    </PageShell>
  );
}
