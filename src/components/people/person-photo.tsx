import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type PersonPhotoProps = {
  alt: string;
  className?: string;
  src: string;
};

export function PersonPhoto({ alt, className, src }: PersonPhotoProps) {
  return (
    <div
      aria-label={alt}
      className={cn("bg-cover bg-center", className)}
      role="img"
      style={{ "--photo-url": `url(${src})` } as CSSProperties}
    />
  );
}
