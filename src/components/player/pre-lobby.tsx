"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, containers, typography, teamColors } from "@/lib/styles";

// Type for team color options
type TeamColor = keyof typeof teamColors;

interface PreLobbyProps {
  onReady: (playerName: string, teamColor: TeamColor) => void;
}

export function PreLobby({ onReady }: PreLobbyProps) {
  const [playerName, setPlayerName] = useState("");
  const [selectedColor, setSelectedColor] = useState<TeamColor | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName && selectedColor) {
      onReady(playerName, selectedColor);
    }
  };

  return (
    <Card className={cn(containers.card, "w-[90%] max-w-[400px]")}>
      <CardHeader>
        <CardTitle className={typography.h3}>Vælg dit hold</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name input */}
          <div className="space-y-2">
            <label htmlFor="playerName" className="text-sm font-medium">
              Dit navn
            </label>
            <Input
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Indtast dit navn..."
              required
              minLength={2}
              maxLength={20}
            />
          </div>

          {/* Color selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Vælg farve
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(teamColors) as TeamColor[]).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "h-20 rounded-lg transition-all duration-200",
                    teamColors[color].primary,
                    teamColors[color].hover,
                    selectedColor === color && "ring-4 ring-white ring-opacity-60"
                  )}
                  aria-label={`Vælg ${color} hold`}
                />
              ))}
            </div>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!playerName || !selectedColor}
          >
            Klar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 