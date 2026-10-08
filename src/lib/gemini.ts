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
   - title: 학습 주제 제목
   - overview: 전체 개요 (2~3문단으로 이해하기 쉽게 정리)
   - keyPoints: 반드시 알아야 할 핵심 포인트 목록 (5~8개)
   - sections: 주제별 상세 소단원 정리 (title, content, keyPoints)
   - keywords: 핵심 전문용어/키워드 및 명쾌한 정의 (5~10개)

2. **강의/발표용 PPT 슬라이드 구성안 (Presentation)**:
   - NotebookLM처럼 시각적이고 직관적인 프레젠테이션을 위해 다음 요소를 풍부하게 포함하십시오:
   - title: 프레젠테이션 메인 제목
   - subtitle: 부제
   - coverImageKeyword: 표지에 어울리는 영문 키워드 (예: 'modern study education', 'financial business analytics')
   - authorNote: 발표 가이드 노트
   - slides: 6~10장의 슬라이드 배열
     * slideNumber: 번호 (1, 2, 3...)
     * title: 슬라이드 핵심 제목
     * badge: 슬라이드 분류 태그 (예: '핵심 개념', '원리 분석', '실전 응용', '주의사항', '결론')
     * bulletPoints: 3~4개의 핵심 불릿포인트 (문서식 나열이 아닌 명쾌하고 직관적인 문장)
     * keyTakeaway: 이 슬라이드에서 청중이 반드시 기억해야 할 한 줄 핵심 요약
     * imageKeyword: 슬라이드 주제와 가장 잘 어울리는 2~3개의 구체적인 영문 이미지 검색 키워드 (예: 'microscope biology lab', 'stock market chart monitor', 'student studying notebook desk', 'robotics artificial intelligence')
     * layout: 슬라이드 비주얼 레이아웃 ('split-image' | 'card-grid' | 'takeaway')
     * script: 실제 구어체 발표자 대본 (말투: "~입니다", "~를 보시면")

3. **예상 기출문제 세트 (Exam)**:
   - title: 실전 모의고사 / 기출 예상 문제
   - description: 시험 안내문 및 출제 범위
   - multipleChoice: 객관식 5~8문항 (id, question, options[4지 선다], answerIndex[0~3], explanation[상세 정답 해설])
   - shortAnswer: 단답형/서술형 주관식 3~5문항 (id, question, answer[모범답안], explanation[채점 기준 및 해설])

4. **한눈에 읽는 마인드맵 (Mindmap)**:
   - root: 중심 노드 (id: 'root', label: 핵심 주제명, description: 중심 테마)
   - children: 1차 대주제 (3~5개), 각 대주제 하위에 2차 소주제/핵심 키워드 계층 트리 구조 (각 node는 id, label, description, children 포함)

응답은 반드시 마크다운 코드블록(\`\`\`json ... \`\`\`) 없이 순수 JSON 문자열이거나 파싱 가능한 JSON 객체여야 합니다.
`;

// 주제별 고화질 Unsplash 이미지 URL 매퍼
export function getSlideImageUrl(keyword?: string, index: number = 0): string {
  const curatedImages = [
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80", // Study desk with notebook
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80", // Analytics & Strategy
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80", // Digital technology & learning
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80", // Team discussion & presentation
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80", // Classroom teaching & blackboard
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80", // Business data graph
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80", // Science laboratory & research
    "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&auto=format&fit=crop&q=80", // Laptop student studying
  ];

  if (keyword && keyword.trim().length > 0) {
    const encodedKeyword = encodeURIComponent(keyword.trim().toLowerCase());
    // Source unsplash with fallback to curated images
    return `https://images.unsplash.com/photo-${getPhotoIdByKeyword(keyword)}?w=800&auto=format&fit=crop&q=80` || curatedImages[index % curatedImages.length];
  }

  return curatedImages[index % curatedImages.length];
}

function getPhotoIdByKeyword(keyword: string): string {
  const kw = keyword.toLowerCase();
  if (kw.includes("finance") || kw.includes("account") || kw.includes("money") || kw.includes("tax")) {
    return "1554224155-8d04cb21cd6c"; // Accounting calculator & report
  }
  if (kw.includes("tech") || kw.includes("code") || kw.includes("ai") || kw.includes("computer")) {
    return "1518770660439-4636190af475"; // Chip / Technology
  }
  if (kw.includes("science") || kw.includes("physics") || kw.includes("chem") || kw.includes("lab")) {
    return "1532094349884-543bc11b234d"; // Lab test tubes
  }
  if (kw.includes("chart") || kw.includes("graph") || kw.includes("data") || kw.includes("stat")) {
    return "1460925895917-afdab827c52f"; // Financial charts
  }
  if (kw.includes("team") || kw.includes("meet") || kw.includes("present") || kw.includes("discuss")) {
    return "1522071820081-009f0129c71c"; // Team collaboration
  }
  if (kw.includes("brain") || kw.includes("idea") || kw.includes("mind") || kw.includes("think")) {
    return "1507413245164-6160d8298b31"; // Glowing light bulb idea
  }
  return "1434030216411-0b793f4b4173"; // Cozy study desk
}
