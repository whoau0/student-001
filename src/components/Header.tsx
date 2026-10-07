"use client";

import React from "react";
import { Sparkles, BookOpen, Clock, Coffee } from "lucide-react";

interface HeaderProps {
  modelUsed?: string;
  isGenerating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ modelUsed, isGenerating }) => {
  return (
    <header className="w-full bg-room-beige/80 backdrop-blur-md border-b border-room-wood/30 sticky top-0 z-40 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* 로고 & 타이틀 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-room-accent-warm to-room-wood-dark flex items-center justify-center text-white shadow-md shadow-room-accent-warm/20 ring-2 ring-white">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-room-text-main flex items-center gap-1.5">
                내 공부방 <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-room-accent-warm/15 text-room-accent-warm">AI Study Desk</span>
              </h1>
            </div>
            <p className="text-xs text-room-text-muted">
              유튜브 링크 & 문서 파일로 완성하는 원클릭 맞춤 학습 자료
            </p>
          </div>
        </div>

        {/* 상단 우측 상태 표시 / 메타포 위젯 */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs">
          {/* AI 모델 뱃지 */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-room-wood/30 shadow-sm">
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin text-room-accent-yellow" : "text-room-accent-olive"}`} />
            <span className="text-room-text-muted">엔진:</span>
            <span className="font-bold text-room-text-main">
              {isGenerating ? "자료 분석 중..." : (modelUsed || "gemini-3.8-flash (대기중)")}
            </span>
          </div>

          {/* 따뜻한 커피 감성 인디케이터 */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-room-wood-light/40 border border-room-wood/20 text-room-wood-deep">
            <Coffee className="w-3.5 h-3.5 text-room-wood-dark" />
            <span className="font-medium">집중 모드 On</span>
          </div>
        </div>
      </div>
    </header>
  );
};
