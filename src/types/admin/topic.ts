export type Topic = {
  id: string;
  topic_name: string;
  slug: string;
  photo_url?: string;
  classCount?: number;
  questionCount?: number;
  firstClassCreated_at?: string | null;
};


export type TopicCardProps = {
  topic: Topic;
  onEdit: (topic: Topic) => void;
  onDelete: (topic: Topic) => void;
};


export type TopicsResponse = {
  topics: Topic[];
  pagination: {
    total: number;
    totalPages: number;
  };
};
