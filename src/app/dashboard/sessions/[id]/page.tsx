"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { getSessionById, mockPostTimeSeries } from "@/lib/mock-data";
import SessionStatusBadge from "@/components/dashboard/SessionStatusBadge";
import StatCard from "@/components/dashboard/StatCard";
import IdeaRanking from "@/components/dashboard/IdeaRanking";
import PostTrendChart from "@/components/dashboard/PostTrendChart";
import CategoryDistributionChart from "@/components/dashboard/CategoryDistributionChart";
import { Session } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function SessionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    // First check mock data
    const mock = getSessionById(id);
    if (mock) {
      setSession(mock);
      return;
    }
    // Then check localStorage for user-created sessions
    try {
      const stored = JSON.parse(localStorage.getItem("createdSessions") || "[]") as Session[];
      const found = stored.find((s) => s.id === id);
      setSession(found ?? null);
    } catch {
      setSession(null);
    }
  }, [id]);

  if (session === undefined) {
    return <div className="min-h-screen bg-[#0d0d14]" />;
  }

  if (session === null) {
    notFound();
  }

  const topPost = [...session.posts].sort((a, b) => b.likes - a.likes)[0];

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0d0d14]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">BrainstormAI</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">ホスト: 山本 太郎</span>
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-sm font-medium text-indigo-300">
              山
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/dashboard" className="hover:text-indigo-400 transition-colors">ダッシュボード</Link>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          <span className="text-gray-300 truncate">{session.title}</span>
        </div>

        {/* Session header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-2xl font-bold">{session.title}</h1>
              <SessionStatusBadge status={session.status} />
            </div>
            <p className="text-gray-400 text-sm">テーマ: {session.topic}</p>
            <p className="text-gray-600 text-xs mt-1">
              開始: {formatDate(session.createdAt)}
              {session.endedAt && <> &nbsp;／&nbsp; 終了: {formatDate(session.endedAt)}</>}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href={`/sessions/${session.id}`}
              className="flex items-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition-colors px-4 py-2 text-sm font-medium text-white"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              ボードを開く
            </Link>
            {session.status === "active" && (
              <>
                <button className="rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors px-4 py-2 text-sm font-medium">
                  一時停止
                </button>
                <button className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors px-4 py-2 text-sm font-medium">
                  終了
                </button>
              </>
            )}
            <button className="rounded-xl bg-white/10 hover:bg-white/15 transition-colors px-4 py-2 text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              URLをコピー
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="参加者数"
            value={session.participantCount}
            sub="現在参加中"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
            accent="bg-pink-500/10 text-pink-400"
          />
          <StatCard
            label="総投稿数"
            value={session.postCount}
            sub="件のアイデア"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>}
            accent="bg-amber-500/10 text-amber-400"
          />
          <StatCard
            label="カテゴリー数"
            value={session.categories.length}
            sub="個のカテゴリー"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>}
          />
          <StatCard
            label="最多いいね"
            value={topPost ? topPost.likes : 0}
            sub={topPost ? topPost.content.slice(0, 12) + "…" : "-"}
            icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg>}
            accent="bg-indigo-500/10 text-indigo-400"
          />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Post trend */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-sm font-semibold text-gray-300 mb-4">投稿数の推移</h2>
            <PostTrendChart data={mockPostTimeSeries} />
          </div>

          {/* Category distribution */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-sm font-semibold text-gray-300 mb-4">カテゴリー別分布</h2>
            <CategoryDistributionChart categories={session.categories} />
          </div>
        </div>

        {/* Bottom section: ranking + category breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Idea ranking */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-sm font-semibold text-gray-300 mb-4">人気アイデアランキング</h2>
            <IdeaRanking posts={session.posts} />
          </div>

          {/* Category breakdown */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-sm font-semibold text-gray-300 mb-4">カテゴリー別投稿数</h2>
            <div className="space-y-3">
              {session.postCount > 0 ? session.categories.map((cat) => {
                const pct = Math.round((cat.postCount / session.postCount) * 100);
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="text-gray-300">{cat.name}</span>
                      </div>
                      <span className="text-gray-500">{cat.postCount}件 ({pct}%)</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                    </div>
                  </div>
                );
              }) : (
                <p className="text-gray-500 text-sm">まだ投稿がありません</p>
              )}
            </div>
          </div>
        </div>

        {/* Export section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">エクスポート</h2>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-4 py-2.5 text-sm text-gray-300">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
              全投稿テキスト
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-4 py-2.5 text-sm text-gray-300">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 19.5m0-9.75A1.125 1.125 0 0113.125 9.75h3.375m-7.5 0H9m1.125-1.125V5.625m0 12.75a1.125 1.125 0 01-1.125 1.125H9.75A1.125 1.125 0 018.625 19.5m3.75-9.75V8.625c0-.621-.504-1.125-1.125-1.125H9.75" /></svg>
              CSV形式
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-4 py-2.5 text-sm text-gray-300">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              AIサマリー付き議事録
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
