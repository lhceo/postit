import { Post } from "@/types";

interface Props {
  posts: Post[];
  limit?: number;
}

export default function IdeaRanking({ posts, limit = 5 }: Props) {
  const ranked = [...posts].sort((a, b) => b.likes - a.likes).slice(0, limit);

  return (
    <ol className="space-y-2">
      {ranked.map((post, i) => (
        <li key={post.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
          <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-400 text-gray-900" : i === 1 ? "bg-gray-400 text-gray-900" : i === 2 ? "bg-amber-700 text-white" : "bg-white/10 text-gray-400"}`}>
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{post.content}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: post.categoryColor }} />
              <span className="text-xs text-gray-500">{post.categoryName}</span>
              {post.isAnonymous && <span className="text-xs text-gray-600">匿名</span>}
            </div>
          </div>
          <div className="flex items-center gap-1 text-indigo-400 flex-shrink-0">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span className="text-sm font-semibold">{post.likes}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
