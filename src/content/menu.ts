import { Team } from "@prisma/client";

export interface MenuItem {
  label: string;
  href: string;
}

export const userMenu: MenuItem[] = [
  { label: "Overview", href: "/overview" },
  { label: "Settings", href: "/settings" },
];

export function getTeamMenu(team: Team) {
  return [
    { label: "Overview", href: `/${team.slug}` },
    { label: "Apps", href: `/${team.slug}/apps` },
    { label: "Members", href: `/${team.slug}/members` },
    { label: "Settings", href: `/${team.slug}/settings` },
  ] as MenuItem[];
}
