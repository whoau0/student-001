"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { MonitorSection } from "@/components/MonitorSection";
import { ReadingDeskSection } from "@/components/ReadingDeskSection";
import { MemoBoardSection } from "@/components/MemoBoardSection";
import { ResultsDrawer } from "@/components/ResultsDrawer";
import { LoadingDesk } from "@/components/LoadingDesk";
import { StudyMaterialResult } from "@/types";
import { AlertTriangle, Sparkles, BookOpen, Clock, Heart, Award } from "lucide-react";

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState("https://youtu.be/ZFh-2nwCHmI");
  const [customText, setCustomText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [material, setMaterial] = useState<StudyMaterialResult | null>(null);

  const handleGenerateFromYouTube = async () => {
    if (!youtubeUrl.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: "youtube",
          youtubeUrl: youtubeUrl.trim(),
        }),
      });

      const responseText = await res.text();
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(
          `서버 응답 오류 (${res.status}): 요청 시간이 초과되었거나 서버에 일시적 장애가 발생했습니다.`
        );
      }

      if (!res.ok) {
        throw new Error(data.details || data.error || `생성 실패 (코드 ${res.status})`);
      }

      setMaterial(data);
      // 부드럽게 결과 서랍으로 스크롤 이동
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "학습 자료를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFromDocument = async () => {
    if (!customText.trim() && !fileName) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: "document",
          text: customText,
          fileName: fileName || "학습_교재",
        }),
      });

      const responseText = await res.text();
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(
          `서버 응답 오류 (${res.status}): 요청 시간이 초과되었거나 서버에 일시적 장애가 발생했습니다.`
        );
      }

      if (!res.ok) {
        throw new Error(data.details || data.error || `생성 실패 (코드 ${res.status})`);
      }

      setMaterial(data);
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "학습 자료를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-room-bg text-room-text-main">
      {/* 헤더 */}
      <Header modelUsed={material?.modelUsed} isGenerating={isLoading} />

      {/* 메인 공부방 데스크 컨테이너 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        {/* 공부방 상단 안내 & 핀보드 */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-room-text-main flex items-center gap-2">
                <span>📚 내 방 책상</span>
                <span className="text-xs font-normal text-room-text-muted bg-room-beige/80 px-2.5 py-1 rounded-full border border-room-wood/30">
                  아늑한 1:1 맞춤 학습 공간
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-room-text-muted mt-1">
                유튜브 영상 링크나 교재 파일을 올려두면, 프롬프트 입력 없이 원클릭으로 4종 학습 자료를 생성합니다.
              </p>
            </div>
          </div>

          {/* 코르크 핀보드 메타포 */}
          <MemoBoardSection modelUsed={material?.modelUsed} isGenerating={isLoading} />
        </section>

        {/* 에러 알림 배너 */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 flex items-start gap-3 animate-fade-in">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">학습 자료를 불러오지 못했습니다</h4>
              <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
              <p className="text-[11px] text-rose-600/80 mt-1">
                .env.local 파일의 `GEMINI_API_KEY` 값과 네트워크 연결 상태를 확인해 주세요.
              </p>
            </div>
          </div>
        )}

        {/* 책상 위 오브젝트 듀얼 레이아웃 (모니터 vs 독서대) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* 1. 모니터 메타포 (유튜브 영상 학습 존) */}
          <div className="w-full">
            <MonitorSection
              youtubeUrl={youtubeUrl}
              setYoutubeUrl={setYoutubeUrl}
              onGenerate={handleGenerateFromYouTube}
              isLoading={isLoading}
            />
          </div>

          {/* 2. 독서대 & 노트 메타포 (문서/교재 학습 존) */}
          <div className="w-full">
            <ReadingDeskSection
              customText={customText}
              setCustomText={setCustomText}
              fileName={fileName}
              setFileName={setFileName}
              onGenerate={handleGenerateFromDocument}
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* 로딩 인디케이터 */}
        {isLoading && (
          <section className="pt-4">
            <LoadingDesk />
          </section>
        )}

        {/* 3. 책장 서랍 / 파일철 보관함 메타포 (생성된 결과물 뷰어) */}
        {material && !isLoading && (
          <section id="results-section" className="pt-6 animate-fade-in">
            <ResultsDrawer material={material} />
          </section>
        )}
      </main>

      {/* 푸터 */}
      <footer className="w-full border-t border-room-wood/30 bg-room-beige/40 py-6 px-4 text-center text-xs text-room-text-muted mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 &lt;내 공부방&gt; AI 맞춤 학습 자료 자동 생성 서비스</p>
          <div className="flex items-center gap-4 text-[11px] text-room-text-light">
            <span>Next.js App Router</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Google Gemini AI</span>
            <span>•</span>
            <span>Supabase Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
