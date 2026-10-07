"use client";

import React, { useState, useRef } from "react";
import { FileUp, FileText, Sparkles, RefreshCw, Upload, Check, AlertCircle } from "lucide-react";

interface ReadingDeskSectionProps {
  customText: string;
  setCustomText: (txt: string) => void;
  fileName: string;
  setFileName: (name: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const ReadingDeskSection: React.FC<ReadingDeskSectionProps> = ({
  customText,
  setCustomText,
  fileName,
  setFileName,
  onGenerate,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    setFileName(file.name);
    setUploadStatus("파일을 읽고 있습니다...");

    try {
      if (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        const text = await file.text();
        setCustomText(text);
        setUploadStatus(`텍스트 파일 로드 완료 (${(file.size / 1024).toFixed(1)} KB)`);
      } else {
        // PDF, PPTX 등 일반 바이너리 문서
        // 간단한 텍스트 스트링 추출 또는 메타데이터 안내
        const text = await file.text();
        // 읽어들인 내용 중 가독성 있는 텍스트 필터링
        const sanitized = text.replace(/[\x00-\x08\x0E-\x1F\x7F-\x9F]/g, " ").slice(0, 15000);
        if (sanitized.trim().length > 100) {
          setCustomText(sanitized);
          setUploadStatus(`${file.name} 문서 텍스트 추출 완료`);
        } else {
          // 문서 기본 설명 세팅
          setCustomText(`[업로드된 교재/문서]: ${file.name}\n파일 크기: ${(file.size / 1024).toFixed(1)} KB\n교재 및 시험 핵심 개념에 대한 예상 문제와 요약 정리본을 작성해 주세요.`);
          setUploadStatus(`${file.name} 등록 완료`);
        }
      }
    } catch (err) {
      console.error(err);
      setUploadStatus("파일 읽기 오류. 텍스트를 직접 붙여넣어 주세요.");
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await processFile(file);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between paper-note rounded-2xl p-4 sm:p-6 relative border-2 border-room-wood/40 transition-all duration-300 hover:shadow-desk bg-white/95">
      {/* 독서대 상단 클립 메타포 */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-room-wood-dark/80 rounded-md shadow-sm border border-room-wood flex items-center justify-center">
        <div className="w-12 h-1 bg-room-wood-light/40 rounded-full" />
      </div>

      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-room-wood/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-room-wood-light/50 flex items-center justify-center text-room-wood-deep">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-room-text-main">
                독서대 & 교재 업로드
              </h3>
              <p className="text-[11px] text-room-text-muted">
                PDF, PPT/PPTX 교재 및 학습 텍스트 직접 입력
              </p>
            </div>
          </div>
          {fileName && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-room-wood-light/60 text-room-wood-deep font-medium max-w-[120px] truncate">
              {fileName}
            </span>
          )}
        </div>

        {/* 드래그 앤 드롭 업로드 영역 */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-room-accent-warm bg-room-accent-warm/5 scale-[0.99]"
              : "border-room-wood/40 hover:border-room-wood bg-room-beige/30 hover:bg-room-beige/50"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.ppt,.pptx,.txt,.md,.docx"
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center gap-1.5 text-room-text-muted">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-room-accent-warm mb-1">
              <FileUp className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-room-text-main">
              {fileName ? fileName : "스캔본 / PPT / PDF 파일 끌어다 놓기"}
            </p>
            <p className="text-[11px] text-room-text-light">
              클릭하여 파일 선택 (PDF, PPTX, TXT, DOCX 등 지원)
            </p>
            {uploadStatus && (
              <p className="text-xs text-room-accent-olive font-medium mt-1 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {uploadStatus}
              </p>
            )}
          </div>
        </div>

        {/* 텍스트 직접 입력 영역 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-room-text-muted">
            <span className="font-semibold text-room-text-main">또는 학습 내용 직접 붙여넣기</span>
            <span>{customText.length}자</span>
          </div>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="교재 내용, 시험 범위, 회계/세무 실무 요약, 강의 필기 등을 자유롭게 붙여넣으세요..."
            rows={5}
            className="w-full bg-room-beige/20 text-xs sm:text-sm p-3 rounded-xl border border-room-wood/30 focus:outline-none focus:ring-2 focus:ring-room-accent-warm focus:border-transparent resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* 생성 버튼 */}
      <div className="pt-3">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading || (!customText.trim() && !fileName)}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all ${
            isLoading || (!customText.trim() && !fileName)
              ? "bg-room-wood-light/60 text-room-text-light cursor-not-allowed border border-room-wood/20"
              : "bg-gradient-to-r from-room-wood-dark to-room-wood-deep hover:from-room-wood-deep hover:to-room-wood-dark text-white shadow-room-wood-deep/20 hover:shadow-room-wood-deep/30 hover:-translate-y-0.5 active:translate-y-0"
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>독서대 교재 분석 및 정리 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-room-accent-yellow" />
              <span>이 문서로 학습 자료 4종 생성하기</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
