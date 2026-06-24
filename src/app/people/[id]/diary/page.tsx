import { PageShell, TopNav } from "@/components/layout/page-shell";
import { notFound } from "next/navigation";
import { DiaryList } from "@/src/components/diary/diary-list";
import { getPeople } from "@/src/features/people/data";

type DiaryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DiaryPage({ params }: DiaryPageProps) {
  const { id } = await params;
  const people = await getPeople();
  const person = people.find((item) => item.id === id);

  if (!person) {
    notFound();
  }

  return (
    <PageShell maxWidth="4xl" withAppNav>
      <TopNav backHref={`/people/${person.id}`} backLabel="Back to Profile" />
      <DiaryList person={person} />
    </PageShell>
  );
}
