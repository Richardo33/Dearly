"use client";

import { Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PageHeader } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { LinkButton } from "@/components/ui/link-button";
import { MediaUpload } from "@/components/ui/media-upload";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";
import type { FavoriteItem, MediaAsset, WishlistItem } from "@/src/types/person";

type FavoriteDraft = {
  category: string;
  label: string;
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

type PersonFormValues = {
  birthday?: string;
  bio?: string;
  favorites?: FavoriteItem[];
  gallery?: MediaAsset[];
  location?: string;
  name?: string;
  nickname?: string;
  photo?: string;
  relationship?: string;
  status?: string;
  tags?: string;
  wishlist?: WishlistItem[];
};

type PersonFormProps = {
  description: string;
  defaultValues?: PersonFormValues;
  personId?: string;
  submitText: string;
  title: string;
};

const emptyFavorite: FavoriteDraft = {
  category: "",
  label: "",
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

const selectClassName =
  "w-full rounded-2xl border border-[#E7D8CB] bg-[#FFFDF9] px-4 py-3 text-sm text-[#3D2F2A] outline-none transition focus:border-[#C98276] focus:ring-2 focus:ring-[#C98276]/15";

function cleanFavorites(items: FavoriteDraft[]) {
  return items.filter((item) => item.category && item.label && item.value);
}

function cleanWishlist(items: WishlistDraft[]) {
  return items.filter((item) => item.title && item.category);
}

function cleanGallery(items: GalleryDraft[]) {
  return items.filter((item) => item.url);
}

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
  const [favorites, setFavorites] = useState<FavoriteDraft[]>(
    defaultValues?.favorites?.length
      ? defaultValues.favorites.map((item) => ({
          category: item.category,
          label: item.label,
          value: item.value,
        }))
      : [{ ...emptyFavorite }],
  );
  const [wishlist, setWishlist] = useState<WishlistDraft[]>(
    defaultValues?.wishlist?.length
      ? defaultValues.wishlist.map((item) => ({
          category: item.category,
          priority: item.priority,
          status: item.status,
          title: item.title,
        }))
      : [{ ...emptyWishlist }],
  );
  const [gallery, setGallery] = useState<GalleryDraft[]>(
    defaultValues?.gallery?.filter((item) => item.sourceType === "gallery")
      .length
      ? defaultValues.gallery
          .filter((item) => item.sourceType === "gallery")
          .map((item) => ({
            altText: item.altText ?? "",
            url: item.url,
          }))
      : [{ ...emptyGallery }],
  );

  const updateFavorite = (
    index: number,
    key: keyof FavoriteDraft,
    value: string,
  ) => {
    setFavorites((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  };

  const updateWishlist = (
    index: number,
    key: keyof WishlistDraft,
    value: string,
  ) => {
    setWishlist((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  };

  const updateGallery = (
    index: number,
    key: keyof GalleryDraft,
    value: string,
  ) => {
    setGallery((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      birthday: String(formData.get("birthday") ?? ""),
      description: String(formData.get("description") ?? ""),
      favorites: cleanFavorites(favorites),
      gallery: cleanGallery(gallery),
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
      wishlist: cleanWishlist(wishlist),
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

    router.push(result?.id ? `/people/${result.id}` : "/admin/people");
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

          <EditableSection
            description="Kelompokkan hal favorit berdasarkan kategori seperti Songs, Food, Drink, Books."
            onAdd={() => setFavorites((current) => [...current, { ...emptyFavorite }])}
            title="Favorites"
          >
            {favorites.map((item, index) => (
              <div
                key={`favorite-${index}`}
                className="grid gap-3 rounded-2xl border border-[#EFE3D8] p-3 md:grid-cols-[1fr_1fr_1fr_auto]"
              >
                <Input
                  placeholder="Category"
                  value={item.category}
                  onChange={(event) =>
                    updateFavorite(index, "category", event.target.value)
                  }
                />
                <Input
                  placeholder="Label"
                  value={item.label}
                  onChange={(event) =>
                    updateFavorite(index, "label", event.target.value)
                  }
                />
                <Input
                  placeholder="Value"
                  value={item.value}
                  onChange={(event) =>
                    updateFavorite(index, "value", event.target.value)
                  }
                />
                <RemoveRowButton
                  onClick={() =>
                    setFavorites((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                />
              </div>
            ))}
          </EditableSection>

          <EditableSection
            description="Wishlist bisa dipisahkan menjadi Short-term, Long-term, atau Gift idea."
            onAdd={() => setWishlist((current) => [...current, { ...emptyWishlist }])}
            title="Wishlist"
          >
            {wishlist.map((item, index) => (
              <div
                key={`wishlist-${index}`}
                className="grid gap-3 rounded-2xl border border-[#EFE3D8] p-3 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]"
              >
                <Input
                  placeholder="Title"
                  value={item.title}
                  onChange={(event) =>
                    updateWishlist(index, "title", event.target.value)
                  }
                />
                <select
                  className={selectClassName}
                  value={item.category}
                  onChange={(event) =>
                    updateWishlist(index, "category", event.target.value)
                  }
                >
                  {["Short-term", "Long-term", "Gift idea"].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <select
                  className={selectClassName}
                  value={item.priority}
                  onChange={(event) =>
                    updateWishlist(index, "priority", event.target.value)
                  }
                >
                  {["Low", "Medium", "High"].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <select
                  className={selectClassName}
                  value={item.status}
                  onChange={(event) =>
                    updateWishlist(index, "status", event.target.value)
                  }
                >
                  {["Planned", "Bought", "Completed", "Ignored"].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <RemoveRowButton
                  onClick={() =>
                    setWishlist((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                />
              </div>
            ))}
          </EditableSection>

          <EditableSection
            description="Tambahkan foto gallery manual. Foto profil dan gambar diary tetap otomatis muncul di Gallery profile."
            onAdd={() => setGallery((current) => [...current, { ...emptyGallery }])}
            title="Gallery"
          >
            {gallery.map((item, index) => (
              <div
                key={`gallery-${index}`}
                className="grid gap-3 rounded-2xl border border-[#EFE3D8] p-3 md:grid-cols-[220px_1fr_auto]"
              >
                <MediaUpload
                  defaultUrl={item.url}
                  folder="people"
                  label="Upload gallery photo"
                  name={`gallery-${index}`}
                  onUploaded={(url) => updateGallery(index, "url", url)}
                />
                <Input
                  placeholder="Alt text / caption"
                  value={item.altText}
                  onChange={(event) =>
                    updateGallery(index, "altText", event.target.value)
                  }
                />
                <RemoveRowButton
                  onClick={() =>
                    setGallery((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                />
              </div>
            ))}
          </EditableSection>

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

type EditableSectionProps = {
  children: React.ReactNode;
  description: string;
  onAdd: () => void;
  title: string;
};

function EditableSection({
  children,
  description,
  onAdd,
  title,
}: EditableSectionProps) {
  return (
    <section className="mt-8 rounded-[1.5rem] border border-[#EFE3D8] bg-[#FFFDF9] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-[#6F5E57]">{description}</p>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

type RemoveRowButtonProps = {
  className?: string;
  onClick: () => void;
};

function RemoveRowButton({ className, onClick }: RemoveRowButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn("text-red-600 hover:bg-red-50", className)}
      onClick={onClick}
      aria-label="Remove row"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
