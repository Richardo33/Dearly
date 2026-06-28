import { notFound, redirect } from "next/navigation";

import { PageShell, TopNav } from "@/components/layout/page-shell";
import { PersonForm } from "@/src/components/people/person-form";
import { getPersonById } from "@/src/features/people/data";
import { isAdminSession } from "@/src/lib/admin/session";

type EditPersonPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPersonPage({ params }: EditPersonPageProps) {
  if (!(await isAdminSession())) {
    redirect("/people");
  }

  const { id } = await params;
  const person = await getPersonById(id);

  if (!person) {
    notFound();
  }

  return (
    <PageShell maxWidth="4xl" withAppNav>
      <TopNav backHref="/admin/people" backLabel="Back to People" />
      <PersonForm
        title="Edit Person"
        description="Ubah informasi profil yang tampil di public page."
        submitText="Save Changes"
        personId={person.id}
        defaultValues={{
          birthday: person.birthday,
          bio: person.description,
          location: person.location,
          name: person.name,
          nickname: person.nickname,
          photo: person.photo,
          relationship: person.relationship,
          status: person.status,
          tags: person.tags.join(", "),
        }}
      />
    </PageShell>
  );
}
