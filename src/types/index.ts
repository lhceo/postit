export type SessionStatus = "active" | "paused" | "ended";

export interface Session {
  id: string;
  title: string;
  topic: string;
  status: SessionStatus;
  participantCount: number;
  postCount: number;
  createdAt: string;
  endedAt?: string;
  categories: Category[];
  posts: Post[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  postCount: number;
}

export interface Post {
  id: string;
  content: string;
  authorName: string;
  isAnonymous: boolean;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  likes: number;
  createdAt: string;
}

export interface PostTimeSeries {
  time: string;
  count: number;
}
