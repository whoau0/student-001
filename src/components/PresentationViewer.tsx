"use client";

import React, { useState } from "react";
import { PresentationData, SlideData } from "@/types";
import { Presentation, Download, ChevronLeft, ChevronRight, Mic, Sparkles } from "lucide-react";
import { downloadPptx } from "@/lib/exportUtils";

interface PresentationViewerProps {
  presentation: PresentationData;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({ presentation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showScript, setShowScript] = useState(true);

  const slides = presentation.slides || [];
  const currentSlide: SlideData | undefined = slides[currentSlideIndex];

  return (
    <div className="space-y-6">
      {/* PPT 상단 툴바 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-room-wood/20">
        <div>
          <span className="text-xs font-bold text-room-accent-warm px-2.5 py-1 rounded-md bg-room-accent-warm/10">
            강의 & 발표용 PPT 슬라이드 구성안
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-room-text-main mt-1">
            {presentation.title}
          </h2>
          {presentation.subtitle && (
            <p className="text-xs text-room-text-muted mt-0.5">{presentation.subtitle}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => downloadPptx(presentation)}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-orange-500/20 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>실제 PPTX 파일 다운로드</span>
        </button>
      </div>

      {/* 슬라이드 프레젠테이션 뷰어 */}
      {slides.length > 0 && currentSlide ? (
        <div className="space-y-4">
          {/* 슬라이드 캔버스 (16:9 비율) */}
          <div className="w-full aspect-[16/9] max-h-[500px] bg-white rounded-2xl border-4 border-room-wood/30 shadow-desk overflow-hidden flex flex-col justify-between p-6 sm:p-10 relative">
            {/* 상단 슬라이드 인디케이터 */}
            <div className="flex items-center justify-between border-b border-room-wood/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-room-accent-warm text-white font-bold text-xs">
                  Slide {currentSlide.slideNumber} / {slides.length}
                </span>
                <span className="text-xs text-room-text-muted font-medium hidden sm:inline">
                  {presentation.title}
                </span>
              </div>
              <span className="text-[11px] text-room-wood-dark font-mono">My Study Room Slide</span>
            </div>

            {/* 슬라이드 메인 본문 */}
            <div className="my-auto py-4 space-y-4">
              <h3 className="text-xl sm:text-3xl font-black text-room-text-main leading-tight">
                {currentSlide.title}
              </h3>
              <ul className="space-y-3 pt-2">
                {currentSlide.bulletPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm sm:text-lg text-room-text-main/90 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-room-accent-warm mt-2 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 슬라이드 하단 푸터 */}
            <div className="flex items-center justify-between pt-3 border-t border-room-wood/10 text-[11px] text-room-text-light">
              <span>내 공부방 AI 학습 튜터 자동 생성</span>
              <span>{currentSlideIndex + 1} of {slides.length}</span>
            </div>
          </div>

          {/* 슬라이드 컨트롤러 & 발표자 스크립트 */}
          <div className="flex items-center justify-between bg-room-beige/40 p-3 rounded-xl border border-room-wood/30">
            <button
              type="button"
              disabled={currentSlideIndex === 0}
              onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-room-wood/30 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-room-beige/50"
            >
              <ChevronLeft className="w-4 h-4" /> 이전 슬라이드
            </button>

            {/* 슬라이드 번호 썸네일 점들 */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-none px-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentSlideIndex
                      ? "w-6 bg-room-accent-warm"
                      : "bg-room-wood hover:bg-room-wood-dark"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              disabled={currentSlideIndex === slides.length - 1}
              onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-room-wood/30 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-room-beige/50"
            >
              다음 슬라이드 <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 발표자 스크립트 (구어체 대본) */}
          {currentSlide.script && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Mic className="w-3.5 h-3.5 text-room-accent-warm" />
                  <span>발표자 추천 스크립트 (대본)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowScript(!showScript)}
                  className="text-[11px] text-amber-800 hover:underline"
                >
                  {showScript ? "접기" : "펼치기"}
                </button>
              </div>
              {showScript && (
                <p className="text-xs sm:text-sm text-amber-950/85 leading-relaxed font-sans italic whitespace-pre-line pl-2 border-l-2 border-amber-400">
                  "{currentSlide.script}"
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center text-room-text-muted bg-room-beige/20 rounded-2xl">
          슬라이드 데이터가 없습니다.
        </div>
      )}
    </div>
  );
};
