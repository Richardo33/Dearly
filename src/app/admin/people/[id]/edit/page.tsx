import { notFound } from "next/navigation";

import { PageShell, TopNav } from "@/components/layout/page-shell";
import { PersonForm } from "@/src/components/people/person-form";
import { getPersonById } from "@/src/features/people/data";

type EditPersonPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPersonPage({ params }: EditPersonPageProps) {
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
          favorites: person.favorites,
          gallery: person.gallery,
          location: person.location,
          name: person.name,
          nickname: person.nickname,
          photo: person.photo,
          relationship: person.relationship,
          status: person.status,
          tags: person.tags.join(", "),
          wishlist: person.wishlist,
        }}
      />
    </PageShell>
  );
}
