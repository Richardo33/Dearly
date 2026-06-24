"use client";

import { useRouter } from "next/navigation";
import {
  BookOpenText,
  CalendarHeart,
  Check,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { MediaUpload } from "@/components/ui/media-upload";
import { getPersonPath } from "@/lib/person-path";
import { cn } from "@/lib/utils";
import type { DiaryEntry, Person } from "@/src/types/person";

type DiaryEditorProps = {
  entryId: string;
  isAdmin?: boolean;
  person: Person;
};

function getTodayValue() {
  return new Date().toISOString().slice(0, 10);
}

function isNewEntry(entryId: string) {
  return entryId === "new";
}

export function DiaryEditor({
  entryId,
  isAdmin = false,
  person,
}: DiaryEditorProps) {
  const router = useRouter();
  const personPath = getPersonPath(person);
  const isNew = isNewEntry(entryId);

  const initialEntry = useMemo(() => {
    return person.diaryEntries.find((entry) => entry.id === entryId);
  }, [entryId, person.diaryEntries]);
  const diaryEntries = useMemo(() => {
    return [...person.diaryEntries].sort((firstEntry, secondEntry) =>
      firstEntry.date.localeCompare(secondEntry.date),
    );
  }, [person.diaryEntries]);
  const selectedEntryIndex = useMemo(() => {
    return diaryEntries.findIndex((entry) => entry.id === entryId);
  }, [diaryEntries, entryId]);
  const [pageIndex, setPageIndex] = useState(() => {
    if (selectedEntryIndex < 0) {
      return 0;
    }

    return selectedEntryIndex % 2 === 0
      ? selectedEntryIndex
      : selectedEntryIndex - 1;
  });
  const [turnDirection, setTurnDirection] = useState<"next" | "previous" | null>(
    null,
  );

  const [date, setDate] = useState(initialEntry?.date ?? getTodayValue());
  const [title, setTitle] = useState(initialEntry?.title ?? "");
  const [content, setContent] = useState(initialEntry?.content ?? "");
  const [image, setImage] = useState(initialEntry?.image ?? "");
  const [mood, setMood] = useState(initialEntry?.mood ?? "Happy");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const handleSave = async () => {
    if (!isAdmin || !isNew) {
      return;
    }

    setError("");
    setStatus("saving");

    const response = await fetch(`/api/admin/people/${person.id}/diary`, {
      body: JSON.stringify({
        content,
        date,
        imageUrl: image,
        mood,
        tags: [],
        title,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const result = (await response.json().catch(() => null)) as {
      id?: string;
      message?: string;
    } | null;

    if (!response.ok || !result?.id) {
      setError(result?.message ?? "Failed to save diary entry.");
      setStatus("idle");
      return;
    }

    setStatus("saved");
    router.refresh();

    window.setTimeout(() => {
      router.replace(`${personPath}?tab=diary`);
      setStatus("idle");
    }, 400);
  };

  if (!isNew && initialEntry) {
    return (
      <DiaryBookSpread
        entries={diaryEntries}
        pageIndex={pageIndex}
        person={person}
        turnDirection={turnDirection}
        onTurn={(direction) => {
          const nextPageIndex =
            direction === "next"
              ? Math.min(pageIndex + 2, diaryEntries.length - 1)
              : Math.max(pageIndex - 2, 0);

          if (nextPageIndex === pageIndex) {
            return;
          }

          setTurnDirection(direction);
          setPageIndex(nextPageIndex);
          window.setTimeout(() => setTurnDirection(null), 520);
        }}
      />
    );
  }

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
              onClick={() => router.push(`${personPath}?tab=diary`)}
            >
              <BookOpenText className="h-4 w-4" />
            </Button>

            {isAdmin ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleSave}
                disabled={status === "saving"}
              >
                {status === "saved" ? <Check className="h-4 w-4" /> : null}
                {status === "saving"
                  ? "Saving..."
                  : status === "saved"
                    ? "Saved"
                    : "Save"}
              </Button>
            ) : null}
          </div>

          {error ? (
            <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          ) : null}

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase text-[#9B645C]">
                Date
              </span>
              <Input
                type="date"
                value={date}
                readOnly={!isAdmin}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase text-[#9B645C]">
                Title
              </span>
              <Input
                value={title}
                readOnly={!isAdmin}
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
                readOnly={!isAdmin}
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
                readOnly={!isAdmin}
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

type DiaryBookSpreadProps = {
  entries: DiaryEntry[];
  onTurn: (direction: "next" | "previous") => void;
  pageIndex: number;
  person: Person;
  turnDirection: "next" | "previous" | null;
};

function DiaryBookSpread({
  entries,
  onTurn,
  pageIndex,
  person,
  turnDirection,
}: DiaryBookSpreadProps) {
  const leftEntry = entries[pageIndex];
  const rightEntry = entries[pageIndex + 1];
  const hasPreviousPage = pageIndex > 0;
  const hasNextPage = pageIndex + 2 < entries.length;

  return (
    <article className="relative">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasPreviousPage || Boolean(turnDirection)}
          onClick={() => onTurn("previous")}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <p className="text-center text-xs font-semibold uppercase text-[#9B645C]">
          Pages {pageIndex + 1}-{Math.min(pageIndex + 2, entries.length)} of{" "}
          {entries.length}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasNextPage || Boolean(turnDirection)}
          onClick={() => onTurn("next")}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-[1.6rem] border-[10px] border-[#6E5749] bg-[#6E5749] shadow-2xl sm:rounded-[2.25rem]">
        <div
          className={cn(
            "diary-book-spread relative grid min-h-[620px] overflow-hidden rounded-[1rem] bg-[#FFF9EF] shadow-inner sm:rounded-[1.55rem] lg:grid-cols-2",
            turnDirection === "next" && "diary-spread-turn-next",
            turnDirection === "previous" && "diary-spread-turn-previous",
          )}
        >
          <DiaryBookPage
            entry={leftEntry}
            fallbackLabel={`${person.nickname}'s Diary`}
            side="left"
          />
          <DiaryBookPage
            entry={rightEntry}
            fallbackLabel={`${person.nickname}'s Diary`}
            side="right"
          />
          {turnDirection ? (
            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 hidden w-1/2 bg-[#FFF4E6] shadow-2xl lg:block",
                turnDirection === "next"
                  ? "diary-page-flip-next right-0 origin-left"
                  : "diary-page-flip-previous left-0 origin-right",
              )}
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}

type DiaryBookPageProps = {
  entry?: DiaryEntry;
  fallbackLabel: string;
  side: "left" | "right";
};

function DiaryBookPage({ entry, fallbackLabel, side }: DiaryBookPageProps) {
  return (
    <section
      className={cn(
        "relative min-h-[620px] bg-[#FFFDF8] px-5 py-8 sm:px-10",
        "bg-[linear-gradient(transparent_31px,#ECDCCB_32px)] bg-[length:100%_32px]",
        side === "left"
          ? "border-b border-[#D5BCA8] lg:border-b-0 lg:border-r"
          : "",
      )}
    >
      <div className="relative z-10">
        {entry ? (
          <>
            <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3D6D0] text-[#9B645C]">
              <BookOpenText className="h-6 w-6" />
            </div>

            <p className="flex items-center gap-2 text-xs font-semibold uppercase text-[#9B645C]">
              <CalendarHeart className="h-4 w-4" />
              {entry.date}
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-[#3D2F2A]">
              {entry.title}
            </h1>
            <p className="mt-2 text-sm font-semibold text-[#9B645C]">
              Mood: {entry.mood}
            </p>

            <p className="mt-8 whitespace-pre-wrap text-sm leading-8 text-[#5F504A]">
              {entry.content}
            </p>

            {entry.image ? (
              <div
                className="mt-8 aspect-[4/3] rounded-2xl border border-[#E4D1C0] bg-cover bg-center shadow-sm"
                style={{ backgroundImage: `url(${entry.image})` }}
              />
            ) : null}
          </>
        ) : (
          <div className="flex min-h-[500px] flex-col justify-center rounded-2xl border border-dashed border-[#E4D1C0] px-6 text-center">
            <ImageIcon className="mx-auto mb-3 h-6 w-6 text-[#9B8B83]" />
            <p className="text-xs font-semibold uppercase text-[#9B645C]">
              {fallbackLabel}
            </p>
            <p className="mt-3 text-sm leading-8 text-[#6F5E57]">
              Belum ada diary untuk halaman ini.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
