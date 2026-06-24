import { PageShell, TopNav } from "@/components/layout/page-shell";
import { PersonForm } from "@/src/components/people/person-form";

export default function NewPersonPage() {
  return (
    <PageShell maxWidth="4xl" withAppNav>
      <TopNav backHref="/admin/people" backLabel="Back to People" />
      <PersonForm
        title="Add New Person"
        description="Tambahkan profil baru ke Dearly."
        submitText="Save Person"
      />
    </PageShell>
  );
}
