export interface Question {
  category: string;
  amount: number;
  question: string;
  answer: string;  // For the host view later
  id: string;
}

export type QuestionsByCategory = {
  [category: string]: Question[];
}; 