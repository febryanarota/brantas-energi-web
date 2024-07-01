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
