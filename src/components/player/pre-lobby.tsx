"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn, teamColors } from "@/lib/styles";
import { useGameState, useGameActions } from "@/lib/context/GameStateContext";
import { socket } from "@/lib/socket";

export function PreLobby() {
  const { state } = useGameState();
  const { addPlayer } = useGameActions();
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState<keyof typeof teamColors | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isThisTabReady, setIsThisTabReady] = useState(false);

  // Initialize client-side state
  useEffect(() => {
    const storedId = localStorage.getItem('playerId');
    const newId = storedId || Math.random().toString(36).substring(2, 9);
    setPlayerId(newId);
    
    const storedTabReady = localStorage.getItem(`tab_ready_${newId}`) === 'true';
    setIsThisTabReady(storedTabReady);
  }, []);

  // Find if this player is already in the game
  const existingPlayer = playerId ? state.players.find(p => p.id === playerId) : null;

  // Connect to socket and request initial state
  useEffect(() => {
    if (!playerId) return; // Don't connect until we have a playerId

    if (!socket.connected) {
      socket.connect();
    }

    // Request current game state when connected
    socket.on('connect', () => {
      setIsConnected(true);
      // Register as a potential player to get game state
      socket.emit('register_connection', { 
        gameCode: state.gameCode,
        type: 'player',
        playerId,
        isReady: isThisTabReady
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [state.gameCode, playerId, isThisTabReady]);

  // If player is already in the game and ready, AND this tab was marked as ready
  if (existingPlayer?.isReady && isThisTabReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-900">
        <div className="text-white text-center space-y-4">
          <h2 className="text-2xl font-bold">Velkommen tilbage!</h2>
          <p>Du er allerede registreret som {existingPlayer.name}</p>
          <p>Venter på at spillet starter...</p>
        </div>
      </div>
    );
  }

  // Debug logging for state changes
  useEffect(() => {
    console.log('Current game state:', {
      players: state.players,
      takenColors: state.players.filter(p => p.isReady).map(p => p.color)
    });
  }, [state.players]);

  // Get array of colors that are already taken by ready players
  const takenColors = state.players
    .filter(p => p.isReady && (!playerId || p.id !== playerId)) // Don't block our own color
    .map(p => p.color);

  // Reset selected color if it becomes taken
  useEffect(() => {
    if (selectedColor && takenColors.includes(selectedColor)) {
      setSelectedColor(null);
    }
  }, [takenColors, selectedColor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedColor || !isConnected || !playerId) return;

    // Store playerId in localStorage for persistence
    localStorage.setItem('playerId', playerId);
    // Mark this specific tab as ready
    localStorage.setItem(`tab_ready_${playerId}`, 'true');
    setIsThisTabReady(true);

    // Register player
    addPlayer({
      id: playerId,
      name,
      color: selectedColor,
      score: 0,
      isReady: true
    });
  };

  const isValid = name.length >= 2 && name.length <= 20 && selectedColor !== null && isConnected && playerId !== null;

  // Don't render form until we have playerId
  if (playerId === null) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-900">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        {!isConnected && (
          <div className="text-yellow-500 text-sm text-center mb-4">
            Forbinder til server...
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Holdnavn</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
            placeholder="Indtast holdnavn..."
            minLength={2}
            maxLength={20}
          />
          <p className="text-xs text-zinc-400">
            Mellem 2 og 20 tegn
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Vælg farve</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(teamColors).map(([color, styles]) => {
              const isColorTaken = takenColors.includes(color as keyof typeof teamColors);
              return (
                <Button
                  key={color}
                  type="button"
                  className={cn(
                    "h-20 rounded-lg border-2 relative",
                    styles.primary,
                    !isColorTaken && styles.hover,
                    "transition-all duration-200",
                    selectedColor === color ? "border-white scale-105" : "border-transparent",
                    isColorTaken && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => !isColorTaken && setSelectedColor(color as keyof typeof teamColors)}
                  disabled={isColorTaken}
                >
                  <span className={cn(
                    isColorTaken && "opacity-50"
                  )}>
                    {styles.danish}
                  </span>
                  {isColorTaken && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg">
                      <span className="text-sm text-white opacity-90">Optaget</span>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        <Button
          type="submit"
          disabled={!isValid}
          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold"
        >
          Klar!
        </Button>
      </form>
    </div>
  );
} 