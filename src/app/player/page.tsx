"use client";

import { useState } from "react";
import { PreLobby } from "@/components/player/pre-lobby";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { cn, containers, teamColors, buttons } from "@/lib/styles";
import { useGameState, useGameActions } from "@/lib/context/GameStateContext";

export default function PlayerPage() {
  const { state } = useGameState();
  const { addPlayer, setPlayerReady } = useGameActions();
  const [playerId] = useState(() => Math.random().toString(36).substring(2, 9));

  const handleReady = (playerName: string, teamColor: keyof typeof teamColors) => {
    addPlayer({
      id: playerId,
      name: playerName,
      color: teamColor,
      score: 0,
      isReady: true
    });
  };

  // Find this player in the game state
  const player = state.players.find(p => p.id === playerId);

  return (
    <main className={cn(containers.page, "flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center")}>
      {!player ? (
        <PreLobby onReady={handleReady} />
      ) : (
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold">Venter på spilstart...</h1>
          <Spinner className="h-8 w-8 mx-auto" />
          <div className="space-y-2">
            <p>Hold: {player.name}</p>
            <p>Farve: {teamColors[player.color].danish}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setPlayerReady(playerId, false)}
            className={cn(buttons.nav, "mt-8")}
          >
            Tilbage
          </Button>
        </div>
      )}
    </main>
  );
} 