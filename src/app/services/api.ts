import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AskQuestionRequest {
  question: string;
}

export interface AskQuestionResponse {
  answer: string;
  sources?: string[];
}

export interface GenerateQuizRequest {
  topic: string;
  num_questions?: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface GenerateQuizResponse {
  questions: QuizQuestion[];
}

export interface EvaluateQuizRequest {
  quiz: QuizQuestion[];
  user_answers: string[];
}

export interface EvaluateQuizResponse {
  score: number;
  total: number;
  percentage: number;
  results: Array<{
    question: string;
    user_answer: string;
    correct_answer: string;
    is_correct: boolean;
  }>;
}

export interface UserStats {
  modulesCompleted: number;
  quizScore: number;
  learningStreak: number;
  skillsEarned: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  isCompleted: boolean;
}

export interface ModuleContent {
  id: string;
  title: string;
  moduleNumber: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
}

export const askQuestion = async (question: string): Promise<AskQuestionResponse> => {
  const response = await api.post<AskQuestionResponse>('/ask', { question });
  return response.data;
};

export const generateQuiz = async (topic: string, num_questions: number = 5): Promise<GenerateQuizResponse> => {
  const response = await api.post('/quiz', { topic, num_questions });
  return response.data.data;
};

export const evaluateQuiz = async (quiz: QuizQuestion[], user_answers: string[]): Promise<EvaluateQuizResponse> => {
  const response = await api.post<EvaluateQuizResponse>('/evaluate', { quiz, user_answers });
  return response.data;
};

// User Stats API
export const getUserStats = async (walletAddress: string): Promise<UserStats> => {
  // TODO: Implement backend endpoint
  // const response = await api.get<UserStats>(`/api/users/${walletAddress}/stats`);
  // return response.data;
  
  // Return empty stats for now
  return {
    modulesCompleted: 0,
    quizScore: 0,
    learningStreak: 0,
    skillsEarned: 0,
  };
};

// Modules API
export const getModules = async (): Promise<Module[]> => {
  // TODO: Implement backend endpoint
  // const response = await api.get<Module[]>('/api/modules');
  // return response.data;
  
  // Return empty array for now
  return [];
};

export const getModuleContent = async (moduleId: string): Promise<ModuleContent> => {
  // TODO: Implement backend endpoint
  // const response = await api.get<ModuleContent>(`/api/modules/${moduleId}`);
  // return response.data;
  
  // Return empty content for now
  return {
    id: moduleId,
    title: 'Module',
    moduleNumber: '1',
    sections: [],
  };
};

export default api;
