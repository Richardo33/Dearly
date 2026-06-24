import { PageShell, TopNav } from "@/components/layout/page-shell";
import { notFound } from "next/navigation";
import { DiaryEditor } from "@/src/components/diary/diary-editor";
import { getPeople } from "@/src/features/people/data";

type DiaryEntryPageProps = {
  params: Promise<{
    entryId: string;
    id: string;
  }>;
};

export default async function DiaryEntryPage({ params }: DiaryEntryPageProps) {
  const { entryId, id } = await params;
  const people = await getPeople();
  const person = people.find((item) => item.id === id);

  if (!person) {
    notFound();
  }

  return (
    <PageShell maxWidth="7xl" withAppNav>
      <TopNav backHref={`/people/${person.id}/diary`} backLabel="Back to Diary" />
      <DiaryEditor entryId={entryId} person={person} />
    </PageShell>
  );
}
