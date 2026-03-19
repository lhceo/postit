"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError(true);
      return;
    }

    const sessionId = `session-${Date.now()}`;
    const session = {
      id: sessionId,
      title: trimmedTitle,
      topic: description.trim() || trimmedTitle,
      status: "active" as const,
      participantCount: 0,
      postCount: 0,
      createdAt: new Date().toISOString(),
      categories: [
        { id: `${sessionId}-c0`, name: "アイデア", color: "#6366F1", postCount: 0 },
        { id: `${sessionId}-c1`, name: "課題", color: "#EF4444", postCount: 0 },
        { id: `${sessionId}-c2`, name: "提案", color: "#10B981", postCount: 0 },
      ],
      posts: [],
    };

    try {
      const existing = JSON.parse(localStorage.getItem("createdSessions") || "[]");
      localStorage.setItem("createdSessions", JSON.stringify([session, ...existing]));
    } catch {
      // localStorage unavailable
    }

    router.push(`/sessions/${sessionId}`);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#fdf8ef" }}
    >
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">BrainstormAI</h1>
        <p className="text-gray-500">AIがアイデアを整理するブレスト空間</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">新しいセッション</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              autoFocus
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(false); }}
              placeholder="テーマ（例：新サービスのアイデア）"
              maxLength={50}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-400 transition-colors"
            />
            {error && (
              <p className="mt-1.5 text-xs text-red-500">テーマを入力してください</p>
            )}
          </div>

          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="説明（任意）"
              maxLength={200}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-400 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl py-3 text-white font-semibold text-sm transition-opacity"
            style={{ backgroundColor: "#f97316" }}
          >
            作成する
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            戻る
          </a>
        </div>
      </div>
    </div>
  );
}
