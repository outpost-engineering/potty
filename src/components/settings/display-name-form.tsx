"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { updateDisplayName } from "~/libs/actions";

interface DisplayNameFormProps {
  user: {
    name: string | null;
  };
}

export function DisplayNameForm({ user }: DisplayNameFormProps) {
  const [name, setName] = useState(user.name ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { update: updateSession } = useSession();

  const validateName = (value: string) => {
    if (!value) {
      setError("Name is required");
      return false;
    }
    if (value.length > 32) {
      setError("Name must be 32 characters or fewer");
      return false;
    }
    if (!/^[a-zA-Z0-9\s-]+$/.test(value)) {
      setError("Name can only contain letters, numbers, spaces, and hyphens");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateName(name)) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);

    const result = await updateDisplayName(formData);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      // Update the session with the new name
      await updateSession({
        name: result.name,
      });
      
      toast.success("Display name updated successfully");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mt-8 w-full">
        <CardHeader>
          <CardTitle>Display Name</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Please enter your full name, or a display name you are comfortable
            with.
          </p>
          <div className="mt-5 space-y-2">
            <Input
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                validateName(e.target.value);
              }}
              className="w-fit"
              disabled={isLoading}
            />
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="justify-between border-t">
          <p className="text-muted-foreground text-sm">
            Please use 32 characters at maximum.
          </p>
          <Button 
            size="sm" 
            type="submit"
            disabled={isLoading || !!error || name === user.name}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
} 