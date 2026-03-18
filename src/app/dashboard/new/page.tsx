"use client";

import { useState } from "react";
import Link from "next/link";

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

export default function NewSessionPage() {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [categories, setCategories] = useState<DraftCategory[]>(
    DEFAULT_CATEGORIES.map((c, i) => ({ id: `c${i}`, ...c }))
  );
  const [activeColorId, setActiveColorId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = title.trim().length > 0 && topic.trim().length > 0 && categories.filter((c) => c.name.trim()).length > 0;

  function addCategory() {
    if (categories.length >= 6) return;
    const usedColors = new Set(categories.map((c) => c.color));
    const nextColor = COLOR_PALETTE.find((c) => !usedColors.has(c)) ?? COLOR_PALETTE[0];
    setCategories((prev) => [...prev, { id: `c${Date.now()}`, name: "", color: nextColor }]);
  }

  function removeCategory(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  function updateCategory(id: string, field: "name" | "color", value: string) {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value } : c));
    if (field === "color") setActiveColorId(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    const validCats = categories.filter((c) => c.name.trim());
    const sessionId = `session-${Date.now()}`;

    // Store in sessionStorage so dashboard can pick it up
    const newSession = {
      id: sessionId,
      title: title.trim(),
      topic: topic.trim(),
      status: "active" as const,
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

    try {
      const existing = JSON.parse(localStorage.getItem("createdSessions") || "[]");
      localStorage.setItem("createdSessions", JSON.stringify([newSession, ...existing]));
    } catch {
      // localStorage unavailable, proceed anyway
    }

    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0d0d14]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            ダッシュボードに戻る
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-sm font-medium">新しいセッション</span>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">新しいセッションを作成</h1>
          <p className="text-gray-400 text-sm mt-1">ブレストセッションの情報を入力してください</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              セッションタイトル <span className="text-indigo-400">*</span>
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: Q2プロダクト戦略ブレスト"
              maxLength={50}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <p className="text-xs text-gray-600 mt-1 text-right">{title.length}/50</p>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              テーマ・問い <span className="text-indigo-400">*</span>
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例: 2026年Q2に注力すべきプロダクト機能は何か？"
              maxLength={100}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
            <p className="text-xs text-gray-600 mt-1 text-right">{topic.length}/100</p>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">カテゴリー</label>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveColorId(activeColorId === cat.id ? null : cat.id)}
                    className="w-8 h-8 rounded-lg flex-shrink-0 border-2 hover:scale-110 transition-all"
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

            {activeColorId && (
              <div className="mt-2 bg-[#1e1e30] border border-white/10 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-2">カラーを選択</p>
                <div className="flex gap-1.5 flex-wrap">
                  {COLOR_PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateCategory(activeColorId, "color", color)}
                      className="w-6 h-6 rounded-full transition-all hover:scale-110"
                      style={{
                        backgroundColor: color,
                        outline: categories.find((c) => c.id === activeColorId)?.color === color ? `2px solid ${color}` : "none",
                        outlineOffset: "2px",
                        opacity: categories.find((c) => c.id === activeColorId)?.color === color ? 1 : 0.5,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {categories.length < 6 && (
              <button
                type="button"
                onClick={addCategory}
                className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-2.5 text-sm text-gray-500 hover:text-gray-300 hover:border-white/30 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                カテゴリーを追加
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link
              href="/dashboard"
              className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-gray-400 hover:bg-white/5 transition-colors text-center"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="flex-1 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed py-3 text-sm text-white font-medium transition-colors"
            >
              {submitting ? "作成中..." : "セッションを作成"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
