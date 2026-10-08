import Link from "next/link";
import { BookOpen, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-room-bg flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-3xl bg-room-wood-light flex items-center justify-center text-room-wood-deep mb-4 shadow-sm">
        <BookOpen className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black text-room-text-main mb-2">페이지를 찾을 수 없습니다 (404)</h2>
      <p className="text-sm text-room-text-muted mb-6 max-w-sm">
        요청하신 페이지가 존재하지 않거나 이동되었습니다. 내 공부방 메인 책상으로 돌아가 보세요.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-room-wood-dark hover:bg-room-wood-deep text-white text-sm font-bold flex items-center gap-2 shadow-sm transition-all"
      >
        <Home className="w-4 h-4" />
        <span>공부방 메인으로 가기</span>
      </Link>
    </div>
  );
}
