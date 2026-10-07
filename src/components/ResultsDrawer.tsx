"use client";

import React, { useState } from "react";
import { StudyMaterialResult } from "@/types";
import { SummaryViewer } from "./SummaryViewer";
import { PresentationViewer } from "./PresentationViewer";
import { QuizViewer } from "./QuizViewer";
import { MindmapViewer } from "./MindmapViewer";
import { Archive, FileText, Presentation, FileQuestion, Network, Download, Sparkles, FolderArchive } from "lucide-react";
import { downloadAllZip } from "@/lib/exportUtils";

interface ResultsDrawerProps {
  material: StudyMaterialResult;
}

export const ResultsDrawer: React.FC<ResultsDrawerProps> = ({ material }) => {
  const [activeTab, setActiveTab] = useState<"summary" | "presentation" | "exam" | "mindmap">("summary");
  const [isZipping, setIsZipping] = useState(false);

  const handleDownloadAll = async () => {
    try {
      setIsZipping(true);
      await downloadAllZip(material);
    } catch (err) {
      console.error(err);
      alert("일괄 다운로드 생성 중 오류가 발생했습니다.");
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="w-full bg-room-beige/30 rounded-3xl border-3 border-room-wood p-4 sm:p-8 shadow-desk space-y-6">
      {/* 서랍 헤더 & 일괄 다운로드 버튼 */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/90 p-4 sm:p-5 rounded-2xl border border-room-wood/30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-room-wood-dark flex items-center justify-center text-white shadow-md">
            <Archive className="w-6 h-6 text-room-accent-yellow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-room-accent-olive/15 text-room-accent-olive">
                학습 자료 보관함
              </span>
              <span className="text-[11px] text-room-text-muted font-mono">
                Model: {material.modelUsed}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-room-text-main mt-0.5">
              {material.title}
            </h2>
          </div>
        </div>

        {/* 4종 일괄 다운로드 버튼 */}
        <button
          type="button"
          onClick={handleDownloadAll}
          disabled={isZipping}
          className="w-full md:w-auto px-5 py-3 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-room-accent-warm to-amber-600 hover:from-amber-600 hover:to-room-accent-warm text-white shadow-md shadow-room-accent-warm/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-100 shrink-0"
        >
          <FolderArchive className="w-4 h-4" />
          <span>{isZipping ? "ZIP 압축 중..." : "4종 학습 자료 전체 일괄 다운로드 (ZIP)"}</span>
        </button>
      </div>

      {/* 4종 서랍 탭 버튼 바 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-room-wood-light/40 p-1.5 rounded-2xl border border-room-wood/30">
        <button
          type="button"
          onClick={() => setActiveTab("summary")}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === "summary"
              ? "bg-white text-room-accent-warm shadow-sm border border-room-wood/20 scale-[1.02]"
              : "text-room-text-muted hover:text-room-text-main hover:bg-white/50"
          }`}
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span>1. 핵심 요약 정리</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("presentation")}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === "presentation"
              ? "bg-white text-room-accent-warm shadow-sm border border-room-wood/20 scale-[1.02]"
              : "text-room-text-muted hover:text-room-text-main hover:bg-white/50"
          }`}
        >
          <Presentation className="w-4 h-4 shrink-0" />
          <span>2. 강의/발표 PPT</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("exam")}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === "exam"
              ? "bg-white text-room-accent-warm shadow-sm border border-room-wood/20 scale-[1.02]"
              : "text-room-text-muted hover:text-room-text-main hover:bg-white/50"
          }`}
        >
          <FileQuestion className="w-4 h-4 shrink-0" />
          <span>3. 예상 기출문제</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("mindmap")}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === "mindmap"
              ? "bg-white text-room-accent-warm shadow-sm border border-room-wood/20 scale-[1.02]"
              : "text-room-text-muted hover:text-room-text-main hover:bg-white/50"
          }`}
        >
          <Network className="w-4 h-4 shrink-0" />
          <span>4. 마인드맵</span>
        </button>
      </div>

      {/* 활성화된 탭 내용 뷰어 */}
      <div className="bg-white rounded-2xl p-5 sm:p-8 border border-room-wood/30 shadow-sm animate-fade-in min-h-[400px]">
        {activeTab === "summary" && <SummaryViewer summary={material.summary} />}
        {activeTab === "presentation" && <PresentationViewer presentation={material.presentation} />}
        {activeTab === "exam" && <QuizViewer exam={material.exam} />}
        {activeTab === "mindmap" && <MindmapViewer mindmap={material.mindmap} />}
      </div>
    </div>
  );
};
