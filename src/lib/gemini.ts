import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// PRD Model List with Fallback Hierarchy
export const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-1.5-flash",
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
   - title: 프레젠테이션 메인 제목
   - subtitle: 부제
   - authorNote: 발표 가이드 노트
   - slides: 6~10장의 슬라이드 배열 (slideNumber, title, bulletPoints[3~5개], script[실제 구어체 발표 스크립트])

3. **예상 기출문제 세트 (Exam)**:
   - title: 실전 모의고사 / 기출 예상 문제
   - description: 시험 안내문 및 출제 범위
   - multipleChoice: 객관식 5~8문항 (id, question, options[4지 선다], answerIndex[0~3], explanation[상세 정답 해설])
   - shortAnswer: 단답형/서술형 주관식 3~5문항 (id, question, answer[모범답안], explanation[채점 기준 및 해설])

4. **한눈에 읽는 마인드맵 (Mindmap)**:
   - root: 중심 노드 (id: 'root', label: 핵심 주제명, description: 중심 테마)
   - children: 1차 대주제 (3~5개), 각 대주제 하위에 2차 소주제/핵심 키워드 계층 트리 구조 (각 node는 id, label, description, children 포함)

응답은 반드시 마크다운 코드블록(\`\`\`json ... \`\`\`) 없이 순수 JSON 문자열이거나 파싱 가능한 JSON 객체여야 합니다.
내용이 불분명하거나 텍스트가 부족한 경우 억지로 지어내지(환각) 말고 분석 가능한 범위 내에서 충실하게 작성하십시오.
`;

export const JSON_STRUCTURE_SCHEMA = {
  summary: {
    title: "학습 자료 제목",
    overview: "개요 설명",
    keyPoints: ["핵심 요점 1", "핵심 요점 2"],
    sections: [
      {
        title: "1단원: ...",
        content: "상세 내용 설명",
        keyPoints: ["소단원 요점 1"]
      }
    ],
    keywords: [
      { word: "용어", definition: "설명" }
    ]
  },
  presentation: {
    title: "PPT 제목",
    subtitle: "PPT 부제목",
    slides: [
      {
        slideNumber: 1,
        title: "슬라이드 제목",
        bulletPoints: ["요점 1", "요점 2", "요점 3"],
        script: "발표 스크립트입니다."
      }
    ]
  },
  exam: {
    title: "예상 기출문제집",
    description: "본 시험은 ...",
    multipleChoice: [
      {
        id: 1,
        question: "문제 내용?",
        options: ["1번 보기", "2번 보기", "3번 보기", "4번 보기"],
        answerIndex: 0,
        explanation: "해설 내용"
      }
    ],
    shortAnswer: [
      {
        id: 1,
        question: "주관식 문제?",
        answer: "정답",
        explanation: "해설 및 키포인트"
      }
    ]
  },
  mindmap: {
    root: {
      id: "root",
      label: "핵심 주제",
      description: "전체 테마",
      children: [
        {
          id: "node-1",
          label: "대주제 1",
          description: "설명",
          children: [
            { id: "node-1-1", label: "소주제 1-1", description: "설명" },
            { id: "node-1-2", label: "소주제 1-2", description: "설명" }
          ]
        }
      ]
    }
  }
};
