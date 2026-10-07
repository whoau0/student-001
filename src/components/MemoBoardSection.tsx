"use client";

import React from "react";
import { Pin, Cpu, CheckCircle, Lightbulb, Clock, Compass, Target } from "lucide-react";

interface MemoBoardSectionProps {
  modelUsed?: string;
  isGenerating?: boolean;
}

export const MemoBoardSection: React.FC<MemoBoardSectionProps> = ({
  modelUsed,
  isGenerating,
}) => {
  return (
    <div className="w-full bg-[#E5D7C7] p-4 sm:p-5 rounded-2xl border-2 border-room-wood/50 shadow-inner relative overflow-hidden">
      {/* 상단 코르크보드 프레임 타이틀 */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-room-wood-dark/20">
        <div className="flex items-center gap-2">
          <Pin className="w-4 h-4 text-room-accent-warm rotate-45" />
          <span className="font-bold text-xs sm:text-sm text-room-wood-deep">
            공부방 핀보드 & 학습 스케줄러
          </span>
        </div>
        <span className="text-[11px] text-room-wood-dark font-mono">My Memo Board</span>
      </div>

      {/* 포스트잇 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* 포스트잇 1: AI 엔진 상태 */}
        <div className="post-it p-3.5 rounded-xl relative transform -rotate-1 hover:rotate-0 transition-transform duration-200 border border-yellow-200">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-400/90 shadow-sm border border-white" />
          <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI 엔진 라우팅</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-tight">
            현재 연결: <span className="font-bold underline">{modelUsed || "gemini-3.8-flash"}</span>
          </p>
          <p className="text-[10px] text-amber-700/80 mt-1">
            (503 과부하 시 3.5-flash-lite로 자동 전환)
          </p>
        </div>

        {/* 포스트잇 2: 원클릭 생성 팁 */}
        <div className="post-it-coral p-3.5 rounded-xl relative transform rotate-1 hover:rotate-0 transition-transform duration-200 border border-red-200">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-500/90 shadow-sm border border-white" />
          <div className="flex items-center gap-1.5 font-bold text-rose-900 mb-1">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>생성 노하우 TIP</span>
          </div>
          <p className="text-[11px] text-rose-800 leading-tight">
            유튜브 링크만 넣어도 요약·PPT·시험지·마인드맵이 단 1회 요청으로 자동 생성됩니다.
          </p>
        </div>

        {/* 포스트잇 3: 학습 목표 */}
        <div className="post-it-green p-3.5 rounded-xl relative transform -rotate-1 hover:rotate-0 transition-transform duration-200 border border-emerald-200">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-600/90 shadow-sm border border-white" />
          <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>오늘의 학습 목표</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-tight">
            기말고사 & 직무 지식 정리 완성 후 .pptx 및 .docx 파일로 내려받기!
          </p>
        </div>
      </div>
    </div>
  );
};
