"use client";

import { useRouter } from "next/navigation";
import { BookOpenText, Check, MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { MediaUpload } from "@/components/ui/media-upload";
import type { DiaryEntry, Person } from "@/src/types/person";
import { cn } from "@/lib/utils";

type DiaryEditorProps = {
  entryId: string;
  person: Person;
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTodayLabel() {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

function getLocalEntries(personId: string): DiaryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawEntries = window.localStorage.getItem(`dearly.diary.${personId}`);

  if (!rawEntries) {
    return [];
  }

  try {
    return JSON.parse(rawEntries) as DiaryEntry[];
  } catch {
    return [];
  }
}

function saveLocalEntry(personId: string, entry: DiaryEntry) {
  const entries = getLocalEntries(personId);
  const nextEntries = entries.filter((item) => item.id !== entry.id);
  nextEntries.unshift(entry);
  window.localStorage.setItem(
    `dearly.diary.${personId}`,
    JSON.stringify(nextEntries),
  );
}

export function DiaryEditor({ entryId, person }: DiaryEditorProps) {
  const router = useRouter();

  const initialEntry = useMemo(() => {
    const entries = [...getLocalEntries(person.id), ...person.diaryEntries];
    return entries.find((entry) => entry.id === entryId);
  }, [entryId, person.diaryEntries, person.id]);

  const [date, setDate] = useState(initialEntry?.date ?? getTodayLabel());
  const [title, setTitle] = useState(initialEntry?.title ?? "");
  const [content, setContent] = useState(initialEntry?.content ?? "");
  const [image, setImage] = useState(initialEntry?.image ?? "");
  const [mood, setMood] = useState(initialEntry?.mood ?? "Happy");
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  const handleSave = () => {
    const savedEntryId =
      initialEntry?.id || toSlug(title) || `entry-${Date.now().toString()}`;

    const entry = {
      id: savedEntryId,
      date,
      title: title || "Untitled diary entry",
      content,
      mood,
      tags: initialEntry?.tags ?? [],
      isPublic: initialEntry?.isPublic ?? false,
      image,
    };

    saveLocalEntry(person.id, entry);
    setStatus("saved");

    window.setTimeout(() => {
      router.replace(`/people/${person.id}/diary/${entry.id}`);
      setStatus("idle");
    }, 500);
  };

  return (
    <div className="rounded-[1.5rem] border border-[#CBB6A7] bg-[#6E5749] p-2 shadow-2xl sm:rounded-[2rem] sm:p-3">
      <div className="grid overflow-hidden rounded-[1.25rem] bg-[#FFF8F0] shadow-inner sm:rounded-[1.5rem] lg:grid-cols-2">
        <section className="min-h-[520px] border-b border-[#E8D8C8] bg-[#FFFDF8] p-4 sm:p-6 lg:min-h-[560px] lg:border-b-0 lg:border-r">
          <div className="mb-6 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Back to diary"
              onClick={() => router.push(`/people/${person.id}/diary`)}
            >
              <BookOpenText className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleSave}
              >
                {status === "saved" ? (
                  <Check className="h-4 w-4" />
                ) : null}
                {status === "saved" ? "Saved" : "Save"}
              </Button>
              <Button type="button" variant="ghost" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase text-[#9B645C]">
                Date
              </span>
              <Input
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase text-[#9B645C]">
                Title
              </span>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Hari yang menyenangkan"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase text-[#9B645C]">
                Mood
              </span>
              <Input
                value={mood}
                onChange={(event) => setMood(event.target.value)}
                placeholder="Happy"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase text-[#9B645C]">
                Image
              </span>
              <MediaUpload
                defaultUrl={image}
                folder="diary"
                label="Upload diary image"
                name="image"
                onUploaded={setImage}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase text-[#9B645C]">
                Story
              </span>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Mulai menulis cerita kecil hari ini..."
                className={cn(
                  "min-h-72 w-full resize-none rounded-2xl border border-[#E7D8CB] bg-transparent px-4 py-3 text-sm leading-8 text-[#3D2F2A] outline-none sm:min-h-80",
                  "bg-[linear-gradient(transparent_31px,#ECDCCB_32px)] bg-[length:100%_32px] focus:border-[#C98276] focus:ring-2 focus:ring-[#C98276]/15",
                )}
              />
            </label>
          </div>
        </section>

        <aside className="relative hidden min-h-[560px] bg-[#FFF9EF] p-8 lg:block">
          <div className="absolute inset-y-0 left-0 w-px bg-[#D5BCA8]" />
          <div className="h-full rounded-2xl border border-dashed border-[#E4D1C0] bg-[linear-gradient(transparent_31px,#ECDCCB_32px)] bg-[length:100%_32px] p-6">
            <p className="text-sm font-semibold text-[#9B645C]">
              {date || "Tanggal diary"}
            </p>
            <h2 className="mt-3 text-2xl font-bold">
              {title || `${person.nickname}'s diary`}
            </h2>
            <p className="mt-2 text-xs font-semibold text-[#9B645C]">
              Mood: {mood}
            </p>
            <p className="mt-6 whitespace-pre-wrap text-sm leading-8 text-[#6F5E57]">
              {content ||
                "Preview tulisan akan muncul di sini, seperti halaman kanan dari buku diary."}
            </p>
            {image ? (
              <div
                className="mt-6 aspect-video rounded-2xl bg-cover bg-center shadow-sm"
                style={{ backgroundImage: `url(${image})` }}
              />
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
