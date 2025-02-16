"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, containers, typography, buttons } from "@/lib/styles";

interface PasswordCheckProps {
  onSuccess: () => void;
}

export function PasswordCheck({ onSuccess }: PasswordCheckProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234") {
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <Card className={cn(containers.card, "w-[300px]")}>
      <CardHeader>
        <CardTitle className={typography.h3}>Indtast kode</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Indtast kode..."
            className={cn(error && "border-destructive")}
          />
          {error && (
            <p className={cn(typography.p, "text-sm text-destructive")}>
              Forkert kode. Prøv igen.
            </p>
          )}
          <Button type="submit" className={cn(buttons.nav, "w-full")}>
            Fortsæt
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 