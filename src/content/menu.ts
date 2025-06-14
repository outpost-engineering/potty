export interface MenuItem {
  label: string;
  href: string;
}

export const userMenu: MenuItem[] = [
  { label: "Overview", href: "/overview" },
  { label: "Settings", href: "/settings" },
];
