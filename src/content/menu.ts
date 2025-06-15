import { Kitchen } from "@prisma/client";

export interface MenuItem {
  label: string;
  href: string;
}

export const userMenu: MenuItem[] = [
  { label: "Overview", href: "/overview" },
  { label: "Settings", href: "/settings" },
];

export function getKitchenMenu(kitchen: Kitchen) {
  return [
    { label: "Overview", href: `/${kitchen.slug}` },
    { label: "Pots", href: `/${kitchen.slug}/pots` },
    { label: "Chefs", href: `/${kitchen.slug}/chefs` },
    { label: "Settings", href: `/${kitchen.slug}/settings` },
  ] as MenuItem[];
}
