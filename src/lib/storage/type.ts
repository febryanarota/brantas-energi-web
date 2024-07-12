interface Storage {
  get(filename: string): Promise<string>;
  upload(filename: string, file: File): Promise<string>;
  delete(filename: string): Promise<void>;
  update(filename: string, file: File): Promise<string>;
}

export default Storage;
