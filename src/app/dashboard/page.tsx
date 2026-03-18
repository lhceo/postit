"use client";

import { useState } from "react";
import Link from "next/link";
import { mockSessions } from "@/lib/mock-data";
import SessionStatusBadge from "@/components/dashboard/SessionStatusBadge";
import StatCard from "@/components/dashboard/StatCard";
import { Session, Category } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

const COLOR_PALETTE = [
  "#6366F1", "#10B981", "#F59E0B", "#EC4899",
  "#14B8A6", "#EF4444", "#8B5CF6", "#06B6D4",
];

const DEFAULT_CATEGORIES = [
  { name: "アイデア", color: "#6366F1" },
  { name: "課題", color: "#EF4444" },
  { name: "提案", color: "#10B981" },
];

interface DraftCategory {
  id: string;
  name: string;
  color: string;
}

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {COLOR_PALETTE.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className="w-6 h-6 rounded-full transition-all"
          style={{
            backgroundColor: color,
            outline: value === color ? `2px solid ${color}` : "none",
            outlineOffset: "2px",
            opacity: value === color ? 1 : 0.5,
            transform: value === color ? "scale(1.15)" : "scale(1)",
          }}
        />
      ))}
    </div>
  );
}

function CreateSessionModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (session: Session) => void;
}) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [categories, setCategories] = useState<DraftCategory[]>(
    DEFAULT_CATEGORIES.map((c, i) => ({ id: `new-c${i}`, ...c }))
  );
  const [activeColorId, setActiveColorId] = useState<string | null>(null);

  function addCategory() {
    if (categories.length >= 6) return;
    const usedColors = new Set(categories.map((c) => c.color));
    const nextColor = COLOR_PALETTE.find((c) => !usedColors.has(c)) ?? COLOR_PALETTE[0];
    const id = `new-c${Date.now()}`;
    setCategories((prev) => [...prev, { id, name: "", color: nextColor }]);
  }

  function removeCategory(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  function updateCategory(id: string, field: "name" | "color", value: string) {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value } : c));
    if (field === "color") setActiveColorId(null);
  }

  function handleSubmit() {
    const validCats = categories.filter((c) => c.name.trim());
    if (!title.trim() || !topic.trim() || validCats.length === 0) return;

    const sessionId = `session-${Date.now()}`;
    const newSession: Session = {
      id: sessionId,
      title: title.trim(),
      topic: topic.trim(),
      status: "active",
      participantCount: 0,
      postCount: 0,
      createdAt: new Date().toISOString(),
      categories: validCats.map((c, i) => ({
        id: `${sessionId}-c${i}`,
        name: c.name.trim(),
        color: c.color,
        postCount: 0,
      })),
      posts: [],
    };
    onSubmit(newSession);
  }

  const canProceed = title.trim().length > 0 && topic.trim().length > 0;
  const canSubmit = canProceed && categories.filter((c) => c.name.trim()).length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#13131f] border border-white/10 rounded-2xl w-full max-w-lg mx-4 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-white font-semibold">新しいセッション</h2>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    s < step
                      ? "bg-indigo-500 text-white"
                      : s === step
                      ? "bg-indigo-500 text-white ring-2 ring-indigo-500/30"
                      : "bg-white/10 text-gray-500"
                  }`}
                >
                  {s < step ? (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s}
                </div>
                <span className={`text-xs ${s === step ? "text-gray-300" : "text-gray-600"}`}>
                  {s === 1 ? "基本情報" : "カテゴリー"}
                </span>
                {s < 2 && <div className={`w-8 h-px ${s < step ? "bg-indigo-500" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  セッションタイトル <span className="text-indigo-400">*</span>
                </label>
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例: Q2プロダクト戦略ブレスト"
                  maxLength={50}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white/8 transition-all"
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-600">{title.length}/50</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  テーマ・問い <span className="text-indigo-400">*</span>
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="例: 2026年Q2に注力すべきプロダクト機能は何か？"
                  maxLength={100}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white/8 transition-all resize-none"
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-600">{topic.length}/100</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500">
                投稿を分類するカテゴリーを設定します。後から変更することもできます。
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveColorId(activeColorId === cat.id ? null : cat.id)}
                      className="w-8 h-8 rounded-lg flex-shrink-0 border-2 transition-all hover:scale-110"
                      style={{
                        backgroundColor: cat.color,
                        borderColor: activeColorId === cat.id ? "white" : "transparent",
                      }}
                    />
                    <input
                      value={cat.name}
                      onChange={(e) => updateCategory(cat.id, "name", e.target.value)}
                      placeholder="カテゴリー名"
                      maxLength={20}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => removeCategory(cat.id)}
                      disabled={categories.length <= 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Color picker popover */}
              {activeColorId && (
                <div className="bg-[#1e1e30] border border-white/10 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-2">カラーを選択</p>
                  <ColorPicker
                    value={categories.find((c) => c.id === activeColorId)?.color ?? ""}
                    onChange={(color) => updateCategory(activeColorId, "color", color)}
                  />
                </div>
              )}

              {categories.length < 6 && (
                <button
                  type="button"
                  onClick={addCategory}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-2.5 text-sm text-gray-500 hover:text-gray-300 hover:border-white/30 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  カテゴリーを追加
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-gray-400 hover:bg-white/5 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="button"
                disabled={!canProceed}
                onClick={() => setStep(2)}
                className="flex-1 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed py-2.5 text-sm text-white font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                次へ
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-gray-400 hover:bg-white/5 transition-colors flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                戻る
              </button>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="flex-1 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed py-2.5 text-sm text-white font-medium transition-colors"
              >
                セッションを作成
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [showModal, setShowModal] = useState(false);
  const [newSessionId, setNewSessionId] = useState<string | null>(null);

  const totalSessions = sessions.length;
  const activeSessions = sessions.filter((s) => s.status === "active").length;
  const totalPosts = sessions.reduce((sum, s) => sum + s.postCount, 0);
  const totalParticipants = sessions.reduce((sum, s) => sum + s.participantCount, 0);

  function handleCreateSession(session: Session) {
    setSessions((prev) => [session, ...prev]);
    setNewSessionId(session.id);
    setShowModal(false);
    setTimeout(() => setNewSessionId(null), 3000);
  }

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
        {/* Page title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">ダッシュボード</h1>
            <p className="text-gray-400 text-sm mt-1">セッションの管理と分析</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all px-4 py-2.5 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            新しいセッション
          </button>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="総セッション数"
            value={totalSessions}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>}
          />
          <StatCard
            label="進行中"
            value={activeSessions}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>}
            accent="bg-emerald-500/10 text-emerald-400"
          />
          <StatCard
            label="総投稿数"
            value={totalPosts}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>}
            accent="bg-amber-500/10 text-amber-400"
          />
          <StatCard
            label="総参加者数"
            value={totalParticipants}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
            accent="bg-pink-500/10 text-pink-400"
          />
        </div>

        {/* Session list */}
        <div>
          <h2 className="text-base font-semibold text-gray-300 mb-4">セッション一覧</h2>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`rounded-2xl border transition-all duration-700 p-5 ${
                  session.id === newSessionId
                    ? "border-indigo-500/50 bg-indigo-500/8 shadow-lg shadow-indigo-500/10"
                    : "border-white/10 bg-white/5 hover:border-indigo-500/20"
                }`}
              >
                {session.id === newSessionId && (
                  <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium mb-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    作成しました
                  </div>
                )}
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/dashboard/sessions/${session.id}`} className="flex-1 min-w-0 group">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-medium group-hover:text-indigo-300 transition-colors">{session.title}</h3>
                      <SessionStatusBadge status={session.status} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1 truncate">テーマ: {session.topic}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                        {session.participantCount}名
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                        {session.postCount}件の投稿
                      </span>
                      <span>{formatDate(session.createdAt)}</span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1">
                      {session.categories.map((cat) => (
                        <span key={cat.id} className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} title={cat.name} />
                      ))}
                    </div>
                    <Link
                      href={`/sessions/${session.id}`}
                      className="flex items-center gap-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 px-3 py-1.5 text-xs font-medium transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      ボードを開く
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showModal && (
        <CreateSessionModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateSession}
        />
      )}
    </div>
  );
}
