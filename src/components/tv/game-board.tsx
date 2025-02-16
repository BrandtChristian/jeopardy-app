"use client";

import { Card } from "@/components/ui/card";
import { QuestionReveal } from "./question-reveal";
import { cn, gameBoard } from "@/lib/styles";
import { useGameState, useGameActions } from "@/lib/context/GameStateContext";

export function GameBoard() {
  const { state } = useGameState();
  const { selectQuestion, clearQuestion } = useGameActions();

  // Debug logging
  console.log('Game Board State:', {
    categories: state.board.map(c => c.name),
    questionCount: state.board.reduce((acc, cat) => acc + cat.questions.length, 0),
    firstCategory: state.board[0]
  });

  const handleQuestionClick = (category: string, value: number) => {
    const categoryData = state.board.find(c => c.name === category);
    const question = categoryData?.questions.find(q => q.value === value);
    if (question && !question.isAnswered) {
      selectQuestion(question);
    }
  };

  // Sort questions by value to ensure consistent order
  const questionValues = state.board[0]?.questions.map(q => q.value).sort((a, b) => a - b) || [];

  return (
    <>
      <div className="p-6 w-[90vw] mx-auto space-y-4">
        {/* Categories row */}
        <div className="grid grid-cols-6 gap-4">
          {state.board.map((category) => (
            <Card
              key={category.name}
              className={cn(
                "flex items-center justify-center p-4 text-lg font-bold",
                "bg-zinc-900 text-white border-none",
                "uppercase tracking-wide"
              )}
            >
              {category.name}
            </Card>
          ))}
        </div>

        {/* Questions grid - one row for each value */}
        {questionValues.map((value) => (
          <div key={value} className="grid grid-cols-6 gap-4">
            {state.board.map((category) => {
              const question = category.questions.find(q => q.value === value);
              if (!question) return null;

              return (
                <Card
                  key={`${category.name}-${value}`}
                  className={cn(
                    gameBoard.tile.base,
                    question.isAnswered ? gameBoard.tile.disabled : gameBoard.tile.available,
                    "text-white cursor-pointer hover:scale-[1.02] transition-transform",
                    "border border-zinc-600"
                  )}
                  onClick={() => handleQuestionClick(category.name, value)}
                >
                  {question.isAnswered ? "•" : question.value}
                </Card>
              );
            })}
          </div>
        ))}
      </div>

      {/* Question reveal overlay */}
      {state.currentQuestion && (
        <QuestionReveal
          category={state.currentQuestion.category}
          amount={state.currentQuestion.value}
          question={state.currentQuestion.question}
          onDismiss={clearQuestion}
        />
      )}
    </>
  );
} 