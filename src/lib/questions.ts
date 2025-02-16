import { Question, QuestionsByCategory } from './types';
import questionsData from '../data/questions.json';

// Type assertion to help TypeScript understand our data structure
const typedQuestionsData = questionsData as QuestionsByCategory;

export function getQuestionsByCategory(): QuestionsByCategory {
  return typedQuestionsData;
}

export function getQuestion(category: string, amount: number): Question | undefined {
  const categoryQuestions = typedQuestionsData[category];
  return categoryQuestions?.find((q: Question) => q.amount === amount);
}

export function getAllCategories(): string[] {
  return Object.keys(typedQuestionsData);
}

export function getAmounts(): number[] {
  // Get amounts from first category (they're the same for all categories)
  const firstCategory = Object.values(typedQuestionsData)[0];
  return firstCategory.map(q => q.amount).sort((a, b) => a - b);
} 