"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, BookOpen, PenTool, Lightbulb, Coffee } from "lucide-react";

export const LoadingDesk: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    "유튜브 영상 / 교재 문서 내용을 꼼꼼히 파악하는 중...",
    "핵심 개념 및 주제별 요점을 정리하는 중...",
    "발표용 PPT 슬라이드와 스크립트를 작성하는 중...",
    "시험 대비 객관식·주관식 기출문제를 출제하는 중...",
    "한눈에 읽는 마인드맵 계층 트리를 구성하는 중...",
    "공부방 책장 서랍에 학습 자료를 정리하여 넣는 중..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full bg-room-beige/40 rounded-3xl p-8 sm:p-12 border-2 border-room-wood/40 flex flex-col items-center justify-center text-center space-y-6 animate-pulse">
      {/* 귀여운 데스크 오브젝트 애니메이션 */}
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-room-accent-warm to-amber-500 flex items-center justify-center text-white shadow-xl shadow-room-accent-warm/30 animate-bounce">
          <Sparkles className="w-10 h-10" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-room-wood-dark text-white flex items-center justify-center shadow-md">
          <PenTool className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h3 className="text-lg sm:text-xl font-black text-room-text-main">
          AI가 책상 위에서 학습 자료를 제작하고 있습니다
        </h3>
        <p className="text-xs sm:text-sm text-room-accent-warm font-semibold min-h-[24px]">
          {steps[stepIndex]}
        </p>
        <p className="text-[11px] text-room-text-muted">
          단 한 번의 요청으로 4종 세트(요약, PPT, 시험지, 마인드맵)가 생성됩니다. 잠시만 기다려 주세요!
        </p>
      </div>

      {/* 로딩 바 */}
      <div className="w-64 h-2 bg-room-wood-light/60 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-room-accent-warm to-amber-500 animate-pulse w-3/4 rounded-full" />
      </div>
    </div>
  );
};
