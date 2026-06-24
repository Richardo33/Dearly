import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  CalendarHeart,
  Gift,
  Heart,
  Images,
  MapPin,
  NotebookPen,
  Pencil,
  Sparkles,
} from "lucide-react";

import { PageShell, TopNav } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Surface } from "@/components/ui/surface";
import { ProfileDiarySection } from "@/src/components/diary/profile-diary-section";
import {
  FavoritesEditor,
  GalleryEditor,
  LittleThingsEditor,
  WishlistEditor,
} from "@/src/components/people/person-collection-editors";
import { PersonPhoto } from "@/src/components/people/person-photo";
import { getPersonById } from "@/src/features/people/data";
import { isAdminSession } from "@/src/lib/admin/session";
import { cn } from "@/lib/utils";
import { getPersonPath } from "@/lib/person-path";
import type { FavoriteItem, WishlistItem } from "@/src/types/person";

type PersonDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
};

const tabs = [
  { label: "Overview", value: "overview" },
  { label: "Favorites", value: "favorites" },
  { label: "Wishlist", value: "wishlist" },
  { label: "Diary", value: "diary" },
  { label: "Gallery", value: "gallery" },
  { label: "Timeline", value: "timeline" },
  { label: "Little Things", value: "little-things" },
] as const;

type DetailTab = (typeof tabs)[number]["value"];

function isDetailTab(value: string | undefined): value is DetailTab {
  return tabs.some((tab) => tab.value === value);
}

function groupByCategory<T extends { category: string }>(items: T[]) {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    groups[item.category] = groups[item.category] ?? [];
    groups[item.category].push(item);
    return groups;
  }, {});
}

