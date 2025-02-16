import { Question, QuestionsByCategory } from './types/game';
import questionsData from '../data/questions.json';

// Type assertion to help TypeScript understand our data structure
const typedQuestionsData = questionsData as unknown as QuestionsByCategory;

export function getQuestionsByCategory(): QuestionsByCategory {
  // Convert the raw data and ensure all required properties are set
  const processedData: QuestionsByCategory = {};
  
  for (const [category, questions] of Object.entries(typedQuestionsData)) {
    processedData[category] = (questions as Question[]).map(q => ({
      ...q,
      value: q.amount,
      isRevealed: false,
      isAnswered: false
    }));
  }
  
  return processedData;
}

export function getQuestion(category: string, amount: number): Question | undefined {
  const categoryQuestions = typedQuestionsData[category] as Question[];
  return categoryQuestions?.find((q) => q.amount === amount);
}

export function getAllCategories(): string[] {
  return Object.keys(typedQuestionsData);
}

export function getAmounts(): number[] {
  // Get amounts from first category (they're the same for all categories)
  const firstCategory = Object.values(typedQuestionsData)[0] as Question[];
  return firstCategory.map((q) => q.amount).sort((a, b) => a - b);
} 