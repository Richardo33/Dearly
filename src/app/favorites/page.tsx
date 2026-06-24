import { Heart, Plus } from "lucide-react";

import { PageHeader, PageShell, TopNav } from "@/components/layout/page-shell";
import { LinkButton } from "@/components/ui/link-button";
import { Surface } from "@/components/ui/surface";
import { getPeople } from "@/src/features/people/data";
import { isAdminSession } from "@/src/lib/admin/session";

export default async function FavoritesPage() {
  const people = await getPeople();
  const isAdmin = await isAdminSession();
  const favorites = people.flatMap((person) =>
    person.favorites.map((favorite) => ({ ...favorite, person })),
  );

  return (
    <PageShell maxWidth="7xl" withAppNav>
      <TopNav />
      <PageHeader
        title="Favorites"
        description="All the things they love."
        actions={
          isAdmin ? (
          <LinkButton href="/admin/people/new" size="sm">
            <Plus className="h-4 w-4" />
            Add Favorite
          </LinkButton>
          ) : null
        }
        className="[&_h1]:md:text-4xl [&_p]:text-sm [&_p]:leading-6"
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {favorites.map((favorite) => (
          <Surface key={`${favorite.person.id}-${favorite.category}-${favorite.value}`}>
            <Heart className="mb-4 h-5 w-5 text-[#D9798F]" />
            <p className="text-xs font-semibold text-[#9B645C]">{favorite.category}</p>
            <h2 className="mt-1 font-bold">{favorite.value}</h2>
            <p className="mt-4 text-xs font-semibold text-[#8A746B]">
              {favorite.person.name}
            </p>
          </Surface>
        ))}
      </section>
    </PageShell>
  );
}
