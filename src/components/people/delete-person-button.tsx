"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type DeletePersonButtonProps = {
  compact?: boolean;
  personId: string;
  personName: string;
};

export function DeletePersonButton({
  compact = false,
  personId,
  personName,
}: DeletePersonButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete ${personName}? This will also delete related diary, wishlist, timeline, and gallery records.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    const response = await fetch(`/api/admin/people/${personId}`, {
      method: "DELETE",
    });

    setIsDeleting(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      window.alert(payload?.message ?? "Failed to delete person.");
      return;
    }

    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="destructive"
      size={compact ? "icon-sm" : "sm"}
      disabled={isDeleting}
      onClick={handleDelete}
      aria-label={`Delete ${personName}`}
    >
      <Trash2 className="h-4 w-4" />
      {compact ? null : isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
