"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { goHomeStart } from "@/lib/goHomeStart";
import { BrandLogo } from "./BrandLogo";

type Props = {
  className?: string;
  priority?: boolean;
};

export function HomeMark({ className = "mark", priority = false }: Props) {
  const pathname = usePathname();
  return (
    <Link
      className={className}
      href="/"
      aria-label="ML Photography, restart from the beginning"
      onClick={(e) => {
        e.preventDefault();
        goHomeStart(pathname);
      }}
    >
      <BrandLogo variant="light" priority={priority} />
    </Link>
  );
}
