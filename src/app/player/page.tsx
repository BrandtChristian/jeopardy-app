"use client";

import { useState } from "react";
import { PreLobby } from "@/components/player/pre-lobby";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { cn, containers, teamColors, buttons } from "@/lib/styles";

export default function PlayerPage() {
  const [playerState, setPlayerState] = useState<{
    name: string;
    teamColor: keyof typeof teamColors;
    isReady: boolean;
  } | null>(null);

  const handleReady = (playerName: string, teamColor: keyof typeof teamColors) => {
    setPlayerState({
      name: playerName,
      teamColor,
      isReady: true,
    });
    // TODO: Connect to WebSocket and notify host
  };

  const handleBack = () => {
    setPlayerState(null);
  };

  return (
    <main className={cn(containers.page, "flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center")}>
      {!playerState?.isReady ? (
        <PreLobby onReady={handleReady} />
      ) : (
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold">Venter på spilstart...</h1>
          <Spinner className="h-8 w-8 mx-auto" />
          <div className="space-y-2">
            <p>Hold: {playerState.name}</p>
            <p>Farve: {teamColors[playerState.teamColor].danish}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleBack}
            className={cn(buttons.nav, "mt-8")}
          >
            Tilbage
          </Button>
        </div>
      )}
    </main>
  );
} 