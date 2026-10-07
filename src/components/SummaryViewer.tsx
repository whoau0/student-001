"use client";

import React, { useState } from "react";
import { SummaryData } from "@/types";
import { BookOpen, CheckCircle2, Bookmark, FileText, Download, Copy, Check } from "lucide-react";
import { downloadSummaryDocx, downloadText } from "@/lib/exportUtils";

interface SummaryViewerProps {
  summary: SummaryData;
}

export const SummaryViewer: React.FC<SummaryViewerProps> = ({ summary }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyText = () => {
    let text = `${summary.title}\n\n[개요]\n${summary.overview}\n\n[핵심 요약]\n`;
    summary.keyPoints.forEach(kp => text += `• ${kp}\n`);
    text += `\n[단원별 정리]\n`;
    summary.sections.forEach(sec => {
      text += `\n▶ ${sec.title}\n${sec.content}\n`;
      if (sec.keyPoints) sec.keyPoints.forEach(p => text += `  - ${p}\n`);
    });
    text += `\n[핵심 용어]\n`;
    summary.keywords.forEach(kw => text += `• ${kw.word}: ${kw.definition}\n`);

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 요약 상단 툴바 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-room-wood/20">
        <div>
          <span className="text-xs font-bold text-room-accent-warm px-2.5 py-1 rounded-md bg-room-accent-warm/10">
            핵심 요약 정리본
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-room-text-main mt-1">
            {summary.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-room-beige/50 border border-room-wood/30 text-room-text-main transition-colors shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "복사됨!" : "텍스트 복사"}</span>
          </button>
          <button
            type="button"
            onClick={() => downloadSummaryDocx(summary)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-room-wood-dark hover:bg-room-wood-deep text-white shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.docx 다운로드</span>
          </button>
        </div>
      </div>

      {/* 1. 핵심 개요 */}
      <div className="bg-room-beige/30 rounded-2xl p-5 border border-room-wood/25">
        <h3 className="text-sm font-bold text-room-wood-deep flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-room-accent-warm" />
          전체 개요 (Overview)
        </h3>
        <p className="text-xs sm:text-sm text-room-text-main leading-relaxed whitespace-pre-line">
          {summary.overview}
        </p>
      </div>

      {/* 2. 핵심 요점 (Key Points) */}
      <div className="bg-white rounded-2xl p-5 border border-room-wood/30 shadow-sm">
        <h3 className="text-sm font-bold text-room-text-main flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-room-accent-olive" />
          필수 암기 & 핵심 포인트
        </h3>
        <ul className="space-y-2.5">
          {summary.keyPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-room-text-main">
              <span className="w-5 h-5 rounded-full bg-room-accent-olive/15 text-room-accent-olive font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-snug">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. 단원별 세부 정리 */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-room-text-main flex items-center gap-2">
          <FileText className="w-4 h-4 text-room-accent-navy" />
          단원별 세부 내용 정리
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {summary.sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-room-wood/25 shadow-sm space-y-3">
              <h4 className="text-sm sm:text-base font-bold text-room-wood-deep flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-room-accent-warm" />
                {section.title}
              </h4>
              <p className="text-xs sm:text-sm text-room-text-main/90 leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
              {section.keyPoints && section.keyPoints.length > 0 && (
                <div className="bg-room-beige/20 p-3 rounded-xl border border-room-wood/15 space-y-1.5">
                  <span className="text-[11px] font-bold text-room-wood-dark">소단원 요점</span>
                  <ul className="list-disc list-inside text-xs text-room-text-muted space-y-1">
                    {section.keyPoints.map((skp, skpIdx) => (
                      <li key={skpIdx}>{skp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. 핵심 전문 용어 사전 */}
      <div className="bg-gradient-to-br from-room-beige/40 to-white rounded-2xl p-5 border border-room-wood/30 shadow-sm">
        <h3 className="text-sm font-bold text-room-text-main flex items-center gap-2 mb-3">
          <Bookmark className="w-4 h-4 text-room-accent-warm" />
          핵심 전문 용어 사전
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {summary.keywords.map((kw, idx) => (
            <div key={idx} className="bg-white p-3.5 rounded-xl border border-room-wood/20 shadow-xs">
              <div className="font-bold text-xs sm:text-sm text-room-accent-navy mb-1">
                {kw.word}
              </div>
              <div className="text-xs text-room-text-muted leading-relaxed">
                {kw.definition}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
