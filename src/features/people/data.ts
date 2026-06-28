import { connection } from "next/server";

import { getSupabasePublicEnv } from "@/src/lib/supabase/env";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";
import { getPersonSlug } from "@/lib/person-path";
import { isAdminSession } from "@/src/lib/admin/session";
import { demoPeople } from "@/src/features/people/demo-data";
import type { Person } from "@/src/types/person";

type PeopleRow = {
  birthday: string | null;
  description: string | null;
  favorite_items: {
    category: string;
    id: string;
    label: string;
    value: string;
  }[];
  diary_entries: {
    content: string;
    date: string;
    id: string;
    image_url: string | null;
    is_public: boolean;
    mood: string | null;
    tags: string[] | null;
    title: string;
  }[];
  id: string;
  little_things: {
    category: string;
    id: string;
    text: string;
  }[];
  location: string | null;
  media_assets: {
    alt_text: string | null;
    diary_entry_id: string | null;
    id: string;
    source_type: string;
    storage_path: string | null;
    url: string;
  }[];
  name: string;
  nickname: string;
  photo_url: string | null;
  relationship: string;
  status: string;
  tags: string[] | null;
  timeline_events: {
    date: string;
    description: string;
    id: string;
    title: string;
  }[];
  wishlist_items: {
    category: string;
    id: string;
    priority: string;
    status: string;
    title: string;
  }[];
};

const peopleSelect = `
  id,
  name,
  nickname,
  relationship,
  status,
  birthday,
  location,
  description,
  photo_url,
  tags,
  favorite_items(id, category, label, value),
  diary_entries(id, date, title, content, mood, tags, is_public, image_url),
  wishlist_items(id, title, category, priority, status),
  timeline_events(id, date, title, description),
  little_things(id, text, category),
  media_assets(id, source_type, url, storage_path, alt_text, diary_entry_id)
`;

function mapPeopleRows(rows: PeopleRow[]): Person[] {
  return rows.map((row) => {
    const diaryEntries = row.diary_entries.map((entry) => ({
      content: entry.content,
      date: entry.date,
      id: entry.id,
      image: entry.image_url ?? undefined,
      isPublic: entry.is_public,
      mood: entry.mood ?? "",
      tags: entry.tags ?? [],
      title: entry.title,
    }));

    const person = {
      birthday: row.birthday ?? "",
      description: row.description ?? "",
      diaryEntries,
      favorites: row.favorite_items.map((item) => ({
        category: item.category,
        id: item.id,
        label: item.label,
        value: item.value,
      })),
      gallery: row.media_assets.map((asset) => ({
        altText: asset.alt_text ?? undefined,
        diaryEntryId: asset.diary_entry_id ?? undefined,
        id: asset.id,
        sourceType: asset.source_type as Person["gallery"][number]["sourceType"],
        storagePath: asset.storage_path ?? undefined,
        url: asset.url,
      })),
      id: row.id,
      littleThings: row.little_things.map((note) => ({
        category: note.category as Person["littleThings"][number]["category"],
        id: note.id,
        text: note.text,
      })),
      location: row.location ?? "",
      name: row.name,
      nickname: row.nickname,
      photo: row.photo_url ?? "",
      relationship: row.relationship as Person["relationship"],
      status: row.status as Person["status"],
      tags: row.tags ?? [],
      timeline: diaryEntries.map((entry) => ({
        date: entry.date,
        description: entry.content,
        id: `diary-${entry.id}`,
        title: entry.title,
      })),
      wishlist: row.wishlist_items.map((item) => ({
        category: item.category as Person["wishlist"][number]["category"],
        id: item.id,
        priority: item.priority as Person["wishlist"][number]["priority"],
        status: item.status as Person["wishlist"][number]["status"],
        title: item.title,
      })),
    };

    return {
      ...person,
      slug: getPersonSlug(person),
    };
  });
}

async function getRealPeople() {
  if (!getSupabasePublicEnv()) {
    return [];
  }

  await connection();

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("people")
    .select(peopleSelect)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to fetch people from Supabase:", error?.message);
    return [];
  }

  return mapPeopleRows(data as PeopleRow[]);
}

export async function getPeople() {
  if (!(await isAdminSession())) {
    return demoPeople;
  }

  return getRealPeople();
}

export async function getActivePeople() {
  const people = await getPeople();

  return people.filter((person) => person.status === "Active");
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

async function getRealPersonById(id: string) {
  if (!getSupabasePublicEnv()) {
    return null;
  }

  await connection();

  if (!isUuid(id)) {
    const people = await getPeople();
    return people.find((person) => person.slug === id) ?? null;
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("people")
    .select(peopleSelect)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) {
      console.error("Failed to fetch person from Supabase:", error.message);
    }

    return null;
  }

  return mapPeopleRows([data as PeopleRow])[0] ?? null;
}

export async function getPersonById(id: string) {
  if (!(await isAdminSession())) {
    return (
      demoPeople.find((person) => person.id === id || person.slug === id) ?? null
    );
  }

  return getRealPersonById(id);
}

export async function getDashboardStats() {
  const people = await getPeople();

  return [
    { label: "Total People", value: people.length },
    { label: "Favorite Entries", value: people.flatMap((p) => p.favorites).length },
    { label: "Wishlist Items", value: people.flatMap((p) => p.wishlist).length },
    { label: "Timeline Events", value: people.flatMap((p) => p.timeline).length },
    { label: "Little Things", value: people.flatMap((p) => p.littleThings).length },
    { label: "Photos", value: people.filter((person) => person.photo).length },
  ];
}
