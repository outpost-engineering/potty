import { Metadata, Viewport } from "next";
import { PropsWithChildren } from "react";

import { Toaster } from "~/common/sonner";
import { ThemeProvider } from "~/common/theme-provider";
import { fontSans } from "~/config/fonts";
import { cn } from "~/utils/cn";

import "~/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Potty",
    template: `%s — Potty`,
  },
  description:
    "Potty helps teams collect and prioritize feedback — bug reports, feature requests, and more — all in one place.",
  keywords: [
    "Feedback",
    "Bug tracking",
    "Feature requests",
    "User feedback",
    "Product feedback",
    "Voting",
    "Next.js",
    "Developer tools",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  authors: [
    {
      name: "Outpost Engineering",
      url: "https://github.com/outpost-engineering",
    },
  ],
  creator: "Outpost Engineering",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout(props: PropsWithChildren) {
  return (
    <html suppressHydrationWarning lang="en" dir="ltr">
      <body
        className={cn(
          "selection:bg-primary selection:text-primary-foreground antialiased transition-colors duration-150 ease-in",
          fontSans.className,
        )}
      >
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          {props.children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
