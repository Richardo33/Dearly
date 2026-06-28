import { redirect } from "next/navigation";

import { PageShell, TopNav } from "@/components/layout/page-shell";
import { PersonForm } from "@/src/components/people/person-form";
import { isAdminSession } from "@/src/lib/admin/session";

export default async function NewPersonPage() {
  if (!(await isAdminSession())) {
    redirect("/people");
  }

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
