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
}

export interface PresentationData {
  title: string;
  subtitle: string;
  authorNote?: string;
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
