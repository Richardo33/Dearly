import {
  BookOpenText,
  Gift,
  Heart,
  Image,
  ListTodo,
  Sparkles,
  Users,
} from "lucide-react";

import { PageHeader, PageShell, TopNav } from "@/components/layout/page-shell";
import { LinkButton } from "@/components/ui/link-button";
import { Surface } from "@/components/ui/surface";
import { getDashboardStats, getPeople } from "@/src/features/people/data";
import { isAdminSession } from "@/src/lib/admin/session";

const statIcons = [Users, Heart, Gift, Sparkles, ListTodo, Image];

export default async function AdminPage() {
  const isAdmin = await isAdminSession();
  const people = await getPeople();
  const dashboardStats = await getDashboardStats();
  const recentEntries = people.flatMap((person) =>
    person.diaryEntries.map((entry) => ({ ...entry, person: person.nickname })),
  );

  return (
    <PageShell maxWidth="7xl" withAppNav>
      <TopNav
        brandLabel="Dearly"
        action={
          isAdmin ? (
            <LinkButton href="/admin/people/new" size="sm">
              Add Person
            </LinkButton>
          ) : null
        }
      />

      <PageHeader
        title="Dashboard"
        description={
          isAdmin
            ? "Overview of your data."
            : "Demo overview. Login as admin to manage real data."
        }
        className="[&_h1]:md:text-4xl [&_p]:text-sm [&_p]:leading-6"
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardStats.map((stat, index) => {
          const Icon = statIcons[index] ?? BookOpenText;

          return (
            <Surface key={stat.label} padding="lg" className="bg-[#FFFDF9]">
              <Icon className="mb-4 h-6 w-6 text-[#D9798F]" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="mt-1 text-sm text-[#7C6A62]">{stat.label}</p>
            </Surface>
          );
        })}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <Surface padding="lg" className="bg-[#FFFDF9]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">People I Care About</h2>
            <LinkButton href="/people" variant="link">
              View all
            </LinkButton>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {people.length > 0
              ? people.slice(0, 3).map((person) => (
                  <div
                    key={person.id}
                    className="rounded-2xl border border-[#EFE3D8] p-3"
                  >
                    <div
                      className="aspect-[4/3] rounded-xl bg-cover bg-center"
                      style={{ backgroundImage: `url(${person.photo})` }}
                    />
                    <p className="mt-3 font-bold">{person.name}</p>
                    <p className="text-xs text-[#8A746B]">
                      {person.relationship}
                    </p>
                  </div>
                ))
              : (
                  <div className="rounded-2xl border border-dashed border-[#D9C9BC] p-5 text-sm text-[#7C6A62] md:col-span-3">
                    No people yet. Run the seed script or add your first person.
                  </div>
                )}
          </div>
        </Surface>

        <Surface padding="lg" className="bg-[#FFFDF9]">
          <h2 className="text-xl font-bold">Recent Diary Entries</h2>
          <div className="mt-5 space-y-4">
            {recentEntries.length > 0
              ? recentEntries.slice(0, 4).map((entry) => (
                  <div
                    key={entry.id}
                    className="border-b border-[#EFE3D8] pb-3 last:border-0"
                  >
                    <p className="text-xs font-semibold text-[#9B645C]">
                      {entry.date} - {entry.person}
                    </p>
                    <p className="mt-1 font-semibold">{entry.title}</p>
                  </div>
                ))
              : (
                  <p className="text-sm text-[#7C6A62]">
                    No diary entries yet.
                  </p>
                )}
          </div>
        </Surface>
      </section>
    </PageShell>
  );
}
