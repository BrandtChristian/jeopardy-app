"use client";

import { Card } from "@/components/ui/card";
import { cn, teamColors, scoreDisplay } from "@/lib/styles";

// Temporary data for development
const PLAYERS = [
  { name: "Team 1", color: "green", score: 1000 },
  { name: "Team 2", color: "blue", score: 800 },
  { name: "Team 3", color: "red", score: 1200 },
  { name: "Team 4", color: "yellow", score: 600 },
  { name: "Team 5", color: "purple", score: 1400 },
] as const;

export function PlayerScoreboard() {
  return (
    <div className="grid grid-cols-5 gap-6 w-[90vw] mx-auto">
      {PLAYERS.map((player) => (
        <Card
          key={player.name}
          className={cn(
            "py-3 px-6 flex flex-row items-center justify-between",
            teamColors[player.color].border,
            "border-2 shadow-lg"
          )}
        >
          <div className="flex items-center gap-4">
            <div className={cn("w-4 h-4 rounded-full", teamColors[player.color].primary)} />
            <h3 className="font-bold text-2xl">{player.name}</h3>
          </div>
          <p className={cn(
            "text-3xl font-bold tabular-nums",
            player.score >= 0 ? scoreDisplay.positive : scoreDisplay.negative
          )}>
            {player.score}
          </p>
        </Card>
      ))}
    </div>
  );
} 