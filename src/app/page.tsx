import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  async function createSession(formData: FormData) {
    "use server";
    const title = (formData.get("title") as string)?.trim();
    if (!title) {
      redirect("/?error=empty");
    }
    const description = (formData.get("description") as string)?.trim() ?? "";
    const sessionId = `session-${Date.now()}`;
    const session = {
      id: sessionId,
      title,
      topic: description || title,
      status: "active",
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
    const cookieStore = await cookies();
    cookieStore.set(`brainstorm-session-${sessionId}`, JSON.stringify(session), {
      httpOnly: false,
      maxAge: 60 * 60 * 24,
    });
    redirect(`/sessions/${sessionId}`);
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

        <form action={createSession} className="space-y-4">
          <div>
            <input
              name="title"
              autoFocus
              placeholder="テーマ（例：新サービスのアイデア）"
              maxLength={50}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-400 transition-colors"
            />
            {error === "empty" && (
              <p className="mt-1.5 text-xs text-red-500">テーマを入力してください</p>
            )}
          </div>

          <div>
            <textarea
              name="description"
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
