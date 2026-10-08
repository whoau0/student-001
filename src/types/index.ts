export interface KeywordItem {
  word: string;
  definition: string;
}

export interface SummarySection {
  title: string;
  content: string;
  keyPoints?: string[];
}

export interface SummaryData {
  title: string;
  overview: string;
  keyPoints: string[];
  sections: SummarySection[];
  keywords: KeywordItem[];
}

export interface SlideData {
  slideNumber: number;
  title: string;
  bulletPoints: string[];
  script: string;
  imageKeyword?: string;      // 슬라이드 주제에 맞는 영어 이미지 검색 키워드 (예: 'accounting data analysis', 'brain study education')
  imageUrl?: string;          // 고해상도 학습 이미지 URL
  badge?: string;             // 슬라이드 소제목/태그 (예: '핵심 개념', '실전 사례', '프로세스')
  keyTakeaway?: string;       // 슬라이드 한 줄 핵심 결론
  layout?: 'split-image' | 'card-grid' | 'hero' | 'takeaway';
}

export interface PresentationData {
  title: string;
  subtitle: string;
  authorNote?: string;
  coverImageKeyword?: string;
  slides: SlideData[];
}

export interface MultipleChoiceQuestion {
  id: number;
  question: string;
  options: string[];
  answerIndex: number; // 0-based
  explanation: string;
}

export interface ShortAnswerQuestion {
  id: number;
  question: string;
  answer: string;
  explanation: string;
}

export interface ExamData {
  title: string;
  description: string;
  multipleChoice: MultipleChoiceQuestion[];
  shortAnswer: ShortAnswerQuestion[];
}

export interface MindmapNode {
  id: string;
  label: string;
  description?: string;
  children?: MindmapNode[];
}

export interface MindmapData {
  root: MindmapNode;
}

export interface StudyMaterialResult {
  title: string;
  sourceType: 'youtube' | 'document' | 'text';
  sourceInfo?: string;
  modelUsed: string;
  generatedAt: string;
  summary: SummaryData;
  presentation: PresentationData;
  exam: ExamData;
  mindmap: MindmapData;
}

export interface GenerateRequestPayload {
  sourceType: 'youtube' | 'document' | 'text';
  youtubeUrl?: string;
  text?: string;
  fileName?: string;
}
