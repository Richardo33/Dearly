import { notFound, redirect } from "next/navigation";
import { getPersonById } from "@/src/features/people/data";
import { getPersonPath } from "@/lib/person-path";

type DiaryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DiaryPage({ params }: DiaryPageProps) {
  const { id } = await params;
  const person = await getPersonById(id);

  if (!person) {
    notFound();
  }

  const personPath = getPersonPath(person);
  redirect(`${personPath}?tab=diary`);
}
