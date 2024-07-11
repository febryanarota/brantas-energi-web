export interface DataItem {
  title: string;
  filePath: string;
}

export interface laporan {
  title: string;
  filePath: string;
  thumbnail: string;
}

export interface qna {
  id: number;
  question: string;
  answer: string;
  position: number;
  created_at: Date;
}

export interface FormValues {
  question: string;
  answer: string;
}

export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
