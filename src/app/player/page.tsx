"use client";

import { PreLobby } from "@/components/player/pre-lobby";
import { BuzzerScreen } from "@/components/player/buzzer-screen";
import { useGameState } from "@/lib/context/GameStateContext";
import { useEffect, useState } from "react";

export default function PlayerPage() {
  const { state } = useGameState();
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedPlayerId = localStorage.getItem('playerId');
    setPlayerId(storedPlayerId);
  }, []);

  // Don't render anything until we're on the client
  if (!isClient) {
    return null;
  }

  const player = playerId ? state.players.find(p => p.id === playerId) : null;

  // If no player is found, or player hasn't joined yet, show pre-lobby
  if (!player || !player.isReady) {
    return <PreLobby />;
  }

  // If game is active, show buzzer screen
  if (state.isActive) {
    return <BuzzerScreen />;
  }

  // If player has joined but game hasn't started, show waiting screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-900 text-white text-center space-y-4">
      <h2 className="text-2xl font-bold">Klar til at spille!</h2>
      <p className="text-zinc-400">Venter på at værten starter spillet...</p>
      <div className="animate-spin w-8 h-8 border-4 border-zinc-600 border-t-white rounded-full" />
    </div>
  );
} 