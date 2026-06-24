"use client";

import { Plus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { MediaUpload } from "@/components/ui/media-upload";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";
import type {
  FavoriteItem,
  LittleThing,
  MediaAsset,
  WishlistItem,
} from "@/src/types/person";

type FavoriteDraft = {
  category: string;
  value: string;
};

type WishlistDraft = {
  category: string;
  priority: string;
  status: string;
  title: string;
};

type GalleryDraft = {
  altText: string;
  url: string;
};

type LittleThingDraft = {
  category: string;
  text: string;
};

type EditorProps<T> = {
  initialItems: T[];
  personId: string;
};

const emptyFavorite: FavoriteDraft = {
  category: "",
  value: "",
};

const emptyWishlist: WishlistDraft = {
  category: "Short-term",
  priority: "Medium",
  status: "Planned",
  title: "",
};

const emptyGallery: GalleryDraft = {
  altText: "",
  url: "",
};

const emptyLittleThing: LittleThingDraft = {
  category: "Other",
  text: "",
};

const selectClassName =
  "w-full rounded-2xl border border-[#E7D8CB] bg-[#FFFDF9] px-4 py-3 text-sm text-[#3D2F2A] outline-none transition focus:border-[#C98276] focus:ring-2 focus:ring-[#C98276]/15";

export function FavoritesEditor({
  personId,
}: EditorProps<FavoriteItem>) {
  const [items, setItems] = useState<FavoriteDraft[]>([{ ...emptyFavorite }]);

  return (
    <CollectionShell
      collection="favorites"
      items={items}
      actionLabel="Add Favorite"
      personId={personId}
      onAdd={() => setItems((current) => [...current, { ...emptyFavorite }])}
      onSaved={() => setItems([{ ...emptyFavorite }])}
      validateItems={(draftItems) =>
        validateRows(
          draftItems,
          (item) => !item.category && !item.value,
          (item) => Boolean(item.category && item.value),
          "Isi category dan favorite untuk setiap item yang ingin disimpan.",
        )
      }
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="grid gap-3 rounded-2xl border border-[#EFE3D8] p-3 md:grid-cols-[1fr_1fr_auto]"
        >
          <Input
            placeholder="Category"
            value={item.category}
            onChange={(event) =>
              setItems((current) =>
                updateAt(current, index, { category: event.target.value }),
              )
            }
          />
          <Input
            placeholder="Favorite"
            value={item.value}
            onChange={(event) =>
              setItems((current) =>
                updateAt(current, index, { value: event.target.value }),
              )
            }
          />
          <RemoveButton onClick={() => setItems(removeAt(items, index))} />
        </div>
      ))}
    </CollectionShell>
  );
}

export function WishlistEditor({
  personId,
}: EditorProps<WishlistItem>) {
  const [items, setItems] = useState<WishlistDraft[]>([{ ...emptyWishlist }]);

  return (
    <CollectionShell
      collection="wishlist"
      items={items}
      actionLabel="Add Wishlist"
      personId={personId}
      onAdd={() => setItems((current) => [...current, { ...emptyWishlist }])}
      onSaved={() => setItems([{ ...emptyWishlist }])}
      validateItems={(draftItems) =>
        validateRows(
          draftItems,
          (item) => !item.title,
          (item) => Boolean(item.title && item.category),
          "Isi title untuk setiap wishlist yang ingin disimpan.",
        )
      }
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="grid gap-3 rounded-2xl border border-[#EFE3D8] p-3 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]"
        >
          <Input
            placeholder="Title"
            value={item.title}
            onChange={(event) =>
              setItems((current) =>
                updateAt(current, index, { title: event.target.value }),
              )
            }
          />
          <Select
            value={item.category}
            values={["Short-term", "Long-term", "Gift idea"]}
            onChange={(value) =>
              setItems((current) => updateAt(current, index, { category: value }))
            }
          />
          <Select
            value={item.priority}
            values={["Low", "Medium", "High"]}
            onChange={(value) =>
              setItems((current) => updateAt(current, index, { priority: value }))
            }
          />
          <Select
            value={item.status}
            values={["Planned", "Bought", "Completed", "Ignored"]}
            onChange={(value) =>
              setItems((current) => updateAt(current, index, { status: value }))
            }
          />
          <RemoveButton onClick={() => setItems(removeAt(items, index))} />
        </div>
      ))}
    </CollectionShell>
  );
}

export function GalleryEditor({
  personId,
}: EditorProps<MediaAsset>) {
  const [items, setItems] = useState<GalleryDraft[]>([{ ...emptyGallery }]);

  return (
    <CollectionShell
      collection="gallery"
      items={items}
      actionLabel="Add Gallery Photo"
      personId={personId}
      onAdd={() => setItems((current) => [...current, { ...emptyGallery }])}
      onSaved={() => setItems([{ ...emptyGallery }])}
      validateItems={(draftItems) =>
        validateRows(
          draftItems,
          (item) => !item.url && !item.altText,
          (item) => Boolean(item.url),
          "Upload gambar untuk setiap gallery row yang ingin disimpan.",
        )
      }
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="grid gap-3 rounded-2xl border border-[#EFE3D8] p-3 md:grid-cols-[220px_1fr_auto]"
        >
          <MediaUpload
            defaultUrl={item.url}
            folder="people"
            label="Upload gallery photo"
            name={`gallery-${index}`}
            onUploaded={(url) =>
              setItems((current) => updateAt(current, index, { url }))
            }
          />
          <Input
            placeholder="Caption"
            value={item.altText}
            onChange={(event) =>
              setItems((current) =>
                updateAt(current, index, { altText: event.target.value }),
              )
            }
          />
          <RemoveButton onClick={() => setItems(removeAt(items, index))} />
        </div>
      ))}
    </CollectionShell>
  );
}

export function LittleThingsEditor({
  personId,
}: EditorProps<LittleThing>) {
  const [items, setItems] = useState<LittleThingDraft[]>([
    { ...emptyLittleThing },
  ]);

  return (
    <CollectionShell
      collection="little-things"
      items={items}
      actionLabel="Add Little Thing"
      personId={personId}
      onAdd={() =>
        setItems((current) => [...current, { ...emptyLittleThing }])
      }
      onSaved={() => setItems([{ ...emptyLittleThing }])}
      validateItems={(draftItems) =>
        validateRows(
          draftItems,
          (item) => !item.text,
          (item) => Boolean(item.text && item.category),
          "Isi text untuk setiap little thing yang ingin disimpan.",
        )
      }
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="grid gap-3 rounded-2xl border border-[#EFE3D8] p-3 md:grid-cols-[180px_1fr_auto]"
        >
          <Select
            value={item.category}
            values={["Likes", "Dislikes", "Habits", "Words", "Other"]}
            onChange={(value) =>
              setItems((current) => updateAt(current, index, { category: value }))
            }
          />
          <Input
            placeholder="Dia suka es less ice."
            value={item.text}
            onChange={(event) =>
              setItems((current) =>
                updateAt(current, index, { text: event.target.value }),
              )
            }
          />
          <RemoveButton onClick={() => setItems(removeAt(items, index))} />
        </div>
      ))}
    </CollectionShell>
  );
}

type CollectionShellProps<T> = {
  actionLabel: string;
  children: React.ReactNode;
  collection: "favorites" | "gallery" | "little-things" | "wishlist";
  items: T[];
  onAdd: () => void;
  onSaved: () => void;
  personId: string;
  validateItems: (items: T[]) => { items: T[]; message?: string };
};

function CollectionShell<T>({
  actionLabel,
  children,
  collection,
  items,
  onAdd,
  onSaved,
  personId,
  validateItems,
}: CollectionShellProps<T>) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const save = async () => {
    setError("");
    setSuccess("");

    const validation = validateItems(items);

    if (validation.message) {
      setError(validation.message);
      return;
    }

    setIsSaving(true);

    const response = await fetch(`/api/admin/people/${personId}/collections`, {
      body: JSON.stringify({
        collection,
        items: validation.items,
        mode: "append",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      method: "PATCH",
    });
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    setIsSaving(false);

    if (!response.ok) {
      setError(
        response.status === 401
          ? "Kamu harus login admin dulu sebelum menyimpan."
          : payload?.message ?? "Failed to save changes.",
      );
      return;
    }

    setSuccess(payload?.message ?? "Saved");
    onSaved();
    router.refresh();
  };

  return (
    <div className="mt-5 flex justify-end">
      <Button type="button" size="sm" onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4" />
        {actionLabel}
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B1D32]/40 p-4 backdrop-blur-sm">
          <Surface
            padding="none"
            className="max-h-[86vh] w-full max-w-4xl overflow-hidden bg-white"
          >
            <div className="flex items-center justify-between border-b border-[#EFE3D8] px-5 py-4">
              <div>
                <h2 className="text-xl font-bold">{actionLabel}</h2>
                <p className="mt-1 text-sm text-[#6F5E57]">
                  Isi detail baru lalu simpan.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Close modal"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="max-h-[58vh] space-y-3 overflow-y-auto p-5">
              {children}
            </div>

            <div className="border-t border-[#EFE3D8] px-5 py-4">
              {error ? (
                <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {error}
                </p>
              ) : null}
              {success ? (
                <p className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {success}
                </p>
              ) : null}
              <div className="flex flex-col justify-end gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={onAdd}
                >
                  <Plus className="h-4 w-4" />
                  Add Row
                </Button>
                <Button type="button" size="sm" disabled={isSaving} onClick={save}>
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </Surface>
        </div>
      ) : null}
    </div>
  );
}

type SelectProps = {
  onChange: (value: string) => void;
  value: string;
  values: string[];
};

function Select({ onChange, value, values }: SelectProps) {
  return (
    <select
      className={selectClassName}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {values.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}

type RemoveButtonProps = {
  onClick: () => void;
};

function RemoveButton({ onClick }: RemoveButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn("text-red-600 hover:bg-red-50")}
      onClick={onClick}
      aria-label="Remove row"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

function updateAt<T>(items: T[], index: number, patch: Partial<T>) {
  return items.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item,
  );
}

function removeAt<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

function validateRows<T>(
  items: T[],
  isEmpty: (item: T) => boolean,
  isComplete: (item: T) => boolean,
  message: string,
) {
  const meaningfulItems = items.filter((item) => !isEmpty(item));
  const hasIncompleteItem = meaningfulItems.some((item) => !isComplete(item));

  return {
    items: meaningfulItems,
    message: hasIncompleteItem ? message : undefined,
  };
}
