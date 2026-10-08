"use client";

import React, { useState } from "react";
import { PresentationData, SlideData } from "@/types";
import {
  Presentation,
  Download,
  ChevronLeft,
  ChevronRight,
  Mic,
  Sparkles,
  LayoutGrid,
  Maximize2,
  Image as ImageIcon,
  CheckCircle2,
  Lightbulb,
  Tag
} from "lucide-react";
import { downloadPptx } from "@/lib/exportUtils";
import { getSlideImageUrl } from "@/lib/gemini";

interface PresentationViewerProps {
  presentation: PresentationData;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({ presentation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showScript, setShowScript] = useState(true);
  const [viewMode, setViewMode] = useState<"slide" | "grid">("slide");
  const [isDownloading, setIsDownloading] = useState(false);

  const slides = presentation.slides || [];
  const currentSlide: SlideData | undefined = slides[currentSlideIndex];

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadPptx(presentation);
    } catch (err) {
      console.error(err);
      alert("PPTX 파일 다운로드 중 오류가 발생했습니다.");
    } finally {
      setIsDownloading(false);
    }
  };

  const getImageUrl = (slide: SlideData, idx: number) => {
    return slide.imageUrl || getSlideImageUrl(slide.imageKeyword || slide.title, idx);
  };

  return (
    <div className="space-y-6">
      {/* PPT 상단 툴바 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-room-wood/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-room-accent-warm px-2.5 py-1 rounded-md bg-room-accent-warm/10 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              NotebookLM 스타일 비주얼 슬라이드
            </span>
            <span className="text-xs text-room-text-muted font-medium">
              총 {slides.length}장
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-room-text-main mt-1">
            {presentation.title}
          </h2>
          {presentation.subtitle && (
            <p className="text-xs text-room-text-muted mt-0.5">{presentation.subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 뷰 모드 토글 */}
          <div className="bg-room-beige/60 p-1 rounded-xl border border-room-wood/30 flex items-center gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("slide")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === "slide"
                  ? "bg-white text-room-accent-warm shadow-xs font-bold"
                  : "text-room-text-muted hover:text-room-text-main"
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              슬라이드 뷰
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === "grid"
                  ? "bg-white text-room-accent-warm shadow-xs font-bold"
                  : "text-room-text-muted hover:text-room-text-main"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              전체 그리드
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-orange-500/20 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? "PPTX 생성 중..." : "실제 PPTX 다운로드"}</span>
          </button>
        </div>
      </div>

      {slides.length > 0 && currentSlide ? (
        viewMode === "slide" ? (
          /* 1. 슬라이드 뷰 모드 (NotebookLM 비주얼 레이아웃) */
          <div className="space-y-4">
            {/* 메인 16:9 슬라이드 카드 */}
            <div className="w-full bg-gradient-to-br from-white via-room-bg to-room-beige/20 rounded-3xl border-3 border-room-wood/40 shadow-desk overflow-hidden flex flex-col justify-between p-6 sm:p-8 min-h-[480px] relative">
              {/* 슬라이드 상단 헤더 */}
              <div className="flex items-center justify-between border-b border-room-wood/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-room-accent-warm text-white font-bold text-xs shadow-xs">
                    Slide {currentSlide.slideNumber} / {slides.length}
                  </span>
                  {currentSlide.badge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-room-wood-light/70 text-room-wood-deep font-semibold text-xs border border-room-wood/30">
                      {currentSlide.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-room-wood-dark font-mono flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  Visual AI Presentation
                </span>
              </div>

              {/* 슬라이드 본문: 2단 듀얼 레이아웃 (좌측: 텍스트 & 카드 / 우측: 관련 이미지 & 키워드) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto py-4 items-center">
                {/* 좌측: 텍스트 및 핵심 포인트 (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-room-text-main leading-tight tracking-tight">
                    {currentSlide.title}
                  </h3>

                  {/* 불릿 포인트 리스트 */}
                  <div className="space-y-2.5 pt-1">
                    {currentSlide.bulletPoints.map((point, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-room-wood/20 shadow-xs hover:border-room-accent-warm/40 transition-all"
                      >
                        <span className="w-5 h-5 rounded-full bg-room-accent-warm/15 text-room-accent-warm font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm font-medium text-room-text-main leading-relaxed">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* 한눈에 보는 Key Takeaway 박스 */}
                  {currentSlide.keyTakeaway && (
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-start gap-2 text-xs">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-900 mr-1">핵심 인사이트:</span>
                        <span className="text-amber-800/90">{currentSlide.keyTakeaway}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 우측: 고해상도 관련 이미지 & 비주얼 카드 (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-2">
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-room-wood/30 shadow-md relative group bg-room-beige/40">
                    <img
                      src={getImageUrl(currentSlide, currentSlideIndex)}
                      alt={currentSlide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                      <span className="text-[11px] font-medium text-white/90 drop-shadow-sm truncate flex items-center gap-1">
                        <Tag className="w-3 h-3 text-room-accent-yellow" />
                        {currentSlide.imageKeyword || currentSlide.title}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-room-text-light text-center">
                    * AI 자동 매핑 시각 자료 (주제: {currentSlide.imageKeyword || "학습 및 연구"})
                  </p>
                </div>
              </div>

              {/* 슬라이드 하단 푸터 */}
              <div className="flex items-center justify-between pt-3 border-t border-room-wood/10 text-[11px] text-room-text-light">
                <span>&lt;내 공부방&gt; AI 비주얼 프레젠테이션</span>
                <span>{currentSlideIndex + 1} / {slides.length}</span>
              </div>
            </div>

            {/* 슬라이드 컨트롤러 */}
            <div className="flex items-center justify-between bg-room-beige/40 p-3 rounded-2xl border border-room-wood/30 shadow-xs">
              <button
                type="button"
                disabled={currentSlideIndex === 0}
                onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-room-wood/30 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-room-beige/50 transition-all shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" /> 이전 슬라이드
              </button>

              {/* 슬라이드 썸네일 네비게이션 */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-[240px] sm:max-w-none px-2 py-1">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    title={`Slide ${idx + 1}`}
                    className={`transition-all ${
                      idx === currentSlideIndex
                        ? "w-7 h-3 rounded-full bg-room-accent-warm shadow-xs"
                        : "w-3 h-3 rounded-full bg-room-wood hover:bg-room-wood-dark"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                disabled={currentSlideIndex === slides.length - 1}
                onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-room-wood/30 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-room-beige/50 transition-all shadow-xs"
              >
                다음 슬라이드 <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 발표자 스크립트 (구어체 대본) */}
            {currentSlide.script && (
              <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 sm:p-5 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <Mic className="w-4 h-4 text-room-accent-warm" />
                    <span>발표자 추천 구어체 스크립트 (대본)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowScript(!showScript)}
                    className="text-xs text-amber-800 hover:underline font-semibold"
                  >
                    {showScript ? "대본 접기" : "대본 펼치기"}
                  </button>
                </div>
                {showScript && (
                  <p className="text-xs sm:text-sm text-amber-950/90 leading-relaxed font-sans italic whitespace-pre-line pl-3 border-l-3 border-amber-400">
                    "{currentSlide.script}"
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          /* 2. 전체 그리드 뷰 모드 (모든 슬라이드를 이미지와 함께 한눈에 조망) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  setViewMode("slide");
                }}
                className="bg-white rounded-2xl p-4 border-2 border-room-wood/30 hover:border-room-accent-warm shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* 슬라이드 썸네일 이미지 */}
                  <div className="w-full aspect-video rounded-xl overflow-hidden bg-room-beige/30 relative">
                    <img
                      src={getImageUrl(slide, idx)}
                      alt={slide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white font-bold text-[11px]">
                      #{slide.slideNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-room-accent-warm uppercase tracking-wider">
                      {slide.badge || `Slide ${slide.slideNumber}`}
                    </span>
                    <h4 className="text-sm font-bold text-room-text-main line-clamp-1 group-hover:text-room-accent-warm transition-colors">
                      {slide.title}
                    </h4>
                  </div>

                  <ul className="space-y-1">
                    {slide.bulletPoints.slice(0, 2).map((bp, bpIdx) => (
                      <li key={bpIdx} className="text-xs text-room-text-muted line-clamp-1 flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-room-accent-warm shrink-0 mt-1.5" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 mt-3 border-t border-room-wood/15 flex items-center justify-between text-[11px] text-room-text-light">
                  <span>클릭하여 상세 보기</span>
                  <ChevronRight className="w-3.5 h-3.5 text-room-accent-warm" />
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="p-8 text-center text-room-text-muted bg-room-beige/20 rounded-2xl">
          슬라이드 데이터가 없습니다.
        </div>
      )}
    </div>
  );
};
