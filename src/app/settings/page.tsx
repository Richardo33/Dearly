import { Download, KeyRound, ShieldAlert } from "lucide-react";

import { PageHeader, PageShell, TopNav } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Surface } from "@/components/ui/surface";

export default function SettingsPage() {
  return (
    <PageShell maxWidth="5xl" withAppNav>
      <TopNav />
      <PageHeader
        title="Settings"
        description="Security and account preferences."
        className="[&_h1]:md:text-4xl [&_p]:text-sm [&_p]:leading-6"
      />
      <div className="grid gap-5">
        <Surface padding="lg" className="bg-[#FFFDF9]">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <KeyRound className="h-5 w-5 text-[#D9798F]" />
            Change Admin Code
          </h2>
          <form className="mt-5 grid gap-4">
            <Field label="Current Code">
              <Input type="password" />
            </Field>
            <Field label="New Code">
              <Input type="password" />
            </Field>
            <Button className="w-fit">Update Code</Button>
          </form>
        </Surface>

        <Surface padding="lg" className="bg-[#FFFDF9]">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Download className="h-5 w-5 text-[#D9798F]" />
            Data Management
          </h2>
          <p className="mt-2 text-sm text-[#6F5E57]">
            Export or delete local data once Supabase is connected.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="outline">Export Data</Button>
            <Button variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              Delete All Data
            </Button>
          </div>
        </Surface>
      </div>
    </PageShell>
  );
}
