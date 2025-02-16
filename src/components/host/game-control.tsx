// Host view for controlling the Jeopardy game
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, containers, typography, teamColors, scoreDisplay } from "@/lib/styles";
import { getAllCategories, getAmounts } from "@/lib/questions";

// Get categories and amounts from our questions data
const CATEGORIES = getAllCategories();
const AMOUNTS = getAmounts();

interface Player {
  name: string;
  color: keyof typeof teamColors;
  score: number;
  isReady: boolean;
}

export function GameControl() {
  // Game state
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<{category: string; amount: number} | null>(null);

  // Calculate if we can start the game
  const canStartGame = players.length > 0 && players.every(player => player.isReady);

  return (
    <div className="min-h-screen bg-black text-white pb-safe-area-bottom">
      {/* Header with game controls - Fixed at top */}
      <div className="sticky top-0 z-10 bg-zinc-900 border-b border-zinc-800 p-4 space-y-4">
        <h1 className={cn(typography.h3, "text-center")}>Host Control</h1>
        <div className="flex gap-2">
          {!isGameStarted ? (
            <Button
              disabled={!canStartGame}
              onClick={() => setIsGameStarted(true)}
              className="bg-green-600 hover:bg-green-700 flex-1"
            >
              Start Game
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsPaused(!isPaused)}
                className="flex-1 border-zinc-700 hover:bg-zinc-800"
              >
                {isPaused ? "Resume Game" : "Pause Game"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm("Are you sure you want to end the game?")) {
                    setIsGameStarted(false);
                  }
                }}
                className="flex-1"
              >
                End Game
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* Current question display - Important info first on mobile */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className={typography.h4}>Current Question</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedQuestion ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-zinc-400">Category</p>
                    <p className="font-medium">{selectedQuestion.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Value</p>
                    <p className="font-medium">${selectedQuestion.amount}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="default" className="flex-1">
                    Show Answer
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-zinc-700 hover:bg-zinc-800"
                  >
                    Clear Question
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-zinc-400">No question selected</p>
            )}
          </CardContent>
        </Card>

        {/* Player management */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className={typography.h4}>Players</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {players.length === 0 ? (
              <p className="text-zinc-400">Waiting for players to join...</p>
            ) : (
              players.map((player) => (
                <div
                  key={player.name}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    teamColors[player.color].border
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full", teamColors[player.color].primary)} />
                    <span className="font-medium">{player.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "text-sm font-medium",
                      player.isReady ? "text-green-500" : "text-yellow-500"
                    )}>
                      {player.isReady ? "Ready" : "Not Ready"}
                    </span>
                    <span className={cn(
                      "font-bold tabular-nums",
                      player.score >= 0 ? scoreDisplay.positive : scoreDisplay.negative
                    )}>
                      ${player.score}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Question grid */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className={typography.h4}>Question Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First half of categories (0-2) */}
              <div className="grid grid-cols-3 gap-2 text-sm">
                {CATEGORIES.slice(0, 3).map((category) => (
                  <div
                    key={category}
                    className="p-2 text-center font-medium bg-zinc-800 text-white rounded"
                  >
                    {category}
                  </div>
                ))}

                {/* Questions for first half */}
                {CATEGORIES.slice(0, 3).map((category) =>
                  AMOUNTS.map((amount) => (
                    <Button
                      key={`${category}-${amount}`}
                      variant="outline"
                      className="aspect-video border-zinc-700 hover:bg-zinc-800"
                      onClick={() => setSelectedQuestion({ category, amount })}
                    >
                      ${amount}
                    </Button>
                  ))
                )}
              </div>

              {/* Second half of categories (3-5) */}
              <div className="grid grid-cols-3 gap-2 text-sm">
                {CATEGORIES.slice(3, 6).map((category) => (
                  <div
                    key={category}
                    className="p-2 text-center font-medium bg-zinc-800 text-white rounded"
                  >
                    {category}
                  </div>
                ))}

                {/* Questions for second half */}
                {CATEGORIES.slice(3, 6).map((category) =>
                  AMOUNTS.map((amount) => (
                    <Button
                      key={`${category}-${amount}`}
                      variant="outline"
                      className="aspect-video border-zinc-700 hover:bg-zinc-800"
                      onClick={() => setSelectedQuestion({ category, amount })}
                    >
                      ${amount}
                    </Button>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 