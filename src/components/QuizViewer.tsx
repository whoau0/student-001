"use client";

import React, { useState } from "react";
import { ExamData } from "@/types";
import { HelpCircle, CheckCircle, XCircle, Download, Eye, EyeOff, Award, FileQuestion } from "lucide-react";
import { downloadExamDocx } from "@/lib/exportUtils";
import confetti from "canvas-confetti";

interface QuizViewerProps {
  exam: ExamData;
}

export const QuizViewer: React.FC<QuizViewerProps> = ({ exam }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [showAllExplanations, setShowAllExplanations] = useState(false);
  const [showShortAnswerMap, setShowShortAnswerMap] = useState<{ [qId: number]: boolean }>({});

  const handleSelectOption = (qId: number, optionIdx: number, correctIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
    if (optionIdx === correctIdx) {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
      });
    }
  };

  const toggleShortAnswer = (qId: number) => {
    setShowShortAnswerMap((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div className="space-y-6">
      {/* 시험지 상단 툴바 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-room-wood/20">
        <div>
          <span className="text-xs font-bold text-room-accent-warm px-2.5 py-1 rounded-md bg-room-accent-warm/10">
            실전 모의고사 & 기출 예상문제
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-room-text-main mt-1">
            {exam.title}
          </h2>
          <p className="text-xs text-room-text-muted mt-0.5">
            {exam.description || "본 시험지는 AI 학습 튜터가 출제한 핵심 기출문제입니다."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAllExplanations(!showAllExplanations)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-room-beige/50 border border-room-wood/30 text-room-text-main transition-colors shadow-sm"
          >
            {showAllExplanations ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showAllExplanations ? "해설 숨기기" : "정답/해설 모두 보기"}</span>
          </button>
          <button
            type="button"
            onClick={() => downloadExamDocx(exam)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-room-wood-dark hover:bg-room-wood-deep text-white shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>시험지(.docx) 다운로드</span>
          </button>
        </div>
      </div>

      {/* 1부: 객관식 문제 리스트 */}
      <div className="space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-room-text-main flex items-center gap-2">
          <FileQuestion className="w-4 h-4 text-room-accent-warm" />
          【 1부 : 객관식 문제 】
          <span className="text-xs font-normal text-room-text-muted">
            (문제를 클릭하여 실시간 채점을 확인하세요)
          </span>
        </h3>

        <div className="space-y-4">
          {exam.multipleChoice.map((mc) => {
            const isAnswered = selectedAnswers[mc.id] !== undefined;
            const isCorrect = selectedAnswers[mc.id] === mc.answerIndex;

            return (
              <div
                key={mc.id}
                className={`bg-white rounded-2xl p-5 border transition-all shadow-sm ${
                  isAnswered
                    ? isCorrect
                      ? "border-emerald-300 ring-1 ring-emerald-200"
                      : "border-rose-300 ring-1 ring-rose-200"
                    : "border-room-wood/30 hover:border-room-wood"
                }`}
              >
                {/* 문제 타이틀 */}
                <div className="flex items-start gap-2.5 mb-3">
                  <span className="px-2 py-0.5 rounded-lg bg-room-beige text-room-wood-deep font-bold text-xs shrink-0 mt-0.5">
                    Q{mc.id}
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-room-text-main leading-snug">
                    {mc.question}
                  </h4>
                </div>

                {/* 4지 선다 보기 */}
                <div className="space-y-2 pl-2 sm:pl-7">
                  {mc.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[mc.id] === optIdx;
                    const isThisTheCorrectAnswer = mc.answerIndex === optIdx;

                    let btnStyle = "bg-room-beige/20 hover:bg-room-beige/50 border-room-wood/20 text-room-text-main";
                    if (isAnswered) {
                      if (isThisTheCorrectAnswer) {
                        btnStyle = "bg-emerald-50 border-emerald-400 text-emerald-950 font-bold";
                      } else if (isSelected) {
                        btnStyle = "bg-rose-50 border-rose-400 text-rose-950 font-bold";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(mc.id, optIdx, mc.answerIndex)}
                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-all ${btnStyle}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-white/80 border border-room-wood/30 text-[11px] font-bold flex items-center justify-center shrink-0">
                            {optIdx + 1}
                          </span>
                          <span>{opt}</span>
                        </span>
                        {isAnswered && isThisTheCorrectAnswer && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                        )}
                        {isAnswered && isSelected && !isThisTheCorrectAnswer && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 해설 영역 */}
                {(isAnswered || showAllExplanations) && (
                  <div className="mt-3.5 pt-3 border-t border-room-wood/15 pl-2 sm:pl-7">
                    <div className="text-xs bg-room-beige/40 p-3 rounded-xl border border-room-wood/20 space-y-1">
                      <div className="font-bold text-room-wood-deep flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-room-accent-warm" />
                        <span>정답: ({mc.answerIndex + 1}) {mc.options[mc.answerIndex]}</span>
                      </div>
                      <p className="text-room-text-muted leading-relaxed">
                        <span className="font-semibold text-room-text-main">해설:</span> {mc.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2부: 주관식 / 서술형 문제 리스트 */}
      {exam.shortAnswer && exam.shortAnswer.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-sm sm:text-base font-bold text-room-text-main flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-room-accent-navy" />
            【 2부 : 단답형 & 서술형 주관식 】
          </h3>

          <div className="space-y-4">
            {exam.shortAnswer.map((sa) => {
              const isOpen = showShortAnswerMap[sa.id] || showAllExplanations;

              return (
                <div key={sa.id} className="bg-white rounded-2xl p-5 border border-room-wood/30 shadow-sm space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="px-2 py-0.5 rounded-lg bg-blue-100 text-room-accent-navy font-bold text-xs shrink-0 mt-0.5">
                      서술형 {sa.id}
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-room-text-main leading-snug">
                      {sa.question}
                    </h4>
                  </div>

                  <div className="pl-2 sm:pl-7 space-y-2">
                    <textarea
                      placeholder="답안을 직접 머릿속으로 떠올려 보거나 여기에 메모해 보세요..."
                      rows={2}
                      className="w-full bg-room-beige/15 text-xs sm:text-sm p-3 rounded-xl border border-room-wood/25 focus:outline-none focus:ring-1 focus:ring-room-accent-navy resize-none"
                    />

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => toggleShortAnswer(sa.id)}
                        className="text-xs font-bold text-room-accent-navy hover:underline flex items-center gap-1"
                      >
                        {isOpen ? "모범답안 접기" : "모범답안 & 해설 확인"}
                      </button>
                    </div>

                    {isOpen && (
                      <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-200 text-xs space-y-1.5">
                        <div className="font-bold text-blue-900">
                          [모범 답안]: {sa.answer}
                        </div>
                        <p className="text-blue-800/80 leading-relaxed">
                          [채점 기준 및 해설]: {sa.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
