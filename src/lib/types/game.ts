export interface Player {
  id: string;
  name: string;
  color: 'green' | 'blue' | 'red' | 'yellow' | 'purple';
  score: number;
  isReady: boolean;
}

export interface Question {
  id: string;
  category: string;
  amount: number;
  value: number;
  question: string;
  answer: string;
  isRevealed?: boolean;
  isAnswered?: boolean;
}

export interface Category {
  name: string;
  questions: Question[];
}

export type QuestionsByCategory = {
  [category: string]: Question[];
};

export interface GameState {
  gameCode: string;
  isActive: boolean;
  players: Player[];
  currentQuestion: Question | null;
  buzzOrder: string[]; // Array of player IDs
  board: Category[];
  timer: {
    isActive: boolean;
    seconds: number;
    defaultDuration: number;
  };
  connections: {
    hostConnected: boolean;
    tvConnected: boolean;
  };
} 