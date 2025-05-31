import { getSession } from "@/utils/jwt";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function TeamLayout(props: PropsWithChildren) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <header className="mx-auto max-w-7xl p-2">
        <nav className="flex h-20 w-full items-center justify-between">
          <div className="flex h-full w-full items-center justify-start">5</div>
          <div className="flex h-full w-full items-center justify-start">5</div>
          <div className="flex h-full w-full items-center justify-end"></div>
        </nav>
      </header>
      {props.children}
    </>
  );
}
