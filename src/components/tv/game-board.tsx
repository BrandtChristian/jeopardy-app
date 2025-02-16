"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { QuestionReveal } from "./question-reveal";
import { cn, gameBoard } from "@/lib/styles";
import { getAllCategories, getAmounts } from "@/lib/questions";

// Get categories and amounts from our questions data
const CATEGORIES = getAllCategories();
const AMOUNTS = getAmounts();

interface GameBoardProps {
  onQuestionSelect?: (category: string, amount: number) => void;
}

export function GameBoard({ onQuestionSelect }: GameBoardProps) {
  const [revealedQuestion, setRevealedQuestion] = useState<{
    category: string;
    amount: number;
  } | null>(null);

  // Track answered questions
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());

  const handleQuestionClick = (category: string, amount: number) => {
    const questionId = `${category}-${amount}`;
    if (!answeredQuestions.has(questionId)) {
      setRevealedQuestion({ category, amount });
      onQuestionSelect?.(category, amount);
    }
  };

  const handleDismiss = () => {
    if (revealedQuestion) {
      const questionId = `${revealedQuestion.category}-${revealedQuestion.amount}`;
      setAnsweredQuestions(prev => new Set([...prev, questionId]));
      setRevealedQuestion(null);
    }
  };

  return (
    <>
      <div className={gameBoard.grid}>
        {/* Categories */}
        {CATEGORIES.map((category) => (
          <Card
            key={category}
            className={cn(
              "flex items-center justify-center p-4 text-lg font-bold",
              "bg-zinc-900 text-white border-none",
              "uppercase tracking-wide"
            )}
          >
            {category}
          </Card>
        ))}

        {/* Questions */}
        {CATEGORIES.map((category) =>
          AMOUNTS.map((amount) => {
            const questionId = `${category}-${amount}`;
            const isAnswered = answeredQuestions.has(questionId);

            return (
              <Card
                key={questionId}
                className={cn(
                  gameBoard.tile.base,
                  isAnswered ? gameBoard.tile.disabled : gameBoard.tile.available,
                  "text-white cursor-pointer hover:scale-[1.02] transition-transform",
                  "border border-zinc-600"
                )}
                onClick={() => handleQuestionClick(category, amount)}
              >
                {isAnswered ? "•" : amount}
              </Card>
            );
          })
        )}
      </div>

      {/* Question reveal overlay */}
      {revealedQuestion && (
        <QuestionReveal
          category={revealedQuestion.category}
          amount={revealedQuestion.amount}
          onDismiss={handleDismiss}
        />
      )}
    </>
  );
} 