export type Question = {
  id: number;
  question_name: string;
  question_link: string;
  topic_id: number;
  platform: 'LEETCODE' | 'GFG' | 'INTERVIEWBIT' | 'OTHER';
  level: 'EASY' | 'MEDIUM' | 'HARD';
  type: 'HOMEWORK' | 'CLASSWORK';
  topic?: {
    topic_name: string;
    slug: string;
  };
  created_at?: string;
  updated_at?: string;
};

export type CreateQuestionData = {
  question_name: string;
  question_link: string;
  topic_id: number;
  level?: 'EASY' | 'MEDIUM' | 'HARD';
  type?: 'HOMEWORK' | 'CLASSWORK';
};

export type UpdateQuestionData = Partial<CreateQuestionData>;

export type QuestionsResponse = {
  data: Question[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
