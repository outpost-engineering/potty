"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function ActiveLink({ href, children, className }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

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