export default async function PersonDetailPage({
  params,
  searchParams,
}: PersonDetailPageProps) {
  const { id } = await params;
  const { tab } = await searchParams;
  const activeTab = isDetailTab(tab) ? tab : "overview";
  const person = await getPersonById(id);
  const isAdmin = await isAdminSession();

  if (!person) {
    notFound();
  }
  const favoriteGroups = groupByCategory<FavoriteItem>(person.favorites);
  const wishlistGroups = groupByCategory<WishlistItem>(person.wishlist);
  const personPath = getPersonPath(person);

  if (id !== person.slug) {
    redirect(activeTab === "overview" ? personPath : `${personPath}?tab=${activeTab}`);
  }
  const derivedGalleryItems = [
    ...(person.photo
      ? [
          {
            id: "profile-photo",
            label: "Profile photo",
            source: "Profile",
            url: person.photo,
          },
        ]
      : []),
    ...person.diaryEntries
      .filter((entry) => entry.image)
      .map((entry) => ({
        id: entry.id,
        label: entry.title,
        source: entry.date,
        url: entry.image as string,
      })),
  ];
  const manualGalleryItems = person.gallery
    .filter((asset) => asset.sourceType === "gallery")
    .map((asset) => ({
      id: asset.id,
      label: asset.altText ?? "Gallery image",
      source: "Gallery",
      url: asset.url,
    }));
  const galleryItems = [...derivedGalleryItems, ...manualGalleryItems].filter(
    (item, index, items) =>
      items.findIndex((candidate) => candidate.url === item.url) === index,
  );

  return (
    <PageShell maxWidth="7xl" withAppNav>
      <TopNav backHref="/people" backLabel="Back" className="mb-6" />

      <section className="overflow-hidden rounded-[2rem] border border-[#E7D8CB] bg-white shadow-sm">
        <div className="relative bg-[#2B1D32] px-5 py-8 text-white sm:px-8">
          {isAdmin ? (
          <div className="absolute right-4 top-4 flex gap-2">
            <LinkButton
              href={`/admin/people/${person.id}/edit`}
              variant="outline"
              size="sm"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </LinkButton>
          </div>
          ) : null}

          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            <PersonPhoto
              alt={person.name}
              src={person.photo}
              className="h-32 w-32 rounded-full border-4 border-white/20 [background-image:var(--photo-url)] sm:h-40 sm:w-40"
            />
            <div className="max-w-3xl pr-20">
              <h1 className="text-4xl font-bold">{person.name}</h1>
              <p className="mt-1 text-sm text-white/70">
                {person.relationship} - {person.status}
              </p>
              <div className="mt-4 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
                <span className="inline-flex items-center gap-2">
                  <CalendarHeart className="h-4 w-4 text-[#F3A6B1]" />
                  {person.birthday}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#F3A6B1]" />
                  {person.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto border-b border-[#EFE3D8] px-4 py-3 text-sm font-semibold text-[#7C6A62]">
          {tabs.map((item) => (
            <Link
              key={item.value}
              href={`${personPath}?tab=${item.value}`}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 transition hover:bg-[#F8F1E8] hover:text-[#3D2F2A]",
                activeTab === item.value && "bg-[#F3D6D0] text-[#7C4F46]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 sm:p-5">
          {activeTab === "overview" ? (
            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <Surface padding="lg" className="bg-[#FFFDF9]">
                <h2 className="text-xl font-bold">About</h2>
                <p className="mt-3 leading-7 text-[#6F5E57]">
                  {person.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {person.tags.map((tag) => (
                    <Badge key={tag} variant="muted">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Surface>

              <Surface padding="lg" className="bg-[#FFFDF9]">
                <h2 className="text-xl font-bold">Profile Summary</h2>
                <div className="mt-4 grid gap-3 text-sm text-[#6F5E57]">
                  <p>
                    <span className="font-semibold text-[#3D2F2A]">
                      Relationship:
                    </span>{" "}
                    {person.relationship}
                  </p>
                  <p>
                    <span className="font-semibold text-[#3D2F2A]">
                      Diary entries:
                    </span>{" "}
                    {person.diaryEntries.length}
                  </p>
                  <p>
                    <span className="font-semibold text-[#3D2F2A]">
                      Wishlist items:
                    </span>{" "}
                    {person.wishlist.length}
                  </p>
                  <p>
                    <span className="font-semibold text-[#3D2F2A]">
                      Timeline events:
                    </span>{" "}
                    {person.timeline.length}
                  </p>
                  <p>
                    <span className="font-semibold text-[#3D2F2A]">
                      Gallery photos:
                    </span>{" "}
                    {galleryItems.length}
                  </p>
                </div>
              </Surface>

              <Surface padding="lg" className="bg-[#FFFDF9] lg:col-span-2">
                <h2 className="text-xl font-bold">Quick Access</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                  {tabs.slice(1).map((item) => (
                    <LinkButton
                      key={item.value}
                      href={`${personPath}?tab=${item.value}`}
                      variant="outline"
                    >
                      {item.label}
                    </LinkButton>
                  ))}
                </div>
              </Surface>
            </div>
          ) : null}

          {activeTab === "favorites" ? (
            <section className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <Heart className="h-5 w-5 text-[#D9798F]" />
                  Favorites by Category
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Object.entries(favoriteGroups).map(([category, favorites]) => (
                  <Surface key={category} className="bg-[#FFFDF9]">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase text-[#9B645C]">
                        {category}
                      </p>
                      <Badge variant="muted">
                        {favorites.length} item
                      </Badge>
                    </div>
                    <ul className="mt-4 max-h-64 divide-y divide-[#EFE3D8] overflow-y-auto rounded-2xl border border-[#EFE3D8] bg-white/45">
                      {favorites.map((favorite, favoriteIndex) => (
                        <li
                          key={`${favorite.category}-${favorite.value}`}
                          className="flex items-center gap-3 px-4 py-3"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F8F1E8] text-xs font-bold text-[#9B645C]">
                            {favoriteIndex + 1}
                          </span>
                          <p className="min-w-0 flex-1 truncate font-bold">
                            {favorite.value}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </Surface>
                ))}
              </div>
              {isAdmin ? (
                <FavoritesEditor
                  initialItems={person.favorites}
                  personId={person.id}
                />
              ) : null}
            </section>
          ) : null}

          {activeTab === "wishlist" ? (
            <section className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <Gift className="h-5 w-5 text-[#D9798F]" />
                  Wishlist by Category
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(wishlistGroups).map(([category, items]) => (
                  <Surface key={category} className="bg-[#FFFDF9]">
                    <p className="text-xs font-semibold uppercase text-[#9B645C]">
                      {category}
                    </p>
                    <div className="mt-4 space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-[#EFE3D8] p-3 text-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-semibold">{item.title}</p>
                            <Badge variant="outline">{item.status}</Badge>
                          </div>
                          <p className="mt-1 text-xs text-[#8A746B]">
                            Priority: {item.priority}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Surface>
                ))}
              </div>
              {isAdmin ? (
                <WishlistEditor
                  initialItems={person.wishlist}
                  personId={person.id}
                />
              ) : null}
            </section>
          ) : null}

          {activeTab === "diary" ? (
            <ProfileDiarySection isAdmin={isAdmin} person={person} />
          ) : null}

          {activeTab === "gallery" ? (
            <section className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <Images className="h-5 w-5 text-[#D9798F]" />
                  Gallery
                </h2>
              </div>

              {galleryItems.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryItems.map((item) => (
                    <Surface key={item.id} className="bg-[#FFFDF9]">
                      <div
                        className="aspect-[4/3] rounded-2xl bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.url})` }}
                      />
                      <p className="mt-4 font-bold">{item.label}</p>
                      <p className="mt-1 text-xs font-semibold text-[#9B645C]">
                        {item.source}
                      </p>
                    </Surface>
                  ))}
                </div>
              ) : (
                <Surface className="border-dashed bg-[#FFFDF9] text-center">
                  <Images className="mx-auto mb-3 h-8 w-8 text-[#D9798F]" />
                  <p className="font-bold">No photos yet</p>
                  <p className="mt-1 text-sm text-[#6F5E57]">
                    Upload a profile photo or add images in diary entries.
                  </p>
                </Surface>
              )}
              {isAdmin ? (
                <GalleryEditor
                  initialItems={person.gallery}
                  personId={person.id}
                />
              ) : null}
            </section>
          ) : null}

          {activeTab === "timeline" ? (
            <Surface padding="lg" className="bg-[#FFFDF9]">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Sparkles className="h-5 w-5 text-[#D9798F]" />
                Timeline
              </h2>
              <div className="mt-5 space-y-6 border-l border-[#D8C2B6] pl-6">
                {person.timeline.map((event) => (
                  <article key={event.id} className="relative">
                    <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-[#6E4B87]" />
                    <p className="text-xs font-semibold text-[#9B645C]">
                      {event.date}
                    </p>
                    <h3 className="mt-1 font-bold">{event.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#6F5E57]">
                      {event.description}
                    </p>
                  </article>
                ))}
              </div>
            </Surface>
          ) : null}

          {activeTab === "little-things" ? (
            <section className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {person.littleThings.map((note) => (
                  <Surface key={note.id} className="min-h-36 bg-[#FFFDF9]">
                    <NotebookPen className="mb-4 h-5 w-5 text-[#D9798F]" />
                    <Badge variant="outline">{note.category}</Badge>
                    <p className="mt-4 font-semibold leading-7">{note.text}</p>
                  </Surface>
                ))}
              </div>
              {isAdmin ? (
                <LittleThingsEditor
                  initialItems={person.littleThings}
                  personId={person.id}
                />
              ) : null}
            </section>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
