"use client";

import React, { useState } from "react";
import { Youtube, Play, Sparkles, ExternalLink, RefreshCw, CheckCircle2 } from "lucide-react";

interface MonitorSectionProps {
  youtubeUrl: string;
  setYoutubeUrl: (url: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const MonitorSection: React.FC<MonitorSectionProps> = ({
  youtubeUrl,
  setYoutubeUrl,
  onGenerate,
  isLoading,
}) => {
  const [copiedExample, setCopiedExample] = useState(false);

  // Extract YouTube ID for embed or thumbnail
  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = extractVideoId(youtubeUrl);
  const sampleUrl = "https://youtu.be/ZFh-2nwCHmI";

  const handleApplySample = () => {
    setYoutubeUrl(sampleUrl);
    setCopiedExample(true);
    setTimeout(() => setCopiedExample(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 모니터 프레임 */}
      <div className="w-full monitor-frame p-3 sm:p-5 text-white border-4 border-slate-700/60 transition-all duration-300">
        {/* 모니터 상단 웹브라우저 바 */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/80 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 font-mono text-slate-400 hidden sm:inline">Desk Monitor 01 — YouTube Study</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full text-[11px]">
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            <span>강의 영상 플레이어</span>
          </div>
        </div>

        {/* 모니터 화면 본문 */}
        <div className="bg-slate-900 rounded-xl p-3 sm:p-5 border border-slate-800 shadow-inner flex flex-col gap-4">
          {/* 유튜브 URL 입력 폼 */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                학습할 유튜브 영상 링크 입력
              </span>
              <button
                type="button"
                onClick={handleApplySample}
                className="text-[11px] font-normal text-room-accent-yellow hover:underline flex items-center gap-1"
              >
                {copiedExample ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-green-400" />
                    예시 링크 적용됨!
                  </>
                ) : (
                  <>예시 링크 불러오기</>
                )}
              </button>
            </label>

            <div className="relative flex items-center">
              <div className="absolute left-3 text-red-400">
                <Youtube className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... 또는 https://youtu.be/..."
                className="w-full bg-slate-800/90 text-white placeholder-slate-400 text-xs sm:text-sm pl-11 pr-24 py-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-room-accent-warm focus:border-transparent transition-all"
              />
              {youtubeUrl && (
                <button
                  type="button"
                  onClick={() => setYoutubeUrl("")}
                  className="absolute right-3 text-xs text-slate-400 hover:text-white bg-slate-700/80 hover:bg-slate-600 px-2 py-1 rounded-md"
                >
                  지우기
                </button>
              )}
            </div>
          </div>

          {/* 영상 프리뷰 창 */}
          <div className="w-full aspect-video bg-black/60 rounded-xl overflow-hidden border border-slate-800 relative flex items-center justify-center">
            {videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube Study Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-center p-6 flex flex-col items-center justify-center text-slate-400">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-red-400 mb-3">
                  <Play className="w-6 h-6 ml-1" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-300">
                  유튜브 URL을 입력하면 영상 프리뷰가 표시됩니다.
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  기말고사 강의, 회계/세무 실무, 자격증 특강 등 무엇이든 가능합니다.
                </p>
              </div>
            )}
          </div>

          {/* 생성 버튼 */}
          <button
            type="button"
            onClick={onGenerate}
            disabled={isLoading || !youtubeUrl.trim()}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all duration-200 ${
              isLoading || !youtubeUrl.trim()
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                : "bg-gradient-to-r from-room-accent-warm to-amber-600 hover:from-amber-600 hover:to-room-accent-warm text-white shadow-room-accent-warm/25 hover:shadow-room-accent-warm/40 hover:-translate-y-0.5 active:translate-y-0"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>AI가 공부방에서 자료를 꼼꼼히 정리 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>이 영상으로 학습 자료 4종 원클릭 생성하기</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 모니터 스탠드 & 받침대 메타포 */}
      <div className="w-12 h-5 monitor-stand" />
      <div className="w-36 h-3 rounded-t-lg monitor-base" />
    </div>
  );
};
