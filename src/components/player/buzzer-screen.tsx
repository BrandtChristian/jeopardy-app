"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, teamColors, scoreDisplay } from "@/lib/styles";
import { useGameState, useGameActions } from "@/lib/context/GameStateContext";

export function BuzzerScreen() {
  const { state } = useGameState();
  const { recordBuzz } = useGameActions();

  // Find current player
  const currentPlayer = state.players.find(p => p.id === localStorage.getItem('playerId'));
  if (!currentPlayer) return null;

  // Determine if this player is first in buzz order
  const isFirstInQueue = state.buzzOrder[0] === currentPlayer.id;
  // Determine if player is in queue but not first
  const isInQueue = state.buzzOrder.includes(currentPlayer.id);
  // Determine queue position (0-based index)
  const queuePosition = state.buzzOrder.indexOf(currentPlayer.id);

  // Handle buzz button click
  const handleBuzz = () => {
    if (!state.currentQuestion || isInQueue) return;
    recordBuzz(currentPlayer.id);
  };

  // Get status message based on game state
  const getStatusMessage = () => {
    if (!state.currentQuestion) return "Venter på spørgsmål...";
    if (isFirstInQueue) return "DIT TUR! Svar nu!";
    if (isInQueue) return `Du er nummer ${queuePosition + 1} i køen`;
    return "Tryk på buzzeren når du kender svaret!";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 bg-zinc-900">
      {/* Player info */}
      <div className="w-full text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">{currentPlayer.name}</h2>
        <div className={cn(
          "text-4xl font-bold tabular-nums",
          currentPlayer.score >= 0 ? scoreDisplay.positive : scoreDisplay.negative
        )}>
          ${currentPlayer.score}
        </div>
      </div>

      {/* Buzzer button */}
      <Button
        className={cn(
          "w-64 h-64 rounded-full text-3xl font-bold shadow-lg transform transition-all",
          teamColors[currentPlayer.color].primary,
          teamColors[currentPlayer.color].hover,
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-95",
          isFirstInQueue && "animate-pulse"
        )}
        disabled={!state.currentQuestion || isInQueue}
        onClick={handleBuzz}
      >
        BUZZ!
      </Button>

      {/* Status message */}
      <Card className={cn(
        "w-full p-4 text-center text-xl font-medium",
        "bg-zinc-800 border-zinc-700",
        isFirstInQueue && "bg-green-900 border-green-700"
      )}>
        {getStatusMessage()}
      </Card>
    </div>
  );
} 