export interface DataItem {
  title: string;
  filePath: string;
}

export interface laporan {
  title: string;
  filePath: string;
  thumbnail: string;
}

export interface FormValues {
  question: string;
  answer: string;
}

export interface imageData {
  image: File;
  name: string;
  display: string;
}

export interface createFileImage {
  link: string | null;  
  file: File | null;
  image: File | null;
  title: string;
  id: number;
  fileName: string | null;
  imageName: string | null;
  imagePreview: string | undefined;
}

export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/vnd.ms-excel",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/epub+zip",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
