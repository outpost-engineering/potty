"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
  strict?: boolean;
}

export function ActiveLink({
  href,
  children,
  className,
  strict = false,
}: Props) {
  const pathname = usePathname();
  const isActive = strict ? href === pathname : pathname.startsWith(href);

  return (
    <Link
      href={href}
      data-active={isActive ? "true" : undefined}
      className={className}
    >
      {children}
    </Link>
  );
}
