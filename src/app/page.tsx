"use client";

import { useState } from "react";
import { PasswordCheck } from "@/components/auth/password-check";
import { MainMenu } from "@/components/main-menu";
import { containers } from "@/lib/styles";
import { cn } from "@/lib/styles";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <main className={cn(containers.page, "flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center")}>
      {!isAuthenticated ? (
        <PasswordCheck onSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <MainMenu />
      )}
    </main>
  );
}
