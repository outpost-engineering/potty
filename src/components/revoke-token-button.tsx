"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface Props {
  onRevoke: () => Promise<void>;
}

export function RevokeTokenButton({ onRevoke }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await toast.promise(onRevoke(), {
        loading: "Revoking...",
        success: "Token revoked",
        error: "Failed to revoke token",
      });
      setOpen(false);
    });
  };

  return (
    <>
      <div
        className="rounded-full bg-red-500/40 transition duration-300 hover:scale-110"
        onClick={() => setOpen(true)}
      >
        <button
          type="button"
          title="Revoke token"
          className="flex items-center justify-center rounded p-1 text-red-500 transition hover:text-red-600 disabled:opacity-50"
          disabled={isPending}
        >
          <TrashIcon className="size-[1.4rem] cursor-pointer" />
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Revoke token</DialogTitle>
            <DialogDescription>
              This token will be permanently deleted. You will not be able to
              use it again or recover it later.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <p className="text-muted-foreground text-sm">
              Are you sure you want to revoke this token?
            </p>
          </DialogBody>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirm}
              disabled={isPending}
            >
              Revoke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
