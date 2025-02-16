"use client";

import { GameBoard } from "@/components/tv/game-board";
import { PlayerScoreboard } from "@/components/tv/player-scoreboard";
import { cn, containers } from "@/lib/styles";

export default function TVPage() {
  const handleQuestionSelect = (category: string, amount: number) => {
    // TODO: Implement question selection logic
    console.log(`Selected ${category} for $${amount}`);
  };

  return (
    <main className="h-screen w-screen bg-background flex flex-col py-6">
      {/* Game board section */}
      <div className="flex-1 flex items-center justify-center">
        <GameBoard onQuestionSelect={handleQuestionSelect} />
      </div>

      {/* Player scoreboard section */}
      <div className="h-[18vh] flex items-center justify-center">
        <PlayerScoreboard />
      </div>
    </main>
  );
} 