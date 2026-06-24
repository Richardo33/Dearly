import Link from "next/link";
import { CalendarHeart, Eye, Heart, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Surface } from "@/components/ui/surface";
import { getPersonPath } from "@/lib/person-path";
import { DeletePersonButton } from "@/src/components/people/delete-person-button";
import { PersonPhoto } from "@/src/components/people/person-photo";
import type { Person } from "@/src/types/person";

type PersonCardProps = {
  isAdmin?: boolean;
  person: Person;
};

export function PersonCard({ isAdmin = false, person }: PersonCardProps) {
  return (
    <Surface className="group relative h-full overflow-hidden transition hover:-translate-y-1 hover:bg-white hover:shadow-md">
      <Link
        href={getPersonPath(person)}
        aria-label={`Open ${person.name} profile`}
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10 pointer-events-none">
        <PersonPhoto
          alt={person.name}
          src={person.photo}
          className="mb-4 aspect-[4/3] rounded-[1.25rem] [background-image:var(--photo-url)]"
        />
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold">{person.name}</h2>
            <p className="text-xs font-semibold text-[#9B645C]">
              @{person.nickname}
            </p>
          </div>
          <Badge variant={person.status === "Active" ? "accent" : "outline"}>
            {person.status}
          </Badge>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#6F5E57]">
          {person.description}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-[#7C6A62]">
          <span className="inline-flex items-center gap-1">
            <CalendarHeart className="h-3.5 w-3.5 text-[#D9798F]" />
            {person.birthday.split(" ").slice(0, 2).join(" ")}
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 text-[#D9798F]" />
            {person.diaryEntries.length} entries
          </span>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#9B645C] opacity-80 transition group-hover:opacity-100">
            <Eye className="h-3.5 w-3.5" />
            Open profile
          </span>
          {isAdmin ? (
            <div className="pointer-events-auto flex shrink-0 items-center gap-2">
              <LinkButton
                href={`/admin/people/${person.id}/edit`}
                variant="secondary"
                size="icon-sm"
                aria-label={`Edit ${person.name}`}
              >
                <Pencil className="h-3.5 w-3.5" />
              </LinkButton>
              <DeletePersonButton
                compact
                personId={person.id}
                personName={person.name}
              />
            </div>
          ) : null}
        </div>
      </div>
      </Surface>
  );
}
