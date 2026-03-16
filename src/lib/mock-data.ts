import { Session, PostTimeSeries } from "@/types";

export const mockSessions: Session[] = [
  {
    id: "session-001",
    title: "Q2プロダクト戦略ブレスト",
    topic: "2026年Q2に注力すべきプロダクト機能は何か？",
    status: "active",
    participantCount: 12,
    postCount: 47,
    createdAt: "2026-03-16T09:00:00Z",
    categories: [
      { id: "c1", name: "UX改善", color: "#6366F1", postCount: 18 },
      { id: "c2", name: "パフォーマンス", color: "#10B981", postCount: 12 },
      { id: "c3", name: "新機能", color: "#F59E0B", postCount: 17 },
    ],
    posts: [
      { id: "p1", content: "ダッシュボードのレスポンスを改善する", authorName: "田中", isAnonymous: false, categoryId: "c2", categoryName: "パフォーマンス", categoryColor: "#10B981", likes: 9, createdAt: "2026-03-16T09:05:00Z" },
      { id: "p2", content: "AIによる自動タグ付け機能", authorName: "匿名", isAnonymous: true, categoryId: "c3", categoryName: "新機能", categoryColor: "#F59E0B", likes: 8, createdAt: "2026-03-16T09:08:00Z" },
      { id: "p3", content: "モバイルUIの全面刷新", authorName: "鈴木", isAnonymous: false, categoryId: "c1", categoryName: "UX改善", categoryColor: "#6366F1", likes: 7, createdAt: "2026-03-16T09:12:00Z" },
      { id: "p4", content: "リアルタイム通知システム", authorName: "匿名", isAnonymous: true, categoryId: "c3", categoryName: "新機能", categoryColor: "#F59E0B", likes: 6, createdAt: "2026-03-16T09:15:00Z" },
      { id: "p5", content: "検索機能の強化", authorName: "佐藤", isAnonymous: false, categoryId: "c1", categoryName: "UX改善", categoryColor: "#6366F1", likes: 5, createdAt: "2026-03-16T09:20:00Z" },
    ],
  },
  {
    id: "session-002",
    title: "チームビルディングアイデア",
    topic: "リモートチームの結束力を高めるには？",
    status: "ended",
    participantCount: 8,
    postCount: 32,
    createdAt: "2026-03-14T14:00:00Z",
    endedAt: "2026-03-14T15:30:00Z",
    categories: [
      { id: "c4", name: "オンライン施策", color: "#6366F1", postCount: 15 },
      { id: "c5", name: "オフライン施策", color: "#EC4899", postCount: 10 },
      { id: "c6", name: "ツール導入", color: "#14B8A6", postCount: 7 },
    ],
    posts: [
      { id: "p6", content: "週次バーチャル雑談タイム", authorName: "匿名", isAnonymous: true, categoryId: "c4", categoryName: "オンライン施策", categoryColor: "#6366F1", likes: 11, createdAt: "2026-03-14T14:10:00Z" },
      { id: "p7", content: "四半期ごとのオフサイト", authorName: "山田", isAnonymous: false, categoryId: "c5", categoryName: "オフライン施策", categoryColor: "#EC4899", likes: 9, createdAt: "2026-03-14T14:20:00Z" },
      { id: "p8", content: "Slackでの感謝チャンネル設置", authorName: "匿名", isAnonymous: true, categoryId: "c6", categoryName: "ツール導入", categoryColor: "#14B8A6", likes: 7, createdAt: "2026-03-14T14:30:00Z" },
    ],
  },
  {
    id: "session-003",
    title: "マーケティング戦略会議",
    topic: "新規ユーザー獲得のための施策は？",
    status: "ended",
    participantCount: 6,
    postCount: 28,
    createdAt: "2026-03-10T10:00:00Z",
    endedAt: "2026-03-10T11:00:00Z",
    categories: [
      { id: "c7", name: "SNS戦略", color: "#F59E0B", postCount: 12 },
      { id: "c8", name: "コンテンツ", color: "#6366F1", postCount: 9 },
      { id: "c9", name: "パートナーシップ", color: "#10B981", postCount: 7 },
    ],
    posts: [
      { id: "p9", content: "TikTok活用でZ世代へのリーチ", authorName: "中村", isAnonymous: false, categoryId: "c7", categoryName: "SNS戦略", categoryColor: "#F59E0B", likes: 8, createdAt: "2026-03-10T10:15:00Z" },
      { id: "p10", content: "事例紹介コンテンツの拡充", authorName: "匿名", isAnonymous: true, categoryId: "c8", categoryName: "コンテンツ", categoryColor: "#6366F1", likes: 7, createdAt: "2026-03-10T10:25:00Z" },
    ],
  },
  {
    id: "session-004",
    title: "カスタマーサポート改善",
    topic: "顧客満足度を上げるために何ができるか？",
    status: "paused",
    participantCount: 5,
    postCount: 19,
    createdAt: "2026-03-15T13:00:00Z",
    categories: [
      { id: "c10", name: "対応速度", color: "#EF4444", postCount: 8 },
      { id: "c11", name: "FAQ整備", color: "#8B5CF6", postCount: 6 },
      { id: "c12", name: "自動化", color: "#06B6D4", postCount: 5 },
    ],
    posts: [
      { id: "p11", content: "AIチャットボットの導入", authorName: "匿名", isAnonymous: true, categoryId: "c12", categoryName: "自動化", categoryColor: "#06B6D4", likes: 6, createdAt: "2026-03-15T13:10:00Z" },
      { id: "p12", content: "よくある質問のナレッジベース構築", authorName: "伊藤", isAnonymous: false, categoryId: "c11", categoryName: "FAQ整備", categoryColor: "#8B5CF6", likes: 5, createdAt: "2026-03-15T13:20:00Z" },
    ],
  },
];

export const mockPostTimeSeries: PostTimeSeries[] = [
  { time: "09:00", count: 0 },
  { time: "09:05", count: 5 },
  { time: "09:10", count: 12 },
  { time: "09:15", count: 20 },
  { time: "09:20", count: 29 },
  { time: "09:25", count: 38 },
  { time: "09:30", count: 47 },
];

export function getSessionById(id: string): Session | undefined {
  return mockSessions.find((s) => s.id === id);
}
