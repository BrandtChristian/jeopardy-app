"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuestionRevealProps {
  category: string;
  amount: number;
  question: string;
  onDismiss: () => void;
}

export function QuestionReveal({ category, amount, question, onDismiss }: QuestionRevealProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="w-[90vw] max-w-6xl space-y-6">
        {/* Category and amount */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide">{category}</h2>
          <p className="text-xl text-white/80">${amount}</p>
        </div>

        {/* Question card */}
        <Card className="p-12 bg-zinc-900 border-zinc-700 shadow-2xl">
          <p className="text-4xl font-bold text-center text-white leading-relaxed">
            {question}
          </p>
        </Card>

        {/* Temporary dismiss button - will be replaced with host control */}
        <div className="text-center pt-6">
          <Button 
            variant="outline" 
            onClick={onDismiss}
            className="text-white border-white/20 hover:bg-white/10 hover:text-white"
          >
            Luk
          </Button>
        </div>
      </div>
    </div>
  );
} 