interface Storage {
  get(filename: string): Promise<string>;
  upload(filename: string, file: File): Promise<string>;
  delete(filename: string): Promise<void>;
}

export default Storage;
