"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Post, Category, Session } from "@/types";
import { getSessionById } from "@/lib/mock-data";
import { use } from "react";

const POSTIT_COLORS: Record<string, string> = {
  "#6366F1": "bg-indigo-400",
  "#10B981": "bg-emerald-400",
  "#F59E0B": "bg-amber-300",
  "#EC4899": "bg-pink-400",
  "#14B8A6": "bg-teal-400",
  "#EF4444": "bg-red-400",
  "#8B5CF6": "bg-violet-400",
  "#06B6D4": "bg-cyan-400",
};

function getPostitBg(hex: string) {
  return POSTIT_COLORS[hex] ?? "bg-yellow-300";
}

function PostItCard({ post, onLike }: { post: Post; onLike: (id: string) => void }) {
  const [liked, setLiked] = useState(false);
  const bg = getPostitBg(post.categoryColor);

  function handleLike() {
    if (!liked) {
      setLiked(true);
      onLike(post.id);
    }
  }

  return (
    <div
      className={`${bg} rounded-lg shadow-lg p-4 w-48 min-h-[120px] flex flex-col justify-between cursor-default select-none relative group`}
      style={{ transform: `rotate(${((post.id.charCodeAt(1) % 7) - 3) * 1.2}deg)` }}
    >
      <p className="text-gray-900 text-sm font-medium leading-snug break-words">{post.content}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-gray-700 text-xs opacity-70">
          {post.isAnonymous ? "匿名" : post.authorName}
        </span>
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5 transition-all ${liked ? "bg-white/60 text-red-600" : "bg-white/30 text-gray-700 hover:bg-white/50"}`}
        >
          <svg className="w-3 h-3" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {post.likes + (liked ? 1 : 0)}
        </button>
      </div>
    </div>
  );
}

function AddPostModal({
  categories,
  onClose,
  onSubmit,
  nickname,
}: {
  categories: Category[];
  onClose: () => void;
  onSubmit: (content: string, categoryId: string, isAnonymous: boolean) => void;
  nickname: string;
}) {
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [isAnonymous, setIsAnonymous] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim(), categoryId, isAnonymous);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <h2 className="text-white font-semibold text-lg mb-4">アイデアを投稿</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="アイデアを入力してください..."
            rows={4}
            maxLength={200}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400 shrink-0">カテゴリー</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} style={{ backgroundColor: "#1a1a2e" }}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`w-10 h-5 rounded-full transition-colors relative ${isAnonymous ? "bg-indigo-500" : "bg-white/20"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isAnonymous ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm text-gray-400">
              匿名で投稿する {!isAnonymous && <span className="text-gray-600">（{nickname} として投稿）</span>}
            </span>
          </label>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-gray-400 hover:bg-white/5 transition-colors">
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="flex-1 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed py-2.5 text-sm text-white font-medium transition-colors"
            >
              投稿する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function NicknameModal({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0d14]">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <h2 className="text-white font-semibold text-lg mb-1">ニックネームを入力</h2>
        <p className="text-gray-500 text-sm mb-6">セッションに参加するためのニックネームを設定してください</p>
        <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) onSubmit(name.trim()); }} className="space-y-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: 田中、Taro..."
            maxLength={20}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-center"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed py-3 text-sm text-white font-medium transition-colors"
          >
            参加する →
          </button>
        </form>
      </div>
    </div>
  );
}

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const mockSession = getSessionById(id);

  const [resolvedSession, setResolvedSession] = useState<Session | null>(mockSession ?? null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>(mockSession?.posts ?? []);
  const [showModal, setShowModal] = useState(false);
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(null);

  useEffect(() => {
    if (resolvedSession) return;
    try {
      const stored = JSON.parse(sessionStorage.getItem("newSessions") || "[]") as Session[];
      const found = stored.find((s) => s.id === id);
      if (found) {
        setResolvedSession(found);
        setPosts(found.posts);
      } else {
        window.location.href = "/";
      }
    } catch {
      window.location.href = "/";
    }
  }, [id, resolvedSession]);

  function handleJoin(name: string) {
    setNickname(name);
  }

  function handleAddPost(content: string, categoryId: string, isAnonymous: boolean) {
    const cat = resolvedSession!.categories.find((c) => c.id === categoryId)!;
    const newPost: Post = {
      id: `p-${Date.now()}`,
      content,
      authorName: nickname!,
      isAnonymous,
      categoryId,
      categoryName: cat.name,
      categoryColor: cat.color,
      likes: 0,
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
  }

  function handleLike(postId: string) {
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  }

  const filtered = filterCategoryId ? posts.filter((p) => p.categoryId === filterCategoryId) : posts;

  if (!resolvedSession) {
    return (
      <div className="min-h-screen bg-[#0d0d14] flex items-center justify-center">
        <div className="text-gray-500 text-sm">読み込み中...</div>
      </div>
    );
  }

  if (!nickname) {
    return <NicknameModal onSubmit={handleJoin} />;
  }

  return (
    <div className="min-h-screen bg-[#0d0d14] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0d0d14]/90 backdrop-blur-sm sticky top-0 z-20 flex-shrink-0">
        <div className="max-w-full px-6 h-14 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-400 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-white text-sm font-semibold truncate">{resolvedSession.title}</h1>
            <p className="text-gray-500 text-xs truncate">テーマ: {resolvedSession.topic}</p>
          </div>
          {/* Category filters */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setFilterCategoryId(null)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${filterCategoryId === null ? "bg-white/20 text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              すべて
            </button>
            {resolvedSession.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategoryId(cat.id === filterCategoryId ? null : cat.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5 transition-colors ${filterCategoryId === cat.id ? "bg-white/20 text-white" : "text-gray-500 hover:text-gray-300"}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                {cat.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-xs text-gray-500">{posts.length}件</div>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-gray-400">{nickname}</span>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-colors px-4 py-1.5 text-sm font-medium text-white"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              投稿
            </button>
          </div>
        </div>
      </header>

      {/* Board canvas */}
      <div
        className="flex-1 overflow-auto"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff18 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="p-8 flex flex-wrap gap-6 content-start min-h-full">
          {filtered.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-24 opacity-50">
              <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-sm">まだ投稿がありません。<br />最初のアイデアを投稿してみましょう！</p>
            </div>
          )}
          {filtered.map((post) => (
            <PostItCard key={post.id} post={post} onLike={handleLike} />
          ))}
        </div>
      </div>

      {/* Add post modal */}
      {showModal && (
        <AddPostModal
          categories={resolvedSession.categories}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddPost}
          nickname={nickname}
        />
      )}
    </div>
  );
}
