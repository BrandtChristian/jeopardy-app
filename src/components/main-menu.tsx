"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, containers, typography, buttons } from "@/lib/styles";

export function MainMenu() {
  const router = useRouter();

  return (
    <Card className={cn(containers.card, "w-[300px]")}>
      <CardHeader>
        <CardTitle className={typography.h3}>Vælg visning</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="default"
          className={cn(buttons.nav, "w-full")}
          onClick={() => router.push("/player")}
        >
          Spiller
        </Button>
        <Button
          variant="default"
          className={cn(buttons.nav, "w-full")}
          onClick={() => router.push("/admin")}
        >
          Admin
        </Button>
        <Button
          variant="default"
          className={cn(buttons.nav, "w-full")}
          onClick={() => router.push("/tv")}
        >
          TV
        </Button>
      </CardContent>
    </Card>
  );
} 