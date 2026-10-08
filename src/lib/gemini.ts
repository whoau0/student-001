import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// PRD Model List with Fallback Hierarchy
export const MODEL_CANDIDATES = [
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-1.5-pro",
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite"
];

export const SYSTEM_PROMPT = `
당신은 학생(초/중/고/대/자격증) 및 직장인(회계/세무/실무 등)을 위한 최고의 학습 자료 생성 AI 튜터 <내 공부방>입니다.
제공된 영상 자막 또는 문서 전문을 꼼꼼히 분석하여 다음 4가지 학습 자료를 정형화된 JSON 포맷으로 생성하십시오:

1. **전체 내용 요약 및 핵심 정리 (Summary)**:
   - title: 학습 주제 제목 (string)
   - overview: 전체 개요 (2~3문단으로 이해하기 쉽게 정리) (string)
   - keyPoints: 반드시 알아야 할 핵심 포인트 목록 (5~8개의 string 배열)
   - sections: 주제별 상세 소단원 정리 (title: string, content: string, keyPoints: string 배열)
   - keywords: 핵심 전문용어/키워드 및 명쾌한 정의 (word: string, definition: string 배열)

2. **강의/발표용 PPT 슬라이드 구성안 (Presentation)**:
   - title: 프레젠테이션 메인 제목 (string)
   - subtitle: 부제 (string)
   - coverImageKeyword: 표지 주제 영문 검색 키워드 1개 (string, 예: "accounting data")
   - authorNote: 발표 가이드 노트 (string)
   - slides: 6~10장의 슬라이드 배열
     * slideNumber: 번호 (number)
     * title: 슬라이드 핵심 제목 (string)
     * badge: 슬라이드 분류 태그 (string, 예: "핵심 개념", "원리 분석", "실전 응용")
     * bulletPoints: 3~4개의 핵심 불릿포인트 (string 배열)
     * keyTakeaway: 이 슬라이드의 한 줄 핵심 요약 (string)
     * imageKeyword: 슬라이드 주제와 어울리는 영문 키워드 (string, 예: "financial chart")
     * layout: "split-image" 또는 "card-grid" (string)
     * script: 발표자 추천 구어체 대본 (string)

3. **예상 기출문제 세트 (Exam)**:
   - title: 실전 모의고사 / 기출 예상 문제 (string)
   - description: 시험 안내문 및 출제 범위 (string)
   - multipleChoice: 객관식 5~8문항 (id: number, question: string, options: 4개의 string 배열, answerIndex: 0~3 사이 number, explanation: string)
   - shortAnswer: 단답형/서술형 주관식 3~5문항 (id: number, question: string, answer: string, explanation: string)

4. **한눈에 읽는 마인드맵 (Mindmap)**:
   - root: 중심 노드 (id: "root", label: string, description: string)
   - children: 1차 대주제 (3~5개), 각 대주제 하위에 2차 소주제/핵심 키워드 계층 트리 구조

모든 텍스트 필드는 반드시 순수 string이어야 합니다.
응답은 반드시 마크다운 코드블록 없이 순수 JSON 문자열 또는 파싱 가능한 JSON 객체여야 합니다.
`;

// 주제별 고화질 Unsplash 이미지 URL 매퍼 (모든 타입 방어)
export function getSlideImageUrl(keyword?: any, index: number = 0): string {
  const curatedImages = [
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80", // Study desk
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80", // Analytics & Strategy
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80", // Digital technology
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80", // Team discussion
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80", // Classroom teaching
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80", // Business chart
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80", // Laboratory science
    "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&auto=format&fit=crop&q=80", // Student laptop
  ];

  let rawKeyword = "";
  if (typeof keyword === "string") {
    rawKeyword = keyword;
  } else if (Array.isArray(keyword)) {
    rawKeyword = keyword.map(k => (typeof k === "string" ? k : "")).join(" ");
  } else if (keyword && typeof keyword === "object") {
    rawKeyword = Object.values(keyword)
      .filter(v => typeof v === "string")
      .join(" ");
  } else if (keyword != null) {
    rawKeyword = String(keyword);
  }

  const cleanKeyword = rawKeyword.trim();
  if (cleanKeyword.length > 0) {
    const photoId = getPhotoIdByKeyword(cleanKeyword);
    return `https://images.unsplash.com/photo-${photoId}?w=800&auto=format&fit=crop&q=80`;
  }

  return curatedImages[index % curatedImages.length];
}

function getPhotoIdByKeyword(keyword: string): string {
  const kw = (typeof keyword === "string" ? keyword : String(keyword)).toLowerCase();
  if (kw.includes("finance") || kw.includes("account") || kw.includes("money") || kw.includes("tax")) {
    return "1554224155-8d04cb21cd6c"; // Accounting calculator & report
  }
  if (kw.includes("tech") || kw.includes("code") || kw.includes("ai") || kw.includes("computer") || kw.includes("software")) {
    return "1518770660439-4636190af475"; // Technology chip
  }
  if (kw.includes("science") || kw.includes("physics") || kw.includes("chem") || kw.includes("lab") || kw.includes("biology")) {
    return "1532094349884-543bc11b234d"; // Lab test tubes
  }
  if (kw.includes("chart") || kw.includes("graph") || kw.includes("data") || kw.includes("stat") || kw.includes("market")) {
    return "1460925895917-afdab827c52f"; // Financial charts
  }
  if (kw.includes("team") || kw.includes("meet") || kw.includes("present") || kw.includes("discuss") || kw.includes("group")) {
    return "1522071820081-009f0129c71c"; // Team collaboration
  }
  if (kw.includes("brain") || kw.includes("idea") || kw.includes("mind") || kw.includes("think") || kw.includes("light")) {
    return "1507413245164-6160d8298b31"; // Idea light bulb
  }
  return "1434030216411-0b793f4b4173"; // Cozy study desk
}
