"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PageHeader } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { LinkButton } from "@/components/ui/link-button";
import { MediaUpload } from "@/components/ui/media-upload";
import { Surface } from "@/components/ui/surface";
import { createPersonSlug } from "@/lib/person-path";

type PersonFormValues = {
  birthday?: string;
  bio?: string;
  location?: string;
  name?: string;
  nickname?: string;
  photo?: string;
  relationship?: string;
  status?: string;
  tags?: string;
};

type PersonFormProps = {
  description: string;
  defaultValues?: PersonFormValues;
  personId?: string;
  submitText: string;
  title: string;
};

const selectClassName =
  "w-full rounded-2xl border border-[#E7D8CB] bg-[#FFFDF9] px-4 py-3 text-sm text-[#3D2F2A] outline-none transition focus:border-[#C98276] focus:ring-2 focus:ring-[#C98276]/15";

export function PersonForm({
  title,
  description,
  submitText,
  defaultValues,
  personId,
}: PersonFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      birthday: String(formData.get("birthday") ?? ""),
      description: String(formData.get("description") ?? ""),
      location: String(formData.get("location") ?? ""),
      name: String(formData.get("name") ?? ""),
      nickname: String(formData.get("nickname") ?? ""),
      photoUrl: String(formData.get("photo") ?? ""),
      relationship: String(formData.get("relationship") ?? "Other"),
      status: String(formData.get("status") ?? "Active"),
      tags: String(formData.get("tags") ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    const response = await fetch(
      personId ? `/api/admin/people/${personId}` : "/api/admin/people",
      {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        method: personId ? "PATCH" : "POST",
      },
    );
    const result = (await response.json().catch(() => null)) as {
      id?: string;
      message?: string;
    } | null;

    setIsSaving(false);

    if (!response.ok) {
      setError(result?.message ?? "Failed to save person.");
      return;
    }

    router.push(result?.id ? `/people/${createPersonSlug(payload.name)}` : "/admin/people");
    router.refresh();
  };

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        className="md:items-start [&_h1]:md:text-4xl [&_p]:text-base [&_p]:leading-7"
      />

      <Surface padding="lg">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Name">
              <Input
                name="name"
                required
                type="text"
                placeholder="Nadya Saputri"
                defaultValue={defaultValues?.name}
              />
            </Field>

            <Field label="Nickname">
              <Input
                name="nickname"
                required
                type="text"
                placeholder="Nadya"
                defaultValue={defaultValues?.nickname}
              />
            </Field>

            <Field label="Relationship Type">
              <select
                name="relationship"
                className={selectClassName}
                defaultValue={defaultValues?.relationship ?? "Other"}
              >
                {["Partner", "Crush", "Ex", "Friend", "Family", "Other"].map(
                  (item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ),
                )}
              </select>
            </Field>

            <Field label="Status">
              <select
                name="status"
                className={selectClassName}
                defaultValue={defaultValues?.status ?? "Active"}
              >
                {["Active", "Archived", "Hidden"].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Birthday">
              <Input
                name="birthday"
                type="text"
                placeholder="12 Mei"
                defaultValue={defaultValues?.birthday}
              />
            </Field>

            <Field label="Profile Photo">
              <MediaUpload
                defaultUrl={defaultValues?.photo}
                folder="people"
                label="Upload profile photo"
                name="photo"
              />
            </Field>

            <Field label="Location">
              <Input
                name="location"
                type="text"
                placeholder="Indonesia"
                defaultValue={defaultValues?.location}
              />
            </Field>

            <Field label="Short Bio" className="md:col-span-2">
              <Textarea
                name="description"
                rows={4}
                placeholder="Suka matcha, lagu akustik, dan cerita random malam hari."
                defaultValue={defaultValues?.bio}
              />
            </Field>

            <Field
              label="Tags"
              hint="Pisahkan tags dengan koma."
              className="md:col-span-2"
            >
              <Input
                name="tags"
                type="text"
                placeholder="Matcha, Purple, Acoustic"
                defaultValue={defaultValues?.tags}
              />
            </Field>
          </div>

          {error ? (
            <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col justify-end gap-3 sm:flex-row">
            <LinkButton href="/admin/people" variant="outline" size="lg">
              Cancel
            </LinkButton>

            <Button type="submit" size="lg" disabled={isSaving}>
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : submitText}
            </Button>
          </div>
        </form>
      </Surface>
    </>
  );
}
