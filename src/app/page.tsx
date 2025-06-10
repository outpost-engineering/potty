import Link from "next/link";
import { Button } from "~/components/button";

export default async function Home() {
  return (
    <main className="container mx-auto max-w-7xl">
      <Link href="/space">
        <Button>Go to space</Button>
      </Link>
    </main>
  );
}
