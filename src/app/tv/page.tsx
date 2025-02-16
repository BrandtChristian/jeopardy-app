"use client";

import { GameBoard } from "@/components/tv/game-board";
import { PlayerScoreboard } from "@/components/tv/player-scoreboard";
import { useGameState } from "@/lib/context/GameStateContext";
import { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function TVPage() {
  const { state } = useGameState();

  // Register as TV when component mounts
  useEffect(() => {
    socket.emit('register_connection', { 
      gameCode: state.gameCode,
      type: 'tv'
    });
  }, [state.gameCode]);

  return (
    <main className="h-screen w-screen bg-background flex flex-col py-6">
      {/* Game board section */}
      <div className="flex-1 flex items-center justify-center">
        <GameBoard />
      </div>

      {/* Player scoreboard section */}
      <div className="h-[18vh] flex items-center justify-center">
        <PlayerScoreboard />
      </div>
    </main>
  );
} 