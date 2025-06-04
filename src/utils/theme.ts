"use server";
import { cookies } from "next/headers";

export type Theme = "system" | "dark" | "light";

export async function getTheme(): Promise<Theme> {
  const cookieStore = await cookies();
  const theme = cookieStore.get("potty.theme")?.value ?? "system";

  return theme as Theme;
}

export async function setTheme(theme: Theme) {
  const cookieStore = await cookies();
  cookieStore.set("potty.theme", theme);
}
