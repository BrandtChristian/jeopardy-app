"use client";

import { Card } from "@/components/ui/card";
import { QuestionReveal } from "./question-reveal";
import { cn, gameBoard } from "@/lib/styles";
import { useGameState, useGameActions } from "@/lib/context/GameStateContext";

export function GameBoard() {
  const { state } = useGameState();
  const { selectQuestion, clearQuestion } = useGameActions();

  const handleQuestionClick = (category: string, value: number) => {
    const categoryData = state.board.find(c => c.name === category);
    const question = categoryData?.questions.find(q => q.value === value);
    if (question && !question.isAnswered) {
      selectQuestion(question);
    }
  };

  return (
    <>
      <div className={gameBoard.grid}>
        {/* Categories */}
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

        {/* Questions */}
        {state.board.map((category) =>
          category.questions.map((question) => (
            <Card
              key={question.id}
              className={cn(
                gameBoard.tile.base,
                question.isAnswered ? gameBoard.tile.disabled : gameBoard.tile.available,
                "text-white cursor-pointer hover:scale-[1.02] transition-transform",
                "border border-zinc-600"
              )}
              onClick={() => handleQuestionClick(category.name, question.value)}
            >
              {question.isAnswered ? "•" : question.value}
            </Card>
          ))
        )}
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