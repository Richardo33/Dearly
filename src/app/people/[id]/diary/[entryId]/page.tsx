import { PageShell, TopNav } from "@/components/layout/page-shell";
import { notFound, redirect } from "next/navigation";
import { DiaryEditor } from "@/src/components/diary/diary-editor";
import { getPersonById } from "@/src/features/people/data";
import { getPersonPath } from "@/lib/person-path";
import { isAdminSession } from "@/src/lib/admin/session";

type DiaryEntryPageProps = {
  params: Promise<{
    entryId: string;
    id: string;
  }>;
};

export default async function DiaryEntryPage({ params }: DiaryEntryPageProps) {
  const { entryId, id } = await params;
  const person = await getPersonById(id);
  const isAdmin = await isAdminSession();

  if (!person) {
    notFound();
  }

  const personPath = getPersonPath(person);

  if (entryId === "new" && !isAdmin) {
    redirect(`${personPath}?tab=diary`);
  }

  if (id !== person.slug) {
    redirect(`${personPath}/diary/${entryId}`);
  }

  if (
    entryId !== "new" &&
    !person.diaryEntries.some((entry) => entry.id === entryId)
  ) {
    notFound();
  }

  return (
    <PageShell maxWidth="7xl" withAppNav>
      <TopNav backHref={`${personPath}?tab=diary`} backLabel="Back to Diary" />
      <DiaryEditor entryId={entryId} isAdmin={isAdmin} person={person} />
    </PageShell>
  );
}
