"use client";

import React, { useState } from "react";
import { MindmapData, MindmapNode } from "@/types";
import { Network, Download, ChevronRight, ChevronDown, Sparkles, Layers } from "lucide-react";
import { downloadText } from "@/lib/exportUtils";

interface MindmapViewerProps {
  mindmap: MindmapData;
}

// 재귀 노드 렌더러
const MindmapNodeItem: React.FC<{ node: MindmapNode; depth: number }> = ({ node, depth }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  // 깊이별 색상 테마
  const colors = [
    "bg-room-accent-warm text-white border-room-accent-warm shadow-md", // Depth 0 (Root)
    "bg-room-beige text-room-wood-deep border-room-wood-medium shadow-sm font-bold", // Depth 1
    "bg-white text-room-text-main border-room-wood/30 shadow-xs", // Depth 2
    "bg-room-bg text-room-text-muted border-room-wood/20 text-xs", // Depth 3+
  ];

  const currentStyle = colors[Math.min(depth, colors.length - 1)];

  return (
    <div className="flex flex-col items-start space-y-2 relative">
      <div className="flex items-center gap-2 group">
        <div
          className={`px-3.5 py-2 rounded-xl border transition-all duration-200 flex items-center gap-2 cursor-pointer hover:scale-[1.02] ${currentStyle}`}
          onClick={() => hasChildren && setIsOpen(!isOpen)}
        >
          {hasChildren && (
            <span className="shrink-0 text-current opacity-70">
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </span>
          )}
          <div>
            <span className="text-xs sm:text-sm">{node.label}</span>
            {node.description && (
              <p className="text-[11px] opacity-80 mt-0.5 font-normal line-clamp-2">
                {node.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 자식 노드들 (계층 트리 렌더링) */}
      {hasChildren && isOpen && (
        <div className="pl-6 border-l-2 border-room-wood/30 ml-3 space-y-3 pt-1">
          {node.children!.map((child) => (
            <MindmapNodeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const MindmapViewer: React.FC<MindmapViewerProps> = ({ mindmap }) => {
  const root = mindmap.root;

  const handleDownloadJson = () => {
    downloadText(JSON.stringify(mindmap, null, 2), `공부방_마인드맵_${root.label.slice(0, 10)}.json`);
  };

  return (
    <div className="space-y-6">
      {/* 마인드맵 상단 툴바 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-room-wood/20">
        <div>
          <span className="text-xs font-bold text-room-accent-warm px-2.5 py-1 rounded-md bg-room-accent-warm/10">
            한눈에 읽는 마인드맵
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-room-text-main mt-1">
            {root.label} 개념 트리
          </h2>
          <p className="text-xs text-room-text-muted mt-0.5">
            노드를 클릭하여 세부 하위 개념을 접거나 펼칠 수 있습니다.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadJson}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-room-wood-dark hover:bg-room-wood-deep text-white shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>마인드맵 데이터(.json) 다운로드</span>
        </button>
      </div>

      {/* 마인드맵 캔버스 영역 */}
      <div className="bg-gradient-to-br from-[#FAF6F0] to-white p-6 sm:p-10 rounded-2xl border-2 border-room-wood/30 shadow-inner overflow-x-auto min-h-[380px]">
        <div className="inline-block min-w-full">
          <MindmapNodeItem node={root} depth={0} />
        </div>
      </div>
    </div>
  );
};
