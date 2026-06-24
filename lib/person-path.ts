import type { Person } from "@/src/types/person";

export function createPersonSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getPersonSlug(person: Pick<Person, "name" | "nickname">) {
  return createPersonSlug(person.name || person.nickname);
}

export function getPersonPath(person: Pick<Person, "name" | "nickname">) {
  return `/people/${getPersonSlug(person)}`;
}
