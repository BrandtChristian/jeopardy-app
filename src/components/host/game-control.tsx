// Host view for controlling the Jeopardy game
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, containers, typography, teamColors, scoreDisplay } from "@/lib/styles";
import { useGameState, useGameActions } from "@/lib/context/GameStateContext";
import { getQuestion } from "@/lib/questions";
import { useEffect } from "react";
import { socket } from "@/lib/socket";

export function GameControl() {
  const { state } = useGameState();
  const {
    startGame,
    endGame,
    selectQuestion,
    clearQuestion,
    setQuestionAnswered,
    updateScore
  } = useGameActions();

  // Register as host when component mounts
  useEffect(() => {
    socket.emit('register_connection', { 
      gameCode: state.gameCode,
      type: 'host'
    });
  }, [state.gameCode]);

  // Calculate if we can start the game
  const canStartGame = state.players.length > 0 && state.players.every(player => player.isReady);

  const handleQuestionSelect = (category: string, amount: number) => {
    const question = getQuestion(category, amount);
    if (question) {
      selectQuestion({
        ...question,
        value: amount,
        isRevealed: false,
        isAnswered: false
      });
    }
  };

  const handleAnswerCorrect = () => {
    if (state.currentQuestion && state.buzzOrder.length > 0) {
      const playerId = state.buzzOrder[0];
      const player = state.players.find(p => p.id === playerId);
      if (player) {
        updateScore(playerId, player.score + state.currentQuestion.value);
      }
      setQuestionAnswered(state.currentQuestion.id);
      clearQuestion();
    }
  };

  const handleAnswerIncorrect = () => {
    if (state.currentQuestion && state.buzzOrder.length > 0) {
      const playerId = state.buzzOrder[0];
      const player = state.players.find(p => p.id === playerId);
      if (player) {
        updateScore(playerId, player.score - state.currentQuestion.value);
      }
      // Don't clear the question, allow other players to answer
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-safe-area-bottom">
      {/* Header with game controls and connection status - Fixed at top */}
      <div className="sticky top-0 z-10 bg-zinc-900 border-b border-zinc-800 p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-sm text-zinc-400">Spilkode</p>
            <p className="text-xl font-mono font-bold">{state.gameCode}</p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2 text-sm">
              <div className={cn(
                "w-2 h-2 rounded-full",
                state.connections.hostConnected ? "bg-green-500" : "bg-red-500"
              )} />
              <span className="text-zinc-400">Host</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={cn(
                "w-2 h-2 rounded-full",
                state.connections.tvConnected ? "bg-green-500" : "bg-red-500"
              )} />
              <span className="text-zinc-400">TV</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={endGame}
            className="text-red-500 border-red-900 hover:bg-red-950"
          >
            End Game
          </Button>
          
          <Button
            variant="outline"
            onClick={startGame}
            disabled={!canStartGame}
            className={cn(
              "border-emerald-900",
              canStartGame 
                ? "text-emerald-500 hover:bg-emerald-950" 
                : "text-zinc-500"
            )}
          >
            Start Game
          </Button>
        </div>
      </div>

      <div className="space-y-6 p-4">
        {/* Current question display */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className={typography.h4}>Current Question</CardTitle>
          </CardHeader>
          <CardContent>
            {state.currentQuestion ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-zinc-400">Category</p>
                    <p className="font-medium">{state.currentQuestion.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Value</p>
                    <p className="font-medium">${state.currentQuestion.value}</p>
                  </div>
                </div>
                <p className="text-lg font-medium mt-4">{state.currentQuestion.question}</p>
                <p className="text-sm text-zinc-400 mt-2">Answer: {state.currentQuestion.answer}</p>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="default"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={handleAnswerCorrect}
                    disabled={state.buzzOrder.length === 0}
                  >
                    Correct
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleAnswerIncorrect}
                    disabled={state.buzzOrder.length === 0}
                  >
                    Incorrect
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-zinc-700 hover:bg-zinc-800"
                    onClick={clearQuestion}
                  >
                    Clear
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
            {state.players.length === 0 ? (
              <p className="text-zinc-400">Waiting for players to join...</p>
            ) : (
              state.players.map((player) => (
                <div
                  key={player.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    teamColors[player.color].border,
                    state.buzzOrder[0] === player.id && "bg-zinc-800"
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
              {/* Questions grid */}
              {state.board.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="p-2 text-center font-medium bg-zinc-800 text-white rounded">
                    {category.name}
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {category.questions.map((question) => (
                      <Button
                        key={question.id}
                        variant="outline"
                        className={cn(
                          "aspect-video border-zinc-700 hover:bg-zinc-800",
                          question.isAnswered && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => handleQuestionSelect(category.name, question.value)}
                        disabled={question.isAnswered || !state.isActive}
                      >
                        ${question.value}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 