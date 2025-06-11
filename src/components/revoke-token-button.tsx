"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { useTransition } from "react";
import { toast } from "sonner";

interface Props {
  onRevoke: () => Promise<void>;
}

export function RevokeTokenButton({ onRevoke }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-full bg-red-500/40 transition duration-300 hover:scale-110">
      <button
        type="button"
        title="Revoke token"
        className="flex items-center justify-center rounded p-1 text-red-500 transition hover:text-red-600 disabled:opacity-50"
        disabled={isPending}
        onClick={() =>
          startTransition(() => {
            toast.promise(onRevoke(), {
              loading: "Revoking...",
              success: "Token revoked",
              error: "Failed to revoke token",
            });
          })
        }
      >
        <TrashIcon className="size-[1.4rem] cursor-pointer" />
      </button>
    </div>
  );
}
