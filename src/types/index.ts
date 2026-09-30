export type ChoiceStyle = 'ABCD' | 'กขคง' | '1234';
export type LayoutId = 'SM' | 'MD' | 'LG';
export type ScanStatus = 'PENDING' | 'CONFIRMED' | 'CORRECTED' | 'ERROR';

export interface Exam {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  totalQuestions: number;        // 1 to 100
  choicesPerQuestion: 2 | 3 | 4 | 5;
  choiceStyle: ChoiceStyle;
  answerKey: string[];           // Length == totalQuestions
  layoutId: LayoutId;            // Auto-computed: SM (1-30), MD (31-60), LG (61-100)
  createdAt: string;
  updatedAt: string;
}

export interface ScanResult {
  id: string;
  examId: string;
  studentId: string;             // Decoded 8-digit or N-digit student ID from bubble grid
  studentName?: string;          // Optional student display name
  answers: string[];             // Raw detected answers per question
  correctedAnswers: string[];    // Manually verified/edited answers
  score: number;                 // Total correct answers
  percentage: number;            // (score / totalQuestions) * 100
  totalQuestions: number;
  ambiguousQuestions: number[];  // Question indexes with multiple fills (scored as 0 per ADR-005)
  status: ScanStatus;
  correctedManually: boolean;
  scannedAt: string;
}

export interface ClassSummary {
  examId: string;
  totalScanned: number;
  averageScore: number;
  maxScore: number;
  minScore: number;
  passCount: number;             // Score >= 60% (or pass threshold)
  failCount: number;
  passRate: number;              // (passCount / totalScanned) * 100
  distribution: { range: string; count: number }[];
  questionStats: {
    questionNumber: number;
    correctKey: string;
    correctCount: number;
    accuracyPercentage: number;
  }[];
}

export interface BubblePoint {
  x: number;
  y: number;
  fillRatio: number;
  isFilled: boolean;
}

export interface OMRDetectionSuccess {
  success: true;
  studentId: string;
  answers: string[];
  ambiguousQuestions: number[];
  confidence: number;
  previewCanvasDataUrl?: string;
}

export interface OMRDetectionError {
  success: false;
  errorCode: 'CORNER_NOT_FOUND' | 'LOW_CONTRAST' | 'INVALID_IMAGE' | 'UNREADABLE_GRID';
  message: string;
  tips: { th: string; en: string }[];
}

export type OMRDetectionResult = OMRDetectionSuccess | OMRDetectionError;

export interface TeacherUser {
  id: string;
  name: string;
  email: string;
  department: string;
  avatarUrl?: string;
}
