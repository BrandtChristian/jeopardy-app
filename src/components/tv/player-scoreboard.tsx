"use client";

import { Card } from "@/components/ui/card";
import { cn, teamColors, scoreDisplay } from "@/lib/styles";
import { useGameState } from "@/lib/context/GameStateContext";

export function PlayerScoreboard() {
  const { state } = useGameState();
  const connectedPlayers = state.players.filter(p => p.isReady);

  // Get the appropriate grid columns class based on player count
  const getGridCols = (count: number) => {
    switch (Math.min(count, 5)) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-3";
      case 4: return "grid-cols-4";
      case 5: return "grid-cols-5";
      default: return "grid-cols-1";
    }
  };

  return (
    <div className={cn(
      "grid gap-6 w-[90vw] mx-auto",
      getGridCols(connectedPlayers.length)
    )}>
      {connectedPlayers.map((player) => (
        <Card
          key={player.id}
          className={cn(
            "py-3 px-6 flex flex-row items-center justify-between",
            teamColors[player.color].border,
            "border-2 shadow-lg bg-zinc-900"
          )}
        >
          <div className="flex items-center gap-4">
            <div className={cn("w-4 h-4 rounded-full", teamColors[player.color].primary)} />
            <h3 className="font-bold text-2xl text-white">{player.name}</h3>
          </div>
          <p className={cn(
            "text-3xl font-bold tabular-nums",
            player.score >= 0 ? scoreDisplay.positive : scoreDisplay.negative
          )}>
            ${player.score}
          </p>
        </Card>
      ))}
    </div>
  );
} 